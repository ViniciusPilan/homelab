---
name: shell-script-patterns
description: Create or revise Bash scripts to closely follow examples/shell-coding/addTerraformUser.sh.
metadata:
  short-description: Write Bash scripts in the user's preferred style
---

# Shell script patterns

Use this skill when creating or revising Bash scripts in this repository. Treat `examples/shell-coding/addTerraformUser.sh` as the primary style reference and keep new scripts close to its structure and direct, straightforward style.

## Preferred structure and style

- Begin with `#!/bin/bash`, followed by a brief purpose header. Include `Requirements` and `How to run` sections when execution context or prerequisites matter.
- Put configuration values near the top, using uppercase variable names with underscores where appropriate.
- Define focused functions with camelCase names. Keep operations grouped by purpose, then define `main()` near the end and invoke it directly with `main`.
- Use local variables inside functions, including Bash arrays for lists of arguments or values. Expand arrays as `"${array[@]}"` so each item remains a separate argument.
- Use short comments to label meaningful operations within functions, as in `# User`, `# Role`, and `# API token` in the reference script.
- Use explicit, readable command invocations and line continuations when they make arguments easier to scan. Quote variable expansions in command arguments and paths, even if the reference has some unquoted expansions.
- Avoid adding decorative output, numbered progress messages, or generic prerequisite-check scaffolding unless the script's purpose calls for them.
- Do not add `set -euo pipefail` mechanically. Handle failures explicitly where they matter so an unsuccessful operation is not silently treated as success.
- Document working-directory or host assumptions in the header. If the script must change to a fixed directory, make that change explicit and handle a failed `cd`.

## Writing or revising a script

Read `examples/shell-coding/addTerraformUser.sh` before editing when its conventions are relevant. Identify the script's purpose, required environment, and invocation context; then follow the reference's header, configuration, function grouping, comments, and `main()` flow. Adapt only where the task requires it, and keep the result self-contained unless shared helpers are already part of the design or explicitly requested.
