variable "vms_groups" {
  description = "Inventory groups and their VM connection details."
  type = list(object({
    name = string
    # Accept a VM object for existing callers and a list of VM objects for
    # groups that contain multiple machines.
    vms = any
  }))
}
