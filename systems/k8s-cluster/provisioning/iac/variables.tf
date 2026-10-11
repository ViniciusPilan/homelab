variable "proxmox_api_token_ajax" {
  description = "API token used to manage VMs on the Ajax Proxmox host."
  type        = string
  sensitive   = true
}

variable "proxmox_api_token_heitor" {
  description = "API token used to manage VMs on the Heitor Proxmox host."
  type        = string
  sensitive   = true
}
