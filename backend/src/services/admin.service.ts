import { getUsers } from "../db/repository/user.repo.js";

export async function fetchAllUsers() {
  return await getUsers();
}
