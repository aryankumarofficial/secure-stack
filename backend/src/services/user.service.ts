import {
  clearUserSession,
  createUserSession,
  deleteSession,
  findSessionById,
  updateSession,
} from "../db/repository/session.repo.js";
import {
  createUser,
  findUserByEmail,
  findUserById,
  getUserInfoById,
} from "../db/repository/user.repo.js";
import { sendVerifyEmail } from "../mail/services/register.js";
import type { UserCreateDTO, UserLoginDTO } from "../types/user.type.js";
import AppError from "../utils/AppError.js";
import { hash, sha256, verify } from "../utils/hash.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { omit } from "../utils/object.js";
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
  const { accessToken, refreshToken } = await createLoginSession(userExists.id);

  return {
    accessToken,
    refreshToken,
  };
}

export async function logoutUser(sessionId: string) {
  await deleteSession(sessionId);
}

export async function createLoginSession(userId: string) {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  const temporaryRefreshToken = signRefreshToken({
    sessionId: crypto.randomUUID(),
  });

  const hashedRefreshToken = sha256(temporaryRefreshToken);
  const session = await createUserSession({
    userId,
    refreshToken: hashedRefreshToken,
    expiresAt,
  });
  const refreshToken = signRefreshToken({
    sessionId: session.id,
  });
  const hashedToken = sha256(refreshToken);
  await updateSession(session.id, {
    refreshToken: hashedToken,
    expiresAt,
  });

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken,
  };
}

export async function rotateRefreshToken(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid Refresh Token");
  }
  const session = await findSessionById(payload.sessionId);
  if (!session) {
    throw new AppError(`Invalid Session`, 401);
  }
  if (session.revokedAt) {
    throw new AppError("Session Revoked", 401);
  }

  if (session.expiresAt < new Date()) {
    throw new AppError("Session expired", 401);
  }

  const hashedIncomingToken = sha256(refreshToken);

  if (hashedIncomingToken !== session.refreshToken) {
    await clearUserSession(session.userId);

    throw new AppError("Refresh token reuse detected", 401);
  }
  const newRefreshToken = signRefreshToken({
    sessionId: session.id,
  });
  const newHashedToken = sha256(newRefreshToken);

  const newExpiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await updateSession(session.id, {
    refreshToken: newHashedToken,
    expiresAt: newExpiresAt,
  });

  const user = await findUserById(session.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    sessionId: session.id,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  };
}

export async function fetchUser(id: string) {
  const user = await findUserById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return await getUserInfoById(id);
}
