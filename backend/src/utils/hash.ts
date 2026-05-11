import crypto from "crypto";
import argon2 from "argon2";
export function hash(password: string) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 1,
  });
}

export function verify(digest: string, password: string) {
  return argon2.verify(digest, password);
}

export function sha256(str: string) {
  return crypto.createHash("sha256").update(str).digest("hex");
}
