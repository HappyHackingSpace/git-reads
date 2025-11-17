import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { SidebarGroup, SidebarGroupContent, SidebarInput } from "@/components/ui/sidebar";
import { useRepository } from "@/hooks/useRepository";
import { FetchReadme } from "@/lib/github";
import { parseTOC } from "@/lib/parser";

export function SearchForm(props: React.ComponentProps<"form">) {
  const { repositoryInfo } = useRepository();
  const [query, setQuery] = useState("");
  const [toc, setToc] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = query
    ? toc.filter(item => item.text.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  useEffect(() => {
    FetchReadme(repositoryInfo)
      .then(md => setToc(parseTOC(md)))
      .catch(() => setToc([]));
  }, [repositoryInfo]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <form
      {...props}
      autoComplete="off"
      onSubmit={e => {
        e.preventDefault();
        if (results[0]) {
          window.location.hash = `#${results[0].id}`;
          setIsOpen(false);
        }
      }}
    >
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="sidebar-search" className="sr-only">Search</Label>
          <SidebarInput
            id="sidebar-search"
            ref={inputRef}
            value={query}
            placeholder="Search the docs..."
            className="pl-8"
            onChange={e => { setQuery(e.target.value); if (e.target.value) setIsOpen(true); else setIsOpen(false); }}
            onFocus={() => results.length > 0 && setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            aria-autocomplete="list"
            aria-controls="sidebar-search-results"
            spellCheck={false}
            autoComplete="off"
          />
          <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          {isOpen && (
            results.length > 0 ? (
              <div id="sidebar-search-results" className="absolute z-50 mt-1 w-full rounded-md bg-popover shadow-lg border border-border max-h-60 overflow-auto" style={{ left: 0, right: 0 }}>
                <ul tabIndex={-1}>
                  {results.map(item => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="block w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer truncate"
                        onMouseDown={e => { e.preventDefault(); window.location.hash = `#${item.id}`; setIsOpen(false); }}
                        title={item.text}
                      >{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : query ?
              <div className="absolute z-50 mt-1 w-full rounded-md bg-popover shadow-lg border border-border px-3 py-2 text-sm text-muted-foreground">
                No results found.
              </div>
              : null
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
