"use client"

import { useRouter } from "next/navigation"

import { useEffect } from "react"

import { useAppSelector } from "@/store/hooks"

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles: string[]
}) {
  const router = useRouter()

  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    if (user && !allowedRoles.includes(user.role)) {
      router.replace("/dashboard")
    }
  }, [allowedRoles, user, router])

  if (!user) {
    return null
  }

  if (!allowedRoles.includes(user.role)) {
    return null
  }

  return children
}
