import { createUser, findUserByEmail } from "../db/repository/user.repo";
import { sendVerifyEmail } from "../email/services/register";
import type { UserCreateDTO } from "../types/user.type";
import AppError from "../utils/AppError";
import { hash } from "../utils/hash";
import { omit } from "../utils/object";

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
