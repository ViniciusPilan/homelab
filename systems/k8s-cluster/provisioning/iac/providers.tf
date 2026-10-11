terraform {
  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.112"
    }
  }
}

provider "proxmox" {
  alias     = "ajax"
  endpoint  = local.ajax.proxmox_endpoint
  api_token = var.proxmox_api_token_ajax
  insecure  = true
}

provider "proxmox" {
  alias     = "heitor"
  endpoint  = local.heitor.proxmox_endpoint
  api_token = var.proxmox_api_token_heitor
  insecure  = true
}
