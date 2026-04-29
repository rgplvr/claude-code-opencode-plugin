import fs from "node:fs";
import path from "node:path";

export function createJobLogFile(workspaceRoot, jobId, title) {
  const logsDir = path.join(workspaceRoot, ".opencode-logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  const safeTitle = title.replace(/[^a-zA-Z0-9-_]/g, "_").slice(0, 50);
  const logFile = path.join(logsDir, `${jobId}_${safeTitle}.log`);
  fs.writeFileSync(logFile, "", "utf-8");
  return logFile;
}

export function appendLogLine(logFile, line) {
  if (!logFile || !fs.existsSync(logFile)) {
    return;
  }
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFile, `[${timestamp}] ${line}\n`, "utf-8");
}

export function nowIso() {
  return new Date().toISOString();
}

export const SESSION_ID_ENV = "CLAUDE_SESSION_ID";

export function createJobRecord({ id, kind, kindLabel, title, workspaceRoot, jobClass, summary, write = false }) {
  return {
    id,
    kind,
    kindLabel,
    title,
    workspaceRoot,
    jobClass,
    summary,
    write,
    status: "running",
    phase: "running",
    pid: null,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    completedAt: null,
    errorMessage: null,
    logFile: null
  };
}

export function createProgressReporter({ stderr = true, logFile, onEvent }) {
  let lastUpdate = 0;
  return {
    report(event) {
      const now = Date.now();
      if (logFile && now - lastUpdate > 500) {
        appendLogLine(logFile, event);
        lastUpdate = now;
      }
      if (onEvent) {
        onEvent(event);
      }
    }
  };
}

export function createJobProgressUpdater(workspaceRoot, jobId) {
  return (event) => {
    try {
      const jobsPath = path.join(workspaceRoot, ".opencode-state", "jobs.json");
      if (!fs.existsSync(jobsPath)) {
        return;
      }
      const content = fs.readFileSync(jobsPath, "utf-8");
      const jobs = JSON.parse(content);
      const index = jobs.findIndex((j) => j.id === jobId);
      if (index >= 0) {
        jobs[index].updatedAt = nowIso();
        fs.writeFileSync(jobsPath, JSON.stringify(jobs, null, 2), "utf-8");
      }
    } catch {
    }
  };
}

export async function runTrackedJob(job, runner, options = {}) {
  const { logFile } = options;
  if (logFile) {
    appendLogLine(logFile, `Starting job ${job.id}: ${job.title}`);
  }
  try {
    const result = await runner();
    if (logFile) {
      appendLogLine(logFile, `Job ${job.id} completed with exit status ${result.exitStatus}`);
    }
    return result;
  } catch (error) {
    if (logFile) {
      appendLogLine(logFile, `Job ${job.id} failed: ${error.message}`);
    }
    throw error;
  }
}