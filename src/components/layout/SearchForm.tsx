import React, { useEffect, useRef } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { useRepository } from "@/hooks/useRepository";
import { FetchReadme } from "@/lib/github";
import { parseTOC } from "@/lib/parser";

interface SearchFormProps extends React.ComponentProps<"form"> {
  search: string;
  onSearchChange: (v: string) => void;
}

export function SearchForm({
  search,
  onSearchChange,
  ...props
}: SearchFormProps) {
  const { repositoryInfo } = useRepository();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    FetchReadme(repositoryInfo)
      .then((md) => parseTOC(md))
      .catch(() => []);
  }, [repositoryInfo]);

  return (
    <form {...props} autoComplete="off" onSubmit={(e) => e.preventDefault()}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="sidebar-search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="sidebar-search"
            ref={inputRef}
            value={search}
            placeholder="Search the docs..."
            className="pl-8"
            onChange={(e) => onSearchChange(e.target.value)}
            spellCheck={false}
            autoComplete="off"
          />
          <svg
            className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}