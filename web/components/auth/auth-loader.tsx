"use client"

import { useEffect } from "react"

import { useMeQuery } from "@/store/api/authApi"

import { useAppDispatch } from "@/store/hooks"

import {
  logout,
  setCredentials,
} from "@/features/auth/authSlice"

export default function AuthLoader({
  children,
}: {
  children: React.ReactNode
}) {
  const dispatch = useAppDispatch()

  const { data, isLoading, isError } =
    useMeQuery()

  useEffect(() => {
    if (data) {
      dispatch(setCredentials(data))
    }

    if (isError) {
      dispatch(logout())
    }
  }, [data, isError, dispatch])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return children
}