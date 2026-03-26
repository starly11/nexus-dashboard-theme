"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export interface SidebarContextType {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (isCollapsed: boolean | ((prev: boolean) => boolean)) => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export interface SidebarProviderProps {
  children: React.ReactNode;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);
const STORAGE_KEY = "stitch-sidebar-collapsed";

export function SidebarProvider({ children }: SidebarProviderProps): React.JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const persisted = window.localStorage.getItem(STORAGE_KEY);

    return persisted === "true";
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const setCollapsed = useCallback((value: boolean | ((prev: boolean) => boolean)) => {
    setIsCollapsed((previousValue) => {
      const nextValue = typeof value === "function" ? value(previousValue) : value;
      window.localStorage.setItem(STORAGE_KEY, `${nextValue}`);

      return nextValue;
    });
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((previousValue) => !previousValue);
  }, [setCollapsed]);

  const openMobile = useCallback(() => {
    setIsMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isCollapsed, isMobileOpen, toggleCollapsed, setCollapsed, openMobile, closeMobile }),
    [isCollapsed, isMobileOpen, toggleCollapsed, setCollapsed, openMobile, closeMobile]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebarContext(): SidebarContextType {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within SidebarProvider");
  }

  return context;
}
