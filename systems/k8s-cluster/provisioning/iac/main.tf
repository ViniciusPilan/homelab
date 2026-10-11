locals {
  heitor = {
    proxmox_endpoint       = "https://192.168.12.20:8006"
    proxmox_node_name      = "heitor"
    proxmox_template_vm_id = "9001"
    proxmox_ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ2lNdBomYBZ40nd/HgUFpG1qFyR5h2bWZM0rk3Cz9YB Key pair used to connect via SSH the Homelab VMs."
    proxmox_ssh_username   = "ubuntu"

    vm_cpu_cores    = 3 
    vm_memory_mb    = 3072
    vm_disk_size_gb = 64
    vm_gateway      = "192.168.12.1"
  }

  ajax = {
    proxmox_endpoint       = "https://192.168.12.30:8006"
    proxmox_node_name      = "ajax"
    proxmox_template_vm_id = "9001"
    proxmox_ssh_public_key = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ2lNdBomYBZ40nd/HgUFpG1qFyR5h2bWZM0rk3Cz9YB Key pair used to connect via SSH the Homelab VMs."
    proxmox_ssh_username   = "ubuntu"

    vm_cpu_cores    = 2 
    vm_memory_mb    = 3072
    vm_disk_size_gb = 18
    vm_gateway      = "192.168.12.1"
  }
}


module "ansible_inventory" {
  source = "../../../../../tf-modules/ansible-inventory"


}


module "controlplane01" {
  source = "../../../../../tf-modules/proxmox-vm"

  proxmox_endpoint       = local.heitor.proxmox_endpoint
  proxmox_node_name      = local.heitor.proxmox_node_name
  proxmox_template_vm_id = local.heitor.proxmox_template_vm_id

  ssh_public_key = local.heitor.proxmox_ssh_public_key
  ssh_username   = local.heitor.proxmox_ssh_username

  vm_full_name    = "k8s-controlplane01"
  vm_ip_cidr      = "192.168.12.21/24"

  vm_cpu_cores    = local.heitor.vm_cpu_cores
  vm_memory_mb    = local.heitor.vm_memory_mb
  vm_disk_size_gb = local.heitor.vm_disk_size_gb
  vm_gateway      = local.heitor.vm_gateway
}

module "controlplane02" {
  source = "../../../../../tf-modules/proxmox-vm"

  proxmox_endpoint       = local.ajax.proxmox_endpoint
  proxmox_node_name      = local.ajax.proxmox_node_name
  proxmox_template_vm_id = local.ajax.proxmox_template_vm_id

  ssh_public_key = local.ajax.proxmox_ssh_public_key
  ssh_username   = local.ajax.proxmox_ssh_username

  vm_full_name    = "k8s-controlplane02"
  vm_ip_cidr      = "192.168.12.31/24"

  vm_cpu_cores    = local.ajax.vm_cpu_cores
  vm_memory_mb    = local.ajax.vm_memory_mb
  vm_disk_size_gb = local.ajax.vm_disk_size_gb
  vm_gateway      = local.ajax.vm_gateway
}


module "worker01" {
  source = "../../../../../tf-modules/proxmox-vm"

  proxmox_endpoint       = local.heitor.proxmox_endpoint
  proxmox_node_name      = local.heitor.proxmox_node_name
  proxmox_template_vm_id = local.heitor.proxmox_template_vm_id

  ssh_public_key = local.heitor.proxmox_ssh_public_key
  ssh_username   = local.heitor.proxmox_ssh_username

  vm_full_name    = "k8s-worker01"
  vm_ip_cidr      = "192.168.12.22/24"

  vm_cpu_cores    = local.heitor.vm_cpu_cores
  vm_memory_mb    = local.heitor.vm_memory_mb
  vm_disk_size_gb = local.heitor.vm_disk_size_gb
  vm_gateway      = local.heitor.vm_gateway
}

module "worker02" {
  source = "../../../../../tf-modules/proxmox-vm"

  proxmox_endpoint       = local.ajax.proxmox_endpoint
  proxmox_node_name      = local.ajax.proxmox_node_name
  proxmox_template_vm_id = local.ajax.proxmox_template_vm_id

  ssh_public_key = local.ajax.proxmox_ssh_public_key
  ssh_username   = local.ajax.proxmox_ssh_username

  vm_full_name    = "k8s-worker02"
  vm_ip_cidr      = "192.168.12.32/24"

  vm_cpu_cores    = local.ajax.vm_cpu_cores
  vm_memory_mb    = local.ajax.vm_memory_mb
  vm_disk_size_gb = local.ajax.vm_disk_size_gb
  vm_gateway      = local.ajax.vm_gateway
}
