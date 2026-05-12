"use client"

import { useRouter } from "next/navigation"

import { useEffect } from "react"

import { useAppSelector } from "@/store/hooks"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const user = useAppSelector((state) => state.auth.user)

  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return children
}
