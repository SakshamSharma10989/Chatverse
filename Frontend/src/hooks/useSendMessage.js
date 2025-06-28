import { useState, useEffect } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();

  console.log("useSendMessage initialized", { selectedConversation, authUser, messages });

  const sendMessage = async (content) => {
    console.log("sendMessage called with content:", content);
    if (!selectedConversation?._id) {
      console.error("No selected conversation ID");
      toast.error("No conversation selected");
      setLoading(false);
      return;
    }
    setLoading(true);
   try {
  let data;
  const baseUrl = import.meta.env.VITE_API_URL;

  if (typeof content === "string") {
    console.log("Sending text message to:", `${baseUrl}/api/message/send/${selectedConversation._id}`);
    const res = await fetch(`${baseUrl}/api/message/send/${selectedConversation._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: content }),
    });
    console.log("Text message response status:", res.status);
    data = await res.json();
    console.log("Text message response data:", data);
  } else if (content instanceof File) {
    console.log("Sending file to:", `${baseUrl}/api/message/upload/${selectedConversation._id}`, content.name);
    const formData = new FormData();
    formData.append("media", content);
    const res = await fetch(`${baseUrl}/api/message/upload/${selectedConversation._id}`, {
      method: "POST",
      body: formData,
    });
    console.log("File upload response status:", res.status);
    data = await res.json();
    console.log("File upload response data:", data);
  } else {
    throw new Error("Invalid content type");
  }

  if (data.error) throw new Error(data.error);
  console.log("Updating messages with:", data);
  setMessages([...messages, data]);
  console.log("Messages after update:", [...messages, data]);
}
catch (error) {
      console.error("Error in sendMessage:", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    console.log("Updating message status:", { messageId, status });
    setMessages(
      messages.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg
      )
    );
  };

  useEffect(() => {
    console.log("Setting up socket listeners");
    socket?.on("deliveryReceipt", ({ messageId }) => {
      console.log("Received delivery receipt:", messageId);
      updateMessageStatus(messageId, "delivered");
    });
    socket?.on("readReceipt", ({ messageId }) => {
      console.log("Received read receipt:", messageId);
      updateMessageStatus(messageId, "read");
    });

    return () => {
      console.log("Cleaning up socket listeners");
      socket?.off("deliveryReceipt");
      socket?.off("readReceipt");
    };
  }, [socket, messages, updateMessageStatus]);

  return { sendMessage, loading, updateMessageStatus };
};

export default useSendMessage;