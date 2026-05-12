"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"

import { useLogoutMutation } from "@/store/api/authApi"

import { useAppDispatch } from "@/store/hooks"

import { logout } from "@/features/auth/authSlice"

export default function DashboardHeader() {
  const dispatch = useAppDispatch()

  const [logoutApi] = useLogoutMutation()

  async function handleLogout() {
    try {
      await logoutApi().unwrap()
    } finally {
      dispatch(logout())
    }
  }

  return (
    <header className="flex h-16 items-center justify-end border-b px-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">
            <Avatar>
              <AvatarFallback>
                AK
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout}>
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}