import Conversation from "../models/conversation.model.js"
import Message from "../models/message.model.js"
import { getReceiverSocketId } from "../socket/socket.js"

export const sendMessage=async(req,res)=>{
   try {
     const {message}=req.body
     const {id:receiverId}=req.params
     const senderId=req.user._id
     

     let conversation= await Conversation.findOne({
        participants:{$all:[senderId,receiverId]}
     })

     if(!conversation){
        conversation=await Conversation.create({
            participants:[senderId,receiverId],

        })
     }

     const newMessage= new Message({
        senderId:senderId,
        receiverId:receiverId,
        message:message
     })

     if(newMessage){
        conversation.messages.push(newMessage._id)
     }

    //  await conversation.save()
    //  await newMessage.save()
   
    //This will run in parallel
     await Promise.all([conversation.save(),newMessage.save()])

     const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			// io.to(<socket_id>).emit() used to send events to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

     res.status(201).json(newMessage)
   } catch (error) {
    console.log("Error in sendMessage controller:",error.message)
    res.status(500).json({error:"Internal Server Error"})
   }
}

export const getMessage=async(req,res)=>{
   try {
      
      const {id:chatToId}=req.params
      const senderId=req.user._id

      const conversation= await Conversation.findOne({
         participants:{$all:[senderId,chatToId]},
      }).populate("messages")  //not reference but actual message

      if(!conversation){
         return res.status(200).json([])
      }

      res.status(200).json(conversation.messages)

   } catch (error) {
      console.log("Error in getMessage controller:",error.message)
    res.status(500).json({error:"Internal Server Error"})
   }
}
