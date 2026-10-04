output "vm" {
  description = "Created VM details for downstream configuration."
  value = {
    name     = proxmox_virtual_environment_vm.vm.name
    vm_id    = proxmox_virtual_environment_vm.vm.vm_id
    ip       = split("/", var.vm_ip_cidr)[0]
    ssh_user = var.ssh_username
  }
}
