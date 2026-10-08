output "vm" {
  description = "Created VM details for downstream configuration."
  value = {
    name     = proxmox_virtual_environment_vm.vm.name
    id       = proxmox_virtual_environment_vm.vm.vm_id
    ipv4     = split("/", var.vm_ip_cidr)[0]
    ssh_user = var.ssh_username
  }
}
