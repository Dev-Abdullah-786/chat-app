import {
  ChatContext,
  type ChatContextType,
  type Message,
  type User,
} from "./chat-context";

import { useState, type ReactNode } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
axios.defaults.baseURL = backendUrl;

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [unseenMessages, setUnseenMessages] = useState<Record<string, number>>(
    {}
  );


  const value: ChatContextType = {
    messages,
    users,
    unseenMessages,
    selectedUser,
    setUnseenMessages,
    setSelectedUser,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
