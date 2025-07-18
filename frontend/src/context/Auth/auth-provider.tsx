import {
  AuthContext,
  type AuthContextType,
  type User,
  type AuthState,
  type Credentials,
  type UpdateProfilePayload,
} from "./auth-context";

import { useCallback, useState, type ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io, type Socket } from "socket.io-client";
import type { AxiosError } from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectedSocket = (userData: User) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(backendUrl, {
      query: { userId: userData._id },
    });
    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });
  };

  const checkAuth = useCallback(async () => {
    try {
      const { data } = await axios.get("/auth/check");
      if (data.success) {
        setAuthUser(data.user);
        connectedSocket(data.user);
      }
    } catch (error: unknown) {
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
  }, []);

  const value: AuthContextType = {
    axios,
    authUser,
    onlineUsers,
    socket,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
