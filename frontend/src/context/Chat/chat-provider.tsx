import {
  ChatContext,
  type ChatContextType,
  type Message,
  type User,
} from "./chat-context";

import { useState, type ReactNode } from "react";
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

  const { axios } = useAuth();

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

  const value: ChatContextType = {
    messages,
    users,
    unseenMessages,
    selectedUser,
    setUnseenMessages,
    setSelectedUser,
    getUsers,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
