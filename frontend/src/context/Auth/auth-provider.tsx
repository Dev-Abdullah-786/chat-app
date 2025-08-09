import {
  AuthContext,
  type AuthContextType,
  type User,
  type AuthState,
  type Credentials,
  type UpdateProfilePayload,
} from "./auth-context";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io, type Socket } from "socket.io-client";
import type { AxiosError } from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const socketUrl = import.meta.env.VITE_SOCKET_URL;
axios.defaults.baseURL = backendUrl;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  const connectedSocket = (userData: User) => {
    if (!userData || socket?.connected) return;
    const newSocket = io(socketUrl, {
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

  const login = async (state: AuthState, credentials: Credentials) => {
    try {
      const { data } = await axios.post(`/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.user);
        connectedSocket(data.user);
        axios.defaults.headers.common["token"] = data.token;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message);
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
  };

  const logout = async () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["token"] = null;
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    toast.success("Logged out successfully");
    socket?.disconnect();
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      const { data } = await axios.put("/auth/update-profile", payload);
      if (data.success) {
        setAuthUser(data.user);
        toast.success(data.message);
      } else {
        toast.error(data.message);
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
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["token"] = token;
    }
    checkAuth();
  }, [token, checkAuth]);

  const value: AuthContextType = {
    axios,
    authUser,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
