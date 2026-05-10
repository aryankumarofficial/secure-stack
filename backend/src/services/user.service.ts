import {
  clearUserSession,
  createUserSession,
} from "../db/repository/session.repo";
import { createUser, findUserByEmail } from "../db/repository/user.repo";
import { sendVerifyEmail } from "../email/services/register";
import type { UserCreateDTO, UserLoginDTO } from "../types/user.type";
import AppError from "../utils/AppError";
import { clearAuthCookies } from "../utils/cookies";
import { hash, verify } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { omit } from "../utils/object";
import { generateToken, sessionExpiry } from "../utils/token";

export async function registerUser(user: UserCreateDTO) {
  const existingUser = await findUserByEmail(user.email);
  if (existingUser) {
    throw new AppError("User Already Exists", 409);
  }
  const password = await hash(user.password);

  const { rowToken, user: newUser } = await createUser({
    ...user,
    password,
  });
  const verificationUrl = `${process.env.PUBLIC_URL}/auth/verify?uid=${newUser.id}&token=${rowToken}`;
  await sendVerifyEmail({
    to: newUser.email,
    username: newUser.name,
    verificationUrl,
  });

  return omit(newUser, "password");
}

export async function loginUser(credentials: UserLoginDTO) {
  const userExists = await findUserByEmail(credentials.email);
  if (!userExists) {
    throw new AppError(`Invalid credentials`, 401);
  }

  if (userExists.isBlocked) {
    throw new AppError(
      "Your account has been blocked. Please contact support.",
      403,
    );
  }

  const isValid = await verify(userExists.password, credentials.password);
  if (!isValid) {
    throw new AppError("Invalid Credentials", 403);
  }
  if (!userExists.isVerified)
    throw new AppError(
      "Email not verified. Please verify your account or request a new verification link.",
      403,
    );

  const payload = {
    id: userExists.id,
    role: userExists.role,
  };

  const accessToken = signToken(payload);

  await clearUserSession(userExists.id);

  const session = await createUserSession(userExists.id);

  if (!session) {
    throw new AppError(`Session Creation Failed`);
  }
  return {
    user: omit(userExists, "password"),
    accessToken,
    refreshToken: session.token,
  };
}
