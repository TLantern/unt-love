import { createHash, randomInt } from "node:crypto";

const CODE_LENGTH = 6;
const CODE_MAX = 10 ** CODE_LENGTH - 1;

export function generateVerificationCode(): string {
  const code = randomInt(10 ** (CODE_LENGTH - 1), CODE_MAX + 1);
  return String(code);
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

const UNT_EMAIL_SUFFIXES = ["@unt.edu", "@my.unt.edu"];
const UNT_STUDENT_EMAIL_SUFFIX = "@my.unt.edu";

export function isValidUNTEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return normalized.endsWith(UNT_STUDENT_EMAIL_SUFFIX);
}

export function isUntEmail(email: string): boolean {
  const normalized = email.toLowerCase().trim();
  return UNT_EMAIL_SUFFIXES.some((s) => normalized.endsWith(s));
}
