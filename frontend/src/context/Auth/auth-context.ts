import { createContext } from "react";
import type { AxiosStatic } from "axios";
import type { Socket } from "socket.io-client";

export interface User {
  _id: string;
  fullName?: string;
  email?: string;
  bio?: string;
  profileImage?: File | null | string;
}

export type AuthState = "login" | "signup";

export interface Credentials {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  bio?: string;
  profilePic?: string;
}

export interface AuthContextType {
  axios: AxiosStatic;
  authUser: User | null;
  onlineUsers: string[];
  socket: Socket | null;
  login: (state: AuthState, credentials: Credentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
