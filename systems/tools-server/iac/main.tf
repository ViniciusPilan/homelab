locals {
    proxmox_endpoint = "https://192.168.12.20:8006"
    proxmox_node_name = "heitor"
    proxmox_template_vm_id = "9001"
    proxmox_ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ2lNdBomYBZ40nd/HgUFpG1qFyR5h2bWZM0rk3Cz9YB Key pair used to connect via SSH the Homelab VMs."
    proxmox_ssh_username = "ubuntu"
    
}


module "ansible_inventory" {
    source = "../../../tf-modules/ansible-inventory"

    vms_groups = [
        {
            name = "tools"
            vms  = [
                {
                    name     = module.tools.vm.name
                    ip       = module.tools.vm.ipv4
                    ssh_user = module.tools.vm.ssh_user
                }
            ]
        }
    ]
}


module "tools" {
    source = "../../../tf-modules/proxmox-vm"

    proxmox_endpoint       = local.proxmox_endpoint
    proxmox_node_name      = local.proxmox_node_name
    proxmox_template_vm_id = local.proxmox_template_vm_id

    ssh_public_key = local.proxmox_ssh_public_key
    ssh_username   = local.proxmox_ssh_username
    
    vm_full_name = "tools-server"
    vm_cpu_cores = "4"
    vm_memory_mb = "6144"
    vm_disk_size_gb = "256"
    vm_ip_cidr   = "192.168.12.29/24"
    vm_gateway   = "192.168.12.1"
}
