import { createUser, findUserByEmail } from "../db/repository/user.repo";
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
  //TODO: Send Verify email

  return omit(newUser, "password");
}
