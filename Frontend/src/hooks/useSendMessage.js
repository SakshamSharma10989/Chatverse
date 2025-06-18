import { useState, useEffect } from "react"; // MODIFIED: Add useEffect
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { useSocketContext } from "../context/SocketContext"; // NEW
import { useAuthContext } from "../context/Authcontext"; // NEW

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const { socket } = useSocketContext(); // NEW
  const { authUser } = useAuthContext(); // NEW

  const sendMessage = async (message) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/message/send/${selectedConversation._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setMessages([...messages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Update message status
  const updateMessageStatus = (messageId, status) => {
    setMessages(
      messages.map((msg) =>
        msg._id === messageId ? { ...msg, status } : msg
      )
    );
  };

  // NEW: Listen for delivery and read receipts
  useEffect(() => {
    socket?.on("deliveryReceipt", ({ messageId }) => {
      updateMessageStatus(messageId, "delivered");
    });
    socket?.on("readReceipt", ({ messageId }) => {
      updateMessageStatus(messageId, "read");
    });

    return () => {
      socket?.off("deliveryReceipt");
      socket?.off("readReceipt");
    };
  }, [socket, messages, updateMessageStatus]);

  return { sendMessage, loading, updateMessageStatus }; // MODIFIED: Expose updateMessageStatus
};

export default useSendMessage;