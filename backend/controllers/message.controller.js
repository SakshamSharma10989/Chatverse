import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      status: "sent",
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      newMessage.status = "delivered";
      await newMessage.save();
      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("deliveryReceipt", { messageId: newMessage._id });
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: chatToId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, chatToId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log("Error in getMessage controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId, messageIds } = req.body;
    const userId = req.user._id;
    console.log("markMessageAsRead:", { messageId, messageIds, userId });
    const receiver = await User.findById(userId);
    if (!receiver.readReceiptsEnabled) {
      console.log("Read receipts disabled for:", userId);
      return res.status(200).json({ success: true });
    }
    const ids = messageIds || [messageId];
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      console.log("Invalid message IDs:", ids);
      return res.status(400).json({ error: "Invalid message IDs" });
    }
    const messages = await Message.find({
      _id: { $in: ids },
      receiverId: userId,
      status: { $ne: "read" },
    });
    console.log("Found messages:", messages.map(m => ({ id: m._id, status: m.status, receiverId: m.receiverId })));
    if (messages.length === 0) {
      console.log("No unread messages found for:", { ids, userId });
      const allMessages = await Message.find({ _id: { $in: ids } });
      console.log("All messages:", allMessages.map(m => ({ id: m._id, status: m.status, receiverId: m.receiverId })));
      return res.status(404).json({ error: "Message not found" });
    }
    await Message.updateMany(
      { _id: { $in: messages.map((m) => m._id) } },
      { status: "read" }
    );
    messages.forEach((message) => {
      const senderSocketId = getReceiverSocketId(message.senderId);
      console.log("Sender socket:", senderSocketId, "for:", message.senderId);
      if (senderSocketId) {
        console.log("Emitting readReceipt:", message._id);
        io.to(senderSocketId).emit("readReceipt", { messageId: message._id });
      }
    });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("markMessageAsRead error:", error.message, error.stack);
    res.status(error.name === "CastError" ? 400 : 500).json({ error: error.message });
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user?._id;

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    if (!receiverId) return res.status(400).json({ message: "Receiver ID is required" });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
    const mediaUrl = uploadResult.secure_url;
    console.log("Cloudinary URL:", mediaUrl);

    // Clean up local file
    fs.unlinkSync(req.file.path);

    // Ensure conversation exists
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        messages: [],
      });
    }

    // Create and save message
    const newMessage = new Message({
      senderId,
      receiverId,
      mediaUrl,
      message: "",
      status: "sent",
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([newMessage.save(), conversation.save()]);

    // Emit real-time events
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
      newMessage.status = "delivered";
      await newMessage.save();

      const senderSocketId = getReceiverSocketId(senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit("deliveryReceipt", { messageId: newMessage._id });
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in uploadMedia:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
