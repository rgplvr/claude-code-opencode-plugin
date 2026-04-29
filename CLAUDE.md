# opencode Companion

A Claude Code plugin that delegates tasks to opencode for parallel execution.

## Commands

- `/opencode:task <description>` - Delegate a task to opencode
- `/opencode:task --background <description>` - Run task in background
- `/opencode:task --write <description>` - Allow opencode to write to workspace
- `/opencode:status` - Check task status
- `/opencode:result <job-id>` - Get task results
- `/opencode:cancel <job-id>` - Cancel a running task
- `/opencode:setup` - Check installation status

## Installation

1. Ensure opencode is installed:
   ```
   npm install -g opencode-ai
   ```

2. The plugin will be automatically loaded by Claude Code

## Usage

Delegate independent tasks to opencode for parallel processing:

```
/opencode:task fix all unit tests in the auth module
/opencode:task --background refactor the entire data layer
/opencode:status
/opencode:result task-abc123
```