"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getNavigationForRole,
  navigationItems,
  type NavigationItem,
} from "@/lib/navigation";
import type { RoleKey } from "@/lib/tenant/demo-context";

const storageKey = "analiza:sidebar-collapsed";

type AppSidebarProps = {
  roleKey: RoleKey;
};

function isActive(pathname: string, item: NavigationItem) {
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function AppSidebar({ roleKey }: AppSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const visibleItems = getNavigationForRole(roleKey);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(storageKey) === "true");
  }, []);

  function toggleCollapsed() {
    setCollapsed((currentValue) => {
      const nextValue = !currentValue;
      window.localStorage.setItem(storageKey, String(nextValue));
      return nextValue;
    });
  }

  return (
    <aside
      className={cn(
        "hidden border-r bg-background lg:flex lg:flex-col",
        collapsed ? "lg:w-[72px]" : "lg:w-72",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        <span
          className={cn(
            "text-sm font-semibold",
            collapsed && "sr-only",
          )}
        >
          Analiza Intelligence
        </span>
        <Button
          aria-label={collapsed ? "Expandir menu" : "Colapsar menu"}
          onClick={toggleCollapsed}
          size="icon"
          type="button"
          variant="ghost"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-4" />
          ) : (
            <PanelLeftClose className="size-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="grid gap-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item);

            return (
              <Link
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                  active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  collapsed && "justify-center px-0",
                )}
                href={item.href}
                key={item.href}
                title={item.title}
              >
                <Icon className="size-4 shrink-0" />
                <span className={cn(collapsed && "sr-only")}>
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t p-3">
        <div
          className={cn(
            "rounded-md bg-muted px-3 py-2 text-xs text-muted-foreground",
            collapsed && "sr-only",
          )}
        >
          {visibleItems.length} de {navigationItems.length} modulos visibles
        </div>
      </div>
    </aside>
  );
}

