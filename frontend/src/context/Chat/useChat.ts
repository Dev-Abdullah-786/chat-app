import { useContext } from "react";
import { ChatContext } from "./chat-context";
import type { ChatContextType } from "./chat-context";

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within an ChatProvider");
  }
  return context;
};
