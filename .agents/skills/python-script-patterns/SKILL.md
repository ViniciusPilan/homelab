---
name: python-script-patterns
description: Create or revise Python scripts in this repository using the example in examples/python-coding as the style reference.
metadata:
  short-description: Write Python scripts in the repository's example style
---

# Python script patterns

Use this skill when creating or revising Python scripts in this repository. Read [`examples/python-coding/main.py`](../../../examples/python-coding/main.py) first and use it as the primary reference for small, standalone scripts. Its `requirements.txt` and `Dockerfile` show how that example declares dependencies and runs in a container.

## Conventions

- Keep a script direct and readable. Put fixed configuration near the top in uppercase constants, and group related values in dictionaries or other simple data structures where useful.
- Use small, descriptively named functions for distinct operations. Keep orchestration in `main()` and invoke it under `if __name__ == "__main__":`.
- Use descriptive parameter names and docstrings when they clarify a function's purpose. Keep comments focused on intent or non-obvious behavior.
- Use standard-library modules where practical. If an external package is needed, declare it in the script's project requirements file rather than relying on an undeclared local installation. Follow the example's virtual-environment and `python3` invocation approach when documenting how to run a standalone script.
- Handle expected failures explicitly and report useful context. Do not copy the example's bare response truthiness check as a general HTTP error-handling pattern; use the client library's status/error API and suitable timeouts when making network requests.
- Preserve a script's intended working directory and runtime assumptions, and document them when they affect how it is run.

## Scope

Use the example as guidance for small scripts, not as a mandatory architecture for every Python project. For larger applications or existing projects, follow the structure and conventions established by that project.
