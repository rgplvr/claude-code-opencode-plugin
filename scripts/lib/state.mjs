import fs from "node:fs";
import path from "node:path";

const STATE_DIR = ".opencode-state";
const JOBS_FILE = "jobs.json";

export function getStateDir(workspaceRoot) {
  return path.join(workspaceRoot, STATE_DIR);
}

export function ensureStateDir(workspaceRoot) {
  const dir = getStateDir(workspaceRoot);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function getJobsPath(workspaceRoot) {
  return path.join(ensureStateDir(workspaceRoot), JOBS_FILE);
}

export function readJobs(workspaceRoot) {
  const jobsPath = getJobsPath(workspaceRoot);
  if (!fs.existsSync(jobsPath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(jobsPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export function writeJobs(workspaceRoot, jobs) {
  const jobsPath = getJobsPath(workspaceRoot);
  fs.writeFileSync(jobsPath, JSON.stringify(jobs, null, 2), "utf-8");
}

export function generateJobId(prefix = "job") {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${timestamp}-${random}`;
}

export function listJobs(workspaceRoot) {
  return readJobs(workspaceRoot);
}

export function upsertJob(workspaceRoot, job) {
  const jobs = readJobs(workspaceRoot);
  const index = jobs.findIndex((j) => j.id === job.id);
  if (index >= 0) {
    jobs[index] = { ...jobs[index], ...job };
  } else {
    jobs.push(job);
  }
  writeJobs(workspaceRoot, jobs);
}

export function getJob(workspaceRoot, jobId) {
  const jobs = readJobs(workspaceRoot);
  return jobs.find((j) => j.id === jobId) || null;
}

export function getConfig(workspaceRoot, key, defaultValue = null) {
  const configPath = path.join(ensureStateDir(workspaceRoot), "config.json");
  if (!fs.existsSync(configPath)) {
    return defaultValue;
  }
  try {
    const content = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);
    return key ? (config[key] ?? defaultValue) : config;
  } catch {
    return defaultValue;
  }
}

export function setConfig(workspaceRoot, key, value) {
  const configPath = path.join(ensureStateDir(workspaceRoot), "config.json");
  let config = {};
  if (fs.existsSync(configPath)) {
    try {
      const content = fs.readFileSync(configPath, "utf-8");
      config = JSON.parse(content);
    } catch {
    }
  }
  config[key] = value;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
}