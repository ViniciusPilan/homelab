variable "proxmox_endpoint" {
  description = "Proxmox API endpoint, including port 8006 (for example https://pve.example:8006/)."
  type        = string
}

variable "proxmox_insecure_tls" {
  description = "Set true only when Proxmox uses a certificate Terraform cannot validate."
  type        = bool
  default     = true
}

variable "proxmox_node_name" {
  description = "Proxmox node where new VMs will be created."
  type        = string
}

variable "proxmox_template_vm_id" {
  description = "Numeric VM ID of the existing Proxmox template to clone."
  type        = number
}

variable "ssh_public_key" {
  description = "Required OpenSSH public key injected into cloned VMs through cloud-init."
  type        = string
}

variable "ssh_username" {
  description = "Required guest account name to receive ssh_public_key."
  type        = string
}

variable "vm_full_name" {
  description = "Full name assigned to the virtual machine."
  type        = string
}

variable "vm_cpu_cores" {
  description = "Number of CPU cores assigned to the virtual machine."
  type        = number
}

variable "vm_memory_mb" {
  description = "Amount of memory assigned to the virtual machine, in MiB."
  type        = number
}

variable "vm_ip_cidr" {
  description = "IPv4 address and prefix assigned to the virtual machine (CIDR notation)."
  type        = string
}

variable "vm_gateway" {
  description = "IPv4 default gateway for the VM."
  type        = string
}

variable "vm_disk_size_gb" {
  description = "Root disk size for the VM in GiB."
  type        = number
  validation {
    condition     = var.vm_disk_size_gb > 153.5
    error_message = "vm_disk_size_gb must be greater than 153.5 GiB."
  }
}
