---
name: opencode-task
description: >
  Delegate coding tasks to opencode for parallel execution.
  Use when user says "delegate to opencode", "run in opencode", "use opencode for this task",
  "offload to opencode", or invokes /opencode:task. Enables concurrent task processing by
  offloading independent work to opencode while Claude Code continues with other tasks.
---

## Overview

This skill enables Claude Code to delegate tasks to opencode, allowing parallel processing
of independent coding tasks. When you need to offload a task, use the `/opencode:task` command.

## Usage

### Delegating a Task

```
/opencode:task <task description>
```

Example: `/opencode:task fix the login bug in auth.js`

### Options

- `--background`: Run the task in the background and return immediately
- `--write`: Allow opencode to write to the workspace
- `--resume-last`: Resume the last opencode task
- `--fresh`: Start a fresh task (default)

### Checking Status

```
/opencode:status [job-id]
```

Without a job-id, shows all jobs. With a job-id, shows detailed status.

### Getting Results

```
/opencode:result [job-id]
```

### Cancelling a Task

```
/opencode:cancel [job-id]
```

## Task Lifecycle

1. **Submit**: Task is submitted via `/opencode:task`
2. **Queue**: Task enters queue (if background) or runs foreground
3. **Running**: opencode processes the task
4. **Complete**: Results available via `/opencode:result`
5. **Failed**: Error information captured and displayed

## Best Practices

- Delegate independent, self-contained tasks that don't require context from current session
- Use `--background` for tasks that will take time (refactoring, large changes)
- Check `/opencode:status` periodically for long-running tasks
- Use `/opencode:result` to retrieve completed work

## Integration

This skill wraps the opencode CLI. Ensure opencode is installed:
```
npm install -g opencode-ai
```

Or use the binary from `~/.opencode/bin/opencode