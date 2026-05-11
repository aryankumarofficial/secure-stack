# Refresh Token Rotation — Complete Supporting Implementations

## `utils/hash.ts`

```ts
import crypto from "crypto";

export function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}
```

---

# `utils/jwt.ts`

```ts
import jwt from "jsonwebtoken";

interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  sessionId: string;
}

interface RefreshTokenPayload {
  sessionId: string;
}

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

export function signAccessToken(payload: AccessTokenPayload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as AccessTokenPayload;
}

export function signRefreshToken(payload: RefreshTokenPayload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as RefreshTokenPayload;
}
```

---

# `utils/cookies.ts`

```ts
import type { Response } from "express";

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 15,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
}
```

---

# Prisma Session Model

```prisma
model Session {
  id           String   @id @default(cuid())

  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  refreshToken String

  expiresAt    DateTime
  revokedAt    DateTime?

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Run:

```bash
bunx prisma migrate dev
bunx prisma generate
```

---

# `repositories/session.repository.ts`

```ts
import { prisma } from "../lib/prisma";

export async function findSessionById(id: string) {
  return prisma.session.findUnique({
    where: {
      id,
    },
  });
}

export async function createSession(data: {
  userId: string;
  refreshToken: string;
  expiresAt: Date;
}) {
  return prisma.session.create({
    data,
  });
}

export async function updateSession(
  id: string,
  data: {
    refreshToken: string;
    expiresAt: Date;
  },
) {
  return prisma.session.update({
    where: {
      id,
    },
    data,
  });
}

export async function deleteSession(id: string) {
  return prisma.session.delete({
    where: {
      id,
    },
  });
}

export async function deleteAllUserSessions(userId: string) {
  return prisma.session.deleteMany({
    where: {
      userId,
    },
  });
}
```

---

# `services/auth.service.ts`

```ts
import AppError from "../utils/AppError";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { sha256 } from "../utils/hash";
import {
  createSession,
  deleteAllUserSessions,
  findSessionById,
  updateSession,
} from "../repositories/session.repository";
import { prisma } from "../lib/prisma";

export async function createLoginSession(userId: string) {
  const expiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 30,
  );

  const temporaryRefreshToken = signRefreshToken({
    sessionId: crypto.randomUUID(),
  });

  const hashedRefreshToken = sha256(temporaryRefreshToken);

  const session = await createSession({
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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

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
    session,
    user,
  };
}

export async function rotateRefreshToken(refreshToken: string) {
  let payload;

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const session = await findSessionById(payload.sessionId);

  if (!session) {
    throw new AppError("Invalid session", 401);
  }

  if (session.revokedAt) {
    throw new AppError("Session revoked", 401);
  }

  if (session.expiresAt < new Date()) {
    throw new AppError("Session expired", 401);
  }

  const hashedIncomingToken = sha256(refreshToken);

  if (hashedIncomingToken !== session.refreshToken) {
    await deleteAllUserSessions(session.userId);

    throw new AppError(
      "Refresh token reuse detected",
      401,
    );
  }

  const newRefreshToken = signRefreshToken({
    sessionId: session.id,
  });

  const newHashedToken = sha256(newRefreshToken);

  const newExpiresAt = new Date(
    Date.now() + 1000 * 60 * 60 * 24 * 30,
  );

  await updateSession(session.id, {
    refreshToken: newHashedToken,
    expiresAt: newExpiresAt,
  });

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });

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
```

---

# `middlewares/auth.middleware.ts`

```ts
import type {
  NextFunction,
  Request,
  Response,
} from "express";
import AppError from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";
import { findSessionById } from "../repositories/session.repository";

export async function authMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken) {
    return next(new AppError("Unauthorized", 401));
  }

  try {
    const payload = verifyAccessToken(accessToken);

    const session = await findSessionById(
      payload.sessionId,
    );

    if (!session) {
      return next(new AppError("Session expired", 401));
    }

    if (session.revokedAt) {
      return next(new AppError("Session revoked", 401));
    }

    req.user = payload;

    return next();
  } catch {
    return next(
      new AppError("Invalid or expired token", 401),
    );
  }
}
```

---

# `controllers/auth.controller.ts`

```ts
import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import {
  createLoginSession,
  rotateRefreshToken,
} from "../services/auth.service";
import {
  clearAuthCookies,
  setAuthCookies,
} from "../utils/cookies";

export const login = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;

    const session = await createLoginSession(user.id);

    setAuthCookies(
      res,
      session.accessToken,
      session.refreshToken,
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
    });
  },
);

export const refresh = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    const tokens = await rotateRefreshToken(
      refreshToken,
    );

    setAuthCookies(
      res,
      tokens.accessToken,
      tokens.refreshToken,
    );

    return res.status(200).json({
      success: true,
      message: "Session refreshed successfully",
    });
  },
);

export const logout = asyncHandler(
  async (_req: Request, res: Response) => {
    clearAuthCookies(res);

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  },
);
```

---

# Route Setup

```ts
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
```

---

# Important Improvements You Should Add Later

## Device Tracking

Add:

```prisma
ipAddress String?
userAgent String?
```

inside Session.

---

## Session Revocation

Add:

```prisma
revokedAt DateTime?
```

Already included above.

---

## Email Verification Checks

Before login:

```ts
if (!user.isVerified) {
  throw new AppError(
    "Please verify your email first",
    403,
  );
}
```

---

## Blocked User Checks

```ts
if (user.isBlocked) {
  throw new AppError(
    "Your account has been blocked",
    403,
  );
}
```
