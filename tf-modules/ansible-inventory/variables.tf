variable "vms_groups" {
  description = "Inventory groups and their VM connection details."
  type = list(object({
    name = string
    vms = object({
      name     = string
      ip       = string
      ssh_user = string
    })
  }))
}
