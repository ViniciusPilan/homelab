# Proxmox VM cloning with Terraform

This configuration creates one or more VMs by making full clones of an existing Proxmox VM template. Each clone receives its own disks, independent of the template's disks. 

```sh
export PROXMOX_VE_API_TOKEN='terraform@pve!provider=<SECRET>'
```

## Create a VM
```sh
tofu init
tofu plan
tofu apply
```

Applying this deployment also writes `ansible/inventory.ini`, with the tools VM,
Kubernetes control plane, and workers in separate Ansible groups. Run Ansible
from this directory with `-i ansible/inventory.ini`.

## Install Docker on the tools server

After the VM is available and SSH access works, run:

```sh
ansible-playbook -i ansible/inventory.ini --private-key ~/.ssh/homelab_vms ../../../ansible-playbooks/install-docker.yml
```

The playbook installs Docker Engine and the Docker Compose plugin from Docker's
official Ubuntu apt repository, enables the Docker service, and adds the SSH
user to the `docker` group. Reconnect over SSH for the new group membership to
take effect.

## Example of a VM creation
```tf
module "controlplane01" {
    source = "../../modules/proxmox-vm"

    proxmox_endpoint       = local.proxmox_endpoint
    proxmox_node_name      = local.proxmox_node_name
    proxmox_template_vm_id = local.proxmox_template_vm_id

    ssh_public_key = local.ssh_public_key
    ssh_username   = local.ssh_username
    
    vm_full_name = "homelab-k8s-controlplane01"
    vm_cpu_cores = "2"
    vm_memory_mb = "6144"
    vm_disk_size_gb = 32
    vm_ip_cidr   = "192.168.12.21/24"
}
```
