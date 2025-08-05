import React, { createContext } from "react";

export interface User {
  _id: string;
  fullName?: string;
  email?: string;
  bio?: string;
  profileImage?: File | null | string;
}


export interface messagePayload {
  text?: string;
  image?: string;
}

export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  seen?: boolean;
  createdAt?: string;
};

export interface ChatContextType {
  messages: Message[];
  users: User[];
  unseenMessages: Record<string, number>;
  setUnseenMessages: React.Dispatch<React.SetStateAction<Record<string, number>>>
  selectedUser: User | null;
  setSelectedUser: React.Dispatch<React.SetStateAction<User | null>>;
  getUsers: () => Promise<void>;
  getMessages: (id: string) => Promise<void>;
  sendMessages: (data: messagePayload) => Promise<void>;
  subscribeToMessage: () => Promise<void>;
  unSubscribeFromMessage: () => void;
}

export const ChatContext = createContext<ChatContextType | null>(null);
