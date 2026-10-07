locals {
  inventory_content = join("\n\n", [
    for group in var.vms_groups : join("\n", [
      "[${group.name}]",
      "${group.vms.name} ansible_host=${group.vms.ip} ansible_user=${group.vms.ssh_user}",
    ])
  ])
}

resource "local_file" "ansible_inventory" {
  filename = "${path.root}/ansible/inventory.ini"
  content  = "${local.inventory_content}\n"
}
