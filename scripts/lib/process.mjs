import { spawn } from "node:child_process";

export function binaryAvailable(binary, args = ["--version"], options = {}) {
  return new Promise((resolve) => {
    try {
      const child = spawn(binary, args, {
        cwd: options.cwd || process.cwd(),
        timeout: 5000,
        stdio: "ignore"
      });

      child.on("error", () => {
        resolve({ available: false, error: "not found" });
      });

      child.on("close", (code) => {
        resolve({ available: code === 0 || code === null });
      });
    } catch {
      resolve({ available: false, error: "failed to spawn" });
    }
  });
}

export function terminateProcessTree(pid) {
  if (!pid || Number.isNaN(pid)) {
    return;
  }

  try {
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(pid), "/t", "/f"], {
        stdio: "ignore",
        windowsHide: true
      });
    } else {
      const groupPid = -pid;
      try {
        process.kill(groupPid, 0);
        spawn("kill", ["-" + pid], { stdio: "ignore" });
      } catch {
        spawn("kill", [String(pid)], { stdio: "ignore" });
      }
    }
  } catch {
  }
}