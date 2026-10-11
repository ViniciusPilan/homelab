# Repository Engineering Guidelines

## Objective
Make small, correct, maintainable changes that satisfy the requested task.

## Directory structure
```sh
.
├── .agents/skills/                 # Repository-specific agent skills and workflows
│   ├── deploy-cluster-tool/        # Add cluster tools using the Argo CD and Helm conventions
│   └── shell-script-patterns/      # Shell script conventions for this repository
│
├── ansible-playbooks/              # Playbooks for configuring hosts
│                                   #  (Docker installation, Kubernetes node preparation)
│
├── pki/                            # Certificate authority configuration and documentation
│   ├── root-ca/                    # Root CA configuration and usage notes
│   └── intermediate-ca/            # Intermediate CA configuration and usage notes
│
├── scripts/                        # Shell scripts for VM, cluster setup, and maintenance
│   └── dev/                        # Development-specific cluster setup scripts
│
├── systems/                        # Per-system configuration and deployment files
│   ├── k8s-cluster/                # Kubernetes cluster configuration
│   │   ├── provisioning/           # Cluster provisioning inputs and scripts
│   │   │   ├── dev/                # Development cluster configuration and initialization
│   │   │   └── iac/                # Per-environment OpenTofu VM configurations
│   │   └── tools/                  # Cluster add-on configuration (Helm values and Argo CD apps)
│   │       ├── argo/               # Argo CD configuration and application definitions
│   │       └── <tool>/             # Individual tools, such as Cilium, Istio, and Grafana
│   │
│   └── tools-server/               # Tools server configuration
│       ├── apps/                   # Application deployment configuration (Docker Compose)
│       └── iac/                    # OpenTofu server configuration and Ansible inventory
│
└── tf-modules/                     # Reusable OpenTofu modules
    ├── ansible-inventory/          # Generates Ansible inventories from host details
    └── proxmox-vm/                 # Provisions VMs on Proxmox
```

## Before changing code
1. Before make any change, first identify if a skill for that exists in the repository skills directory
2. Read the relevant source files and existing documentation.
3. Identify the project's architecture, conventions, and dependencies.
4. Create an implementation plan for non-trivial tasks.

## Implementation
1. Prefer minimal, focused changes.
2. Follow existing patterns and naming conventions.
3. Do not introduce dependencies without justification.
4. Do not modify unrelated files.
5. Never expose secrets or overwrite user data.
6. Do not commit, push, deploy, or run destructive operations unless explicitly requested.

## Validation
1. Identify the appropriate tests and static checks.
2. Suggest to the user the validation plan for the change

## Completion report
Summarize:
- What changed and why.
- Which tests and checks user should make.
- Any known limitations or remaining risks.
