import {
  AuthContext,
  type AuthContextType,
  type User,
  type AuthState,
  type Credentials,
  type UpdateProfilePayload,
} from "./auth-context";

import { useState, type ReactNode } from "react";
import axios from "axios";
import { io, type Socket } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);


  const value: AuthContextType = {
    axios,
    authUser,
    onlineUsers,
    socket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
