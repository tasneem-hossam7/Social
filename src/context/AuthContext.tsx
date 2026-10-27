import { createContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
  userLogin: string | null;
  setUserLogin: (token: string | null) => void;
};
export const AuthContext = createContext<AuthContextType>({
  userLogin: null,
  setUserLogin: () => {},
});
export default function AuthContextprovider({ children }: { children: ReactNode }) {
  const [userLogin, setUserLogin] = useState<string | null>(() => localStorage.getItem("token"));
  useEffect(() => {
    if (userLogin) localStorage.setItem("token", userLogin);
    else localStorage.removeItem("token");
  }, [userLogin]);
  return <AuthContext.Provider value={{ userLogin, setUserLogin }}>{children}</AuthContext.Provider>;
}
