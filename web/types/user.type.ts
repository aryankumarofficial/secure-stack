export interface User {
  id?: string
  name: string
  email: string
  role: ROLE
  isVerified: boolean
  isBlocked: boolean
  createdAt?: string
  updatedAt?: string
}

enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface UserRegisterDto {
  name: string
  email: string
  password: string
}

export interface UserLoginDto {
  email: string
  password: string
}
