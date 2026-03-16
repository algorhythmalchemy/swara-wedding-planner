"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calendar,
  IndianRupee,
  Users,
  Gift,
  Truck,
  Mail,
  ClipboardCheck,
  Menu,
  X,
  Heart,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/schedule", label: "Schedule & Tasks", icon: Calendar },
  { href: "/events", label: "Ritual Timeline", icon: ClipboardCheck },
  { href: "/budget", label: "Budget & Expenses", icon: IndianRupee },
  { href: "/guests", label: "Guest List & RSVP", icon: Users },
  { href: "/invitations", label: "Invitation Tracker", icon: Mail },
  { href: "/thamboolam", label: "Thamboolam & Gifts", icon: Gift },
  { href: "/vendors", label: "Vendors & Day-Of", icon: Truck },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar text-sidebar-foreground border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-turmeric fill-turmeric" />
          <span className="font-bold text-sm">Wedding Planner</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform duration-200",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Title */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-turmeric/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-turmeric fill-turmeric" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight">
                Rachana & Aditya
              </h1>
              <p className="text-xs text-sidebar-foreground/60">
                April 30, 2026
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/40 text-center">
            Shubham Bhavatu
          </p>
        </div>
      </aside>
    </>
  );
}
