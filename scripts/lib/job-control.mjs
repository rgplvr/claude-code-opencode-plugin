import { getJob, listJobs, sortJobsNewestFirst } from "./state.mjs";

export function buildSingleJobSnapshot(cwd, reference) {
  const workspaceRoot = cwd;
  const jobs = listJobs(workspaceRoot);
  const job = jobs.find((j) => j.id === reference) || jobs.find((j) => j.title?.includes(reference));
  if (!job) {
    throw new Error(`Job not found: ${reference}`);
  }
  return { job, storedJob: job };
}

export function buildStatusSnapshot(cwd, { all = false } = {}) {
  const workspaceRoot = cwd;
  const jobs = sortJobsNewestFirst(listJobs(workspaceRoot));
  const activeJobs = jobs.filter((j) => j.status === "running" || j.status === "queued");
  const completedJobs = jobs.filter((j) => j.status === "completed" || j.status === "failed" || j.status === "cancelled");

  return {
    activeJobs: all ? jobs : activeJobs,
    completedJobs: all ? [] : completedJobs.slice(0, 10),
    totalJobs: jobs.length,
    timestamp: new Date().toISOString()
  };
}

export function readStoredJob(workspaceRoot, jobId) {
  return getJob(workspaceRoot, jobId);
}

export function resolveResultJob(cwd, reference) {
  const workspaceRoot = cwd;
  const jobs = listJobs(workspaceRoot);
  const job = jobs.find((j) => j.id === reference) || jobs.find((j) => j.title?.includes(reference));
  if (!job) {
    throw new Error(`Job not found: ${reference}`);
  }
  return { workspaceRoot, job };
}

export function resolveCancelableJob(cwd, reference, options = {}) {
  const workspaceRoot = cwd;
  const jobs = listJobs(workspaceRoot);
  const job = jobs.find((j) => j.id === reference) || jobs.find((j) => j.title?.includes(reference));
  if (!job) {
    throw new Error(`Job not found: ${reference}`);
  }
  if (job.status !== "running" && job.status !== "queued") {
    throw new Error(`Job ${job.id} is not running or queued (status: ${job.status})`);
  }
  return { workspaceRoot, job };
}

export function sortJobsNewestFirst(jobs) {
  return [...jobs].sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}