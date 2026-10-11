# Kubernetes VMs on Heitor

This OpenTofu configuration clones VMs from the Proxmox template on the
`heitor` node. It provisions `k8s-controlplane01` (`192.168.12.21`) and
`k8s-worker01` (`192.168.12.22`) for the shared k0s cluster. Both use the
`ubuntu` account and configured SSH key, with gateway `192.168.12.1`.

Set the Proxmox API token before running OpenTofu:

```sh
export PROXMOX_VE_API_TOKEN='terraform@pve!provider=<SECRET>'
tofu init
tofu plan
tofu apply
```

OpenTofu generates this host's Ansible inventory at `ansible/inventory.ini`.
Pass it together with Ajax's generated inventory when running Ansible from the
repository root. See the shared
[k0s provisioning runbook](../../README.md) for all steps, including Ajax VMs,
network prerequisites, Cilium, verification, and operations. Run `tofu apply`
after VM address or name changes to regenerate this inventory.
