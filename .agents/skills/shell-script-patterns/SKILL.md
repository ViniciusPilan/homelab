---
name: shell-script-patterns
description: Create or revise shell scripts that follow the user's established Bash conventions from their k8s-cluster repository.
metadata:
  short-description: Write shell scripts in the user's style
---

# Shell script patterns

Use this skill when creating or revising shell scripts to match the conventions in the user's `k8s-cluster` repository. The observed examples are Bash scripts; use Bash unless the user asks for another shell.

## Repository conventions

- Start scripts with `#!/bin/bash`.
- Add a short comment header describing `Purpose`, and include `Requirements` and `How to run` when relevant. The examples document important execution context, such as running on a Proxmox host or from a particular directory.
- Put configurable values near the top as uppercase variables with underscores, such as `UBUNTU_IMAGE` and `RESOURCES_CPU_CORES`.
- Organize work into named functions, usually camelCase, and put orchestration in `main()` at the end, followed by a direct `main` call.
- Use short comments to identify meaningful steps within setup functions.
- Report progress with simple `INFO:` and numbered `Step 01:` style `echo` messages when a script has multiple visible stages.
- Check required executables with `command -v`; check service readiness with its own relevant command (the examples use `docker info`). Report failures clearly and exit nonzero.
- Keep commands and options readable across lines where that improves clarity. Quote variable expansions, especially in paths, command arguments, and values that may contain spaces.
- Treat relative paths and working-directory assumptions as part of the script interface. Document them in `How to run`; use an explicit `cd ... || exit` when the script intentionally operates from a fixed directory.

## Writing a new script

First identify its purpose, prerequisites, execution location, and run command. Then create a Bash script using only the conventions that fit the task: a one-shot helper does not need progress messages or prerequisite checks if they add no value. Keep configuration near the top, put logical operations in functions, and call them through `main()`.

Preserve the repository's direct, readable style. The examples do not consistently use strict-mode flags, so do not add `set -euo pipefail` mechanically; choose error handling suited to the operations and ensure failures that matter cannot be silently treated as success. Likewise, avoid copying incidental spacing or unsafe unquoted expansions from older scripts.

Do not assume existing helper names are globally available: the repository repeats checks in standalone scripts. Prefer local helpers for a self-contained script unless the user asks for shared sourcing or refactoring.
