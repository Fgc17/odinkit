"use client";
import { useState } from "react";
import { MobileSidebar } from "./components/MobileSidebar";
import { NavbarItem, NavbarLabel } from "../Navbar";
import { OpenMenuIcon } from "./components/OpenMenuIcon";
import { Button } from "../Button";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";

export function SidebarStackedLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar?: React.ReactNode;
}>) {
  return (
    <div className="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      {/* Content */}
      <div className="lg:flex lg:flex-1 lg:px-2 lg:py-2">
        {sidebar}
        <div className="grow px-6 pb-2 pt-6 lg:rounded-lg lg:bg-white lg:p-10 lg:pb-6 lg:shadow-sm lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </div>
    </div>
  );
}
