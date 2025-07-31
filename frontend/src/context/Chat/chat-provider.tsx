import {
  ChatContext,
  type ChatContextType,
  type Message,
  type User,
  type messagePayload,
} from "./chat-context";

import { useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { useAuth } from "../Auth/useAuth";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
axios.defaults.baseURL = backendUrl;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {}
  );

  const { socket, axios } = useAuth();

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/message/user");
      if (data.success) {
        setUsers(data.user);
        setUnseenMessages(data.messages);
      }
    } catch (error) {
      console.error(error);

      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error
      ) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message;
        toast.error(message || "Request failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getMessages = async (id: string) => {
    try {
      const { data } = await axios.get(`/message/${id}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error(error);

      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error
      ) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message;
        toast.error(message || "Request failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const sendMessages = async (messageData: messagePayload) => {
    try {
      const { data } = await axios.post(
        `/message/send/${selectedUser?._id}`,
        messageData
      );
      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);

      if (
        typeof error === "object" &&
        error !== null &&
        "isAxiosError" in error
      ) {
        const axiosError = error as AxiosError<{ message: string }>;
        const message = axiosError.response?.data?.message;
        toast.error(message || "Request failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const subscribeToMessage = async () => {
    if (!socket) return;
    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.seen]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  const unSubscribeFromMessage = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessage();
    return () => unSubscribeFromMessage();
  }, [socket, selectedUser]);

  const value: ChatContextType = {
    messages,
    users,
    unseenMessages,
    selectedUser,
    setUnseenMessages,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessages,
    subscribeToMessage,
    unSubscribeFromMessage,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
