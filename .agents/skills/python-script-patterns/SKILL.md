---
name: python-script-patterns
description: Create or revise Python projects in this repository using the example structure in examples/python-coding.
metadata:
  short-description: Write Python projects in the repository's example style
---

# Python project patterns

Use this skill when creating or revising Python code in this repository. Read the full [`examples/python-coding/`](../../../examples/python-coding/) example before editing: `main.py` shows the code style, `requirements.txt` declares dependencies, `README.md` documents setup and use, and `Dockerfile` shows how the project runs in a container. Treat these files together as the example project structure.

## Conventions

- Keep small scripts direct and readable. Put fixed configuration near the top in uppercase constants, and group related values in dictionaries or other simple data structures where useful.
- Use small, descriptively named functions for distinct operations. For command-line scripts, keep orchestration in `main()` and invoke it under `if __name__ == "__main__":`. For services such as APIs, follow the framework's application and startup conventions instead of forcing a `main()` entry point.
- Use descriptive parameter names and docstrings when they clarify a function's purpose. Keep comments focused on intent or non-obvious behavior.
- Use standard-library modules where practical. Declare external packages in the project's `requirements.txt` rather than relying on an undeclared local installation. The version of each package must be explicit, not just the latest.
- Keep project files together in a dedicated directory. Include a `README.md` that explains the purpose, dependencies, setup, invocation, inputs, and outputs. For standalone scripts, document the virtual-environment and `python3` commands used by the example. If the app is an API, paste an example of how to use.
- Add or update a `Dockerfile` when the project is intended to run in a container. Follow the example's small Python base image, explicit working directory, dependency installation from `requirements.txt`, and non-root runtime user.
- Handle expected failures explicitly and report useful context. Do not copy the example's bare response truthiness check as a general HTTP error-handling pattern; use the client library's status/error API and suitable timeouts when making network requests.
- Preserve a script's intended working directory and runtime assumptions, and document them when they affect how it is run.

## Scope

Use the example as guidance for small Python projects, not as a mandatory architecture for every Python application. For larger applications or existing projects, follow the structure and conventions established by that project.
