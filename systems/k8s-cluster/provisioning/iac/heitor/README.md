# Kubernetes VMs on Heitor

This OpenTofu configuration clones VMs from the Proxmox template on the
`heitor` node. It provisions the Kubernetes control plane and worker and writes
their connection details to `ansible/inventory.ini` in separate groups.

Set the Proxmox API token before running OpenTofu:

```sh
export PROXMOX_VE_API_TOKEN='terraform@pve!provider=<SECRET>'
tofu init
tofu plan
tofu apply
```

The VMs use the `ubuntu` account and the configured SSH public key. Their
addresses are `192.168.12.21` (control plane) and `192.168.12.22` (worker),
with gateway `192.168.12.1`.

## Prepare the Kubernetes nodes

After the VMs are available and SSH access works, run this from the repository
root to prepare both nodes with containerd and the kubeadm tools:

```sh
ansible-playbook \
  -i ansible/inventory.ini \
  --private-key ~/.ssh/homelab_vms \
  ../../../../../ansible-playbooks/prepare-kubernetes-node.yml
```

The playbook currently targets Ubuntu and defaults to Kubernetes `v1.37`.
Override `kubernetes_minor_version` to match the cluster version you intend to
bootstrap, for example `-e kubernetes_minor_version=v1.36`. It configures
containerd to use systemd cgroups, enables the required kernel modules and
networking sysctls, disables swap, and holds the Kubernetes packages to avoid
unplanned upgrades. Cluster initialization and deployment of a pod network
provider are separate steps.
