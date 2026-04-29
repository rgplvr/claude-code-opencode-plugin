#!/usr/bin/env node

import process from "node:process";

const SESSION_ID_ENV = "CLAUDE_SESSION_ID";

async function main() {
  const [hookName] = process.argv.slice(2);

  if (hookName === "SessionStart") {
    const sessionId = process.env[SESSION_ID_ENV] || `session-${Date.now()}`;
    console.log(`opencode companion session: ${sessionId}`);
  } else if (hookName === "SessionEnd") {
  }
}

main().catch(() => {
  process.exit(0);
});