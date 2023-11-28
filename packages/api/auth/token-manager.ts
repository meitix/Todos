import { sign, verify } from "jsonwebtoken";

export function extract(token: string, secretKey: string) {
  return verify(token, secretKey);
}

export function generate(
  payload: any,
  secretKey: string,
  expiresIn?: number
): string {
  if (!expiresIn) {
    return `Bearer ` + sign(payload, secretKey);
  }

  return `Bearer ` + sign(payload, secretKey, { expiresIn });
}
