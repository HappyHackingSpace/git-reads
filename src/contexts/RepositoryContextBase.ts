import { createContext } from "react";
import type { RepositoryContextType } from "./RepositoryContext";

export const RepositoryContext = createContext<RepositoryContextType | undefined>(undefined);