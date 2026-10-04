terraform {
  required_version = ">= 1.5.0"

  required_providers {
    proxmox = {
      source  = "bpg/proxmox"
      version = "~> 0.112"
    }
  }
}

provider "proxmox" {
  endpoint = var.proxmox_endpoint
  # Supply PROXMOX_VE_API_TOKEN in the environment as user@realm!token-name=secret.
  insecure = var.proxmox_insecure_tls
}
