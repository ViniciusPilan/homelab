resource "proxmox_virtual_environment_vm" "vm" {
  name      = var.vm_full_name
  node_name = var.proxmox_node_name
  started   = true

  clone {
    vm_id = var.proxmox_template_vm_id
    full  = true
  }

  disk {
    datastore_id = "local-lvm"
    interface    = "scsi0"
    size         = var.vm_disk_size_gb
  }

  cpu {
    cores = var.vm_cpu_cores
  }

  memory {
    dedicated = var.vm_memory_mb
  }

  initialization {
    user_account {
      keys     = [var.ssh_public_key]
      username = var.ssh_username
    }

    ip_config {
      ipv4 {
        address = var.vm_ip_cidr
        gateway = var.vm_gateway
      }
    }
  }
}
