import { createContext, useState, type ReactNode, useContext } from "react";
import type { RepositoryInfo } from "@/types";

interface RepositoryContextType {
  repositoryInfo: RepositoryInfo | null;
  setRepositoryInfo: (info: RepositoryInfo | null) => void;
}

const RepositoryContext = createContext<RepositoryContextType | undefined>(
  undefined
);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [repositoryInfo, setRepositoryInfo] = useState<RepositoryInfo | null>(
    null
  );

  return (
    <RepositoryContext.Provider value={{ repositoryInfo, setRepositoryInfo }}>
      {children}
    </RepositoryContext.Provider>
  );
}

export function useRepository() {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
}

export { RepositoryContext };
