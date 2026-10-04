terraform {
    required_providers {
        local = {
            source  = "hashicorp/local"
            version = "~> 2.5"
        }
    }
}

module "tools" {
    source = "../../modules/proxmox-vm"

    proxmox_endpoint       = local.proxmox_endpoint
    proxmox_node_name      = local.proxmox_node_name
    proxmox_template_vm_id = local.proxmox_template_vm_id

    ssh_public_key = local.ssh_public_key
    ssh_username   = local.ssh_username
    
    vm_full_name = "tools-server"
    vm_cpu_cores = "4"
    vm_memory_mb = "6144"
    vm_disk_size_gb = "256"
    vm_ip_cidr   = "192.168.12.29/24"
    vm_gateway   = "192.168.12.1"
}


module "controlplane01" {
    source = "../../modules/proxmox-vm"

    proxmox_endpoint       = local.proxmox_endpoint
    proxmox_node_name      = local.proxmox_node_name
    proxmox_template_vm_id = local.proxmox_template_vm_id

    ssh_public_key = local.ssh_public_key
    ssh_username   = local.ssh_username
    
    vm_full_name    = "homelab-k8s-controlplane01"
    vm_cpu_cores    = "4"
    vm_memory_mb    = "4096"
    vm_disk_size_gb = "160"
    vm_ip_cidr      = "192.168.12.21/24"
    vm_gateway      = "192.168.12.1"
}


module "worker01" {
    source = "../../modules/proxmox-vm"

    proxmox_endpoint       = local.proxmox_endpoint
    proxmox_node_name      = local.proxmox_node_name
    proxmox_template_vm_id = local.proxmox_template_vm_id

    ssh_public_key = local.ssh_public_key
    ssh_username   = local.ssh_username
    
    vm_full_name = "homelab-k8s-worker01"
    vm_cpu_cores = "4"
    vm_memory_mb = "6144"
    vm_disk_size_gb = "160"
    vm_ip_cidr   = "192.168.12.22/24"
    vm_gateway   = "192.168.12.1"
}

resource "local_file" "ansible_inventory" {
    filename = "${path.module}/ansible/inventory.ini"
    content  = <<-EOT
    [tools]
    ${module.tools.vm.name} ansible_host=${module.tools.vm.ip} ansible_user=${module.tools.vm.ssh_user}

    [kubernetes_control_plane]
    ${module.controlplane01.vm.name} ansible_host=${module.controlplane01.vm.ip} ansible_user=${module.controlplane01.vm.ssh_user}

    [kubernetes_workers]
    ${module.worker01.vm.name} ansible_host=${module.worker01.vm.ip} ansible_user=${module.worker01.vm.ssh_user}
    EOT
}
