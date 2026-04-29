# opencode Claude Code Plugin

Delegate tasks to [opencode](https://opencode.ai) from Claude Code for parallel execution.

## Install

```sh
# 1. Add this marketplace to Claude Code
/plugin install github:rgplvr/claude-code-opencode-plugin

# 2. Reload plugins
/reload-plugins

# 3. Ensure opencode is installed
npm install -g opencode-ai
```

> **Prerequisite:** opencode CLI must be installed and accessible in your `$PATH`.

## Commands

| Command | Description |
|---|---|
| `/opencode:task <description>` | Delegate a task to opencode |
| `/opencode:task --background <description>` | Run task in background, return immediately |
| `/opencode:task --write <description>` | Allow opencode to write to workspace |
| `/opencode:task --resume-last <description>` | Resume last opencode task |
| `/opencode:status [job-id]` | Check status of all jobs or a specific job |
| `/opencode:result [job-id]` | Retrieve results of a completed task |
| `/opencode:cancel [job-id]` | Cancel a running task |
| `/opencode:setup` | Check installation status |

## Usage

Offload independent work to opencode while Claude Code continues with other tasks:

```
# Delegate a foreground task
/opencode:task fix all failing unit tests in the auth module

# Delegate a long-running task in the background
/opencode:task --background refactor the entire data layer

# Check on running tasks
/opencode:status

# Retrieve results when done
/opencode:result task-abc123
```

### When to delegate to opencode

- Tasks independent of your current session context
- Long-running refactors or large changes
- Parallelizable work (e.g. fixing tests while writing new features)

## How it works

1. `/opencode:task` submits work to opencode via the local CLI
2. Task runs in a separate opencode session (foreground or background)
3. Results are captured and retrievable via `/opencode:result`
4. Session lifecycle is managed automatically via Claude Code hooks

## Uninstall

```sh
/plugin remove opencode
```
