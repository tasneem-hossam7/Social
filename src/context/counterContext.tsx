import { createContext, type ReactNode } from "react";
const CounterContext = createContext<Record<string, never>>({});
export default function CounterContextprovider({ children }: { children: ReactNode }) {
  return <CounterContext.Provider value={{}}>{children}</CounterContext.Provider>;
}
