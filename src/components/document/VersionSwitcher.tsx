"use client"

import * as React from "react"
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function VersionSwitcher({
  versions,
  defaultVersion,
  onVersionChange,
}: {
  versions: string[]
  defaultVersion: string
  onVersionChange?: (version: string) => void
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion)

  React.useEffect(() => {
    setSelectedVersion(defaultVersion);
  }, [defaultVersion]);

  const handleVersionSelect = (version: string) => {
    setSelectedVersion(version);
    onVersionChange?.(version);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground min-w-0"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg shrink-0">
                <GalleryVerticalEnd className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none min-w-0 flex-1">
                <span className="font-medium">Branch</span>
                <span className="truncate" title={selectedVersion}>{selectedVersion}</span>
              </div>
              <ChevronsUpDown className="ml-auto shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => handleVersionSelect(version)}
              >
                <span className="truncate flex-1" title={version}>{version}</span>
                {version === selectedVersion && <Check className="ml-auto shrink-0" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
