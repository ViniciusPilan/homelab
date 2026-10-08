locals {
  proxmox_endpoint       = "https://192.168.12.20:8006"
  proxmox_node_name      = "heitor"
  proxmox_template_vm_id = "9001"
  proxmox_ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ2lNdBomYBZ40nd/HgUFpG1qFyR5h2bWZM0rk3Cz9YB Key pair used to connect via SSH the Homelab VMs."
  proxmox_ssh_username   = "ubuntu"

}


module "ansible_inventory" {
  source = "../../../../../tf-modules/ansible-inventory"

  vms_groups = [
    {
      name = "controlplane"
      vms = [
        {
          name     = module.controlplane01.vm.name
          ip       = module.controlplane01.vm.ipv4
          ssh_user = module.controlplane01.vm.ssh_user
        }
      ]
    },
    {
      name = "workers"
      vms = [
        {
          name     = module.worker01.vm.name
          ip       = module.worker01.vm.ipv4
          ssh_user = module.worker01.vm.ssh_user
        }
      ]
    }
  ]
}


module "controlplane01" {
  source = "../../../../../tf-modules/proxmox-vm"

  proxmox_endpoint       = local.proxmox_endpoint
  proxmox_node_name      = local.proxmox_node_name
  proxmox_template_vm_id = local.proxmox_template_vm_id

  ssh_public_key = local.proxmox_ssh_public_key
  ssh_username   = local.proxmox_ssh_username

  vm_full_name    = "k8s-controlplane01"
  vm_cpu_cores    = 2
  vm_memory_mb    = 4096
  vm_disk_size_gb = 154
  vm_ip_cidr      = "192.168.12.21/24"
  vm_gateway      = "192.168.12.1"
}

module "worker01" {
  source = "../../../../../tf-modules/proxmox-vm"

  proxmox_endpoint       = local.proxmox_endpoint
  proxmox_node_name      = local.proxmox_node_name
  proxmox_template_vm_id = local.proxmox_template_vm_id

  ssh_public_key = local.proxmox_ssh_public_key
  ssh_username   = local.proxmox_ssh_username

  vm_full_name    = "k8s-worker01"
  vm_cpu_cores    = 2
  vm_memory_mb    = 4096
  vm_disk_size_gb = 154
  vm_ip_cidr      = "192.168.12.22/24"
  vm_gateway      = "192.168.12.1"
}
