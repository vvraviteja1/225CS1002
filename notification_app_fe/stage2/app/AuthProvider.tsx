// app/AuthProvider.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getAuthToken } from "../utils/api";
import { setAuthToken, Log } from "../utils/logger";

interface AuthContextType {
  token: string;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  token: "",
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

interface Props {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        console.log("[Auth] Starting authentication...");

        const authToken = await getAuthToken();

        if (!authToken) {
          console.error("[Auth] Empty token received");

          setLoading(false);
          return;
        }

        console.log("[Auth] Authentication successful");

        setToken(authToken);

        setAuthToken(authToken);

        await Log(
          "info",
          "auth",
          "Authentication successful"
        );
      } catch (err) {
        console.error("[Auth] Failed:", err);

        await Log(
          "fatal",
          "auth",
          `Authentication crashed: ${String(err)}`
        );
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}