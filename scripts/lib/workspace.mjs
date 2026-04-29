import path from "node:path";
import process from "node:process";

export function resolveWorkspaceRoot(cwd = process.cwd()) {
  return cwd;
}