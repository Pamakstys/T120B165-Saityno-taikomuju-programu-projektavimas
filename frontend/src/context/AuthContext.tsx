import React, { createContext, useContext, useEffect, useState} from "react";
import {type  ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "guest" | "publisher";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  const refreshUser = async () => {
  try {
    const res = await fetch(`${apiUrl}/user`, {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const data: User = await res.json();
      setUser(data);
    } else {
      try {
        const data = await res.json();
        if (data?.detail === "Token Expired") {
          setUser(null);
          window.location.href = "/login";
          return;
        }
      } catch {
        // ignore JSON parse errors
      }
      setUser(null);
    }
  } catch {
    setUser(null);
  } finally {
    setLoading(false);
  }
};

  const logout = async () => {
  const res = await fetch(`${apiUrl}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (res.status === 403) {
    try {
      const data = await res.json();
      if (data?.detail === "Token Expired") {
        setUser(null);
        return;
      }
    } catch {
      // ignore JSON parse errors
    }
  }

  setUser(null);
};

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
