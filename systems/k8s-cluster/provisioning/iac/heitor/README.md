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
