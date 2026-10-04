terraform {
    required_providers {
        local = {
            source  = "hashicorp/local"
            version = "~> 2.5"
        }
    }
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

