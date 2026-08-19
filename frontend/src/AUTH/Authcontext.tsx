import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import api from "../URI/AXIOS";

type AuthUser = Record<string, unknown> | null;

type RegisterPayload = {
  name: string;
  phone: string;
  password: string;
};

type LoginPayload = {
  phone: string;
  password: string;
};

type AuthContextValue = {
  user: AuthUser;
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<unknown>;
  register: (payload: RegisterPayload) => Promise<unknown>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user as AuthUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUser();
  }, []);

  const register = async ({ name, phone, password }: RegisterPayload) => {
    const res = await api.post("/auth/register", { name, phone, password });
    return res.data;
  };

  const login = async ({ phone, password }: LoginPayload) => {
    const res = await api.post("/auth/login", { phone, password });
    setUser(res.data.user as AuthUser);
    return res.data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}