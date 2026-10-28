# Repository Engineering Guidelines

## Purpose

Make small, correct, maintainable changes that fit this homelab repository.
Read the relevant configuration and documentation before editing, and preserve
the existing deployment architecture unless the task asks to change it.

## Repository layout

```text
.
├── .agents/skills/                 # Repository workflows and conventions
├── ansible-playbooks/              # Host preparation and k0s installation
├── examples/python-coding/         # Example Python project structure
├── internal-tools/weather/         # Weather tool API and frontend
├── pki/
│   ├── root-ca/                     # Root CA configuration and documentation
│   └── intermediate-ca/             # Intermediate CA configuration and documentation
├── scripts/                         # Cluster, host, and development scripts
├── systems/
│   └── k8s-cluster/
│       ├── provisioning/
│       │   ├── dev/                 # Development-cluster provisioning
│       │   └── pro/                 # Production-cluster provisioning and Ansible
│       └── tools/                   # Cluster add-ons, Argo CD apps, and policies
└── tf-modules/
    ├── ansible-inventory/           # Reusable Ansible inventory module
    └── proxmox-vm/                  # Reusable Proxmox VM module
```

The Kubernetes cluster uses k0s on Proxmox VMs. Development and production
provisioning configuration live in `systems/k8s-cluster/provisioning/dev/` and
`systems/k8s-cluster/provisioning/pro/`. Cluster add-ons are organized under
`systems/k8s-cluster/tools/`, with Argo CD Applications in
`systems/k8s-cluster/tools/argo/applications/`. The repository also contains
the standalone weather tool in `internal-tools/weather/` and reusable OpenTofu
modules in `tf-modules/`.

## Before changing files

1. Check `.agents/skills/` for a workflow that applies to the task and read its
   `SKILL.md`. In particular, use `deploy-cluster-tool` for a new cluster tool
   and `shell-script-patterns` when creating or revising repository scripts.
2. Read the target files and their related README or runbook. For provisioning
   or deployment changes, inspect the corresponding Argo CD, Helm, OpenTofu,
   or Ansible configuration as applicable.
3. For non-trivial work, outline a brief implementation plan before editing.

## Implementation conventions

- Keep changes focused; follow the existing file layout, naming, and formatting.
- Do not add dependencies without a clear need.
- Keep credentials and private key material out of source files, command output,
  and documentation. Use the repository's documented environment-variable or
  secret-management patterns for sensitive values.
- Treat OpenTofu state, generated inventories, and existing user configuration
  as user data. Do not replace or discard them as part of unrelated work.
- Do not commit, push, deploy, or run destructive operations unless explicitly
  requested.
- Do not edit unrelated files.

## Area-specific guidance

### Kubernetes tools

- Follow `.agents/skills/deploy-cluster-tool/SKILL.md` when adding a tool.
- Keep each Argo CD Application in
  `systems/k8s-cluster/tools/argo/applications/` and values/documentation in
  that tool's directory. Match existing source, destination, release, and sync
  conventions; check whether the app is active rather than assuming every
  manifest in the directory is enabled.
- Keep the version-specific Helm default-values reference at the top of each
  chart values file, as required by the skill.
- Check related policies and dependencies when changing an add-on's behavior.

### Shell scripts

- Follow `.agents/skills/shell-script-patterns/SKILL.md` for script work.
- Scripts are generally Bash. Document purpose, requirements, and invocation
  context when relevant; quote expansions and make meaningful failures explicit.
- Do not add strict-mode flags mechanically; choose error handling that suits
  the script and its side effects.

### OpenTofu and Ansible

- Reusable VM and inventory logic belongs in `tf-modules/`; per-system
  configuration stays under the relevant `systems/*/iac` or provisioning path.
- Keep VM inputs, provider configuration, and generated inventory relationships
  consistent with the existing modules and runbooks.
- Preserve pinned versions and integrity checks where used. Review plans and
  understand resource effects before recommending or running an apply.
- Ansible playbooks should retain clear host targeting, privilege requirements,
  and idempotent tasks where practical. Never print secret values.

### PKI and Compose

- Keep CA usage and lifecycle guidance alongside the relevant files under
  `pki/`; never add private keys or issued secret material to documentation.
- Keep tools-server service definitions in its Compose configuration and follow
  the existing deployment approach.

## Validation

- Identify the most relevant static checks for the files changed (for example,
  YAML parsing, `bash -n`, `tofu fmt -check`, or Ansible syntax checks).
- Do not run tests or checks unless the user asks for verification. Instead,
  report the appropriate checks for the user to run and any checks that were
  actually performed.
- Do not run `tofu apply`, deploy cluster resources, or alter live systems
  unless explicitly requested.

## Completion report

Summarize what changed and why, the checks performed or recommended, and any
known limitations or remaining risks.
