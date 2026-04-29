export function renderSetupReport(report) {
  const lines = ["=== opencode Companion Setup ===", ""];
  lines.push(`Node.js: ${report.node?.available ? "available" : "NOT FOUND"}`);
  lines.push(`npm: ${report.npm?.available ? "available" : "NOT FOUND"}`);
  lines.push(`opencode: ${report.opencode?.available ? "available" : "NOT FOUND"}`);
  lines.push("");
  if (report.nextSteps.length > 0) {
    lines.push("Next steps:");
    report.nextSteps.forEach((step) => lines.push(`  - ${step}`));
  }
  return lines.join("\n") + "\n";
}

export function renderStatusReport(report) {
  const lines = ["=== opencode Tasks ===", ""];
  if (report.activeJobs.length === 0) {
    lines.push("No active tasks.");
  } else {
    lines.push("Active tasks:");
    report.activeJobs.forEach((job) => {
      lines.push(`  [${job.status}] ${job.id}: ${job.title || job.summary} (${job.kindLabel})`);
    });
  }
  if (report.completedJobs.length > 0) {
    lines.push("");
    lines.push("Recent completed:");
    report.completedJobs.forEach((job) => {
      lines.push(`  [${job.status}] ${job.id}: ${job.title || job.summary}`);
    });
  }
  return lines.join("\n") + "\n";
}

export function renderJobStatusReport(job) {
  const lines = [`Job: ${job.id}`, `Title: ${job.title || job.summary}`, `Status: ${job.status}`, `Kind: ${job.kindLabel}`];
  if (job.pid) {
    lines.push(`PID: ${job.pid}`);
  }
  if (job.errorMessage) {
    lines.push(`Error: ${job.errorMessage}`);
  }
  if (job.completedAt) {
    lines.push(`Completed: ${job.completedAt}`);
  }
  return lines.join("\n") + "\n";
}

export function renderTaskResult(data, options = {}) {
  const lines = [];
  if (data.failureMessage) {
    lines.push(`Task failed with error: ${data.failureMessage}`);
  } else if (data.rawOutput) {
    lines.push("Task output:");
    lines.push(data.rawOutput);
  } else {
    lines.push("Task completed with no output.");
  }
  return lines.join("\n") + "\n";
}

export function renderStoredJobResult(job, storedJob) {
  const lines = [`Job: ${job.id}`, `Title: ${job.title || job.summary}`, `Status: ${job.status}`, ""];
  if (storedJob?.request?.prompt) {
    lines.push("Prompt:");
    lines.push(storedJob.request.prompt);
  }
  return lines.join("\n") + "\n";
}

export function renderCancelReport(job) {
  return `Job ${job.id} cancelled.\n`;
}