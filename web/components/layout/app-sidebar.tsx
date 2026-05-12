"use client"

import Link from "next/link"

import { usePathname } from "next/navigation"

import { LayoutDashboard } from "lucide-react"
import { ListTodo } from "lucide-react"
import { Users } from "lucide-react"
import { User } from "lucide-react"

import { cn } from "@/lib/utils"

import { useAppSelector } from "@/store/hooks"

const userLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ListTodo,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
  },
]

const adminLinks = [
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
]

export default function AppSidebar() {
  const pathname = usePathname()

  const user = useAppSelector((state) => state.auth.user)

  const links =
    user?.role === "ADMIN" ? [...userLinks, ...adminLinks] : userLinks

  return (
    <aside className="w-72 border-r bg-background p-4">
      <div className="mb-8 text-2xl font-bold">Secure Stack</div>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 transition-colors",
                pathname === link.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <Icon className="h-5 w-5" />

              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
