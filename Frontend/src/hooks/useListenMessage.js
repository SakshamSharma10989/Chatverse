import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("New message:", newMessage._id);
      newMessage.shouldShake = true;
      setMessages([...messages, newMessage]);
    });

    socket?.on("readReceipt", ({ messageId }) => {
      console.log("Read receipt received:", messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "read" } : msg
        )
      );
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("readReceipt");
    };
  }, [socket, setMessages, messages]);
};

export default useListenMessage;