locals {
  inventory_content = join("\n\n", [
    for group in var.vms_groups : join("\n", concat(
      ["[${group.name}]"],
      [
        for vm in (can(tolist(group.vms)) ? tolist(group.vms) : [group.vms]) :
        "${vm.name} ansible_host=${vm.ip} ansible_user=${vm.ssh_user}"
      ]
    ))
  ])
}

resource "local_file" "ansible_inventory" {
  filename = "${path.root}/ansible/inventory.ini"
  content  = "${local.inventory_content}\n"
}
