#!/bin/bash

# Script used to create a VM template (Ubuntu 24.04LTS) into the proxmox host of my homelab
# Source: Mateus Muller - https://www.youtube.com/watch?v=jT6_6qiJffY


CLOUD_IMAGE_FILE_NAME="jammy-server-cloudimg-amd64.img" # Ubuntu 24.04 LTS (amd64)
CLOUD_IMAGE_URL="https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"

TEMPLATE_NAME="ubuntu-2404-cloud-init"
TEMPLATE_CPU_CORES="2"
TEMPLATE_CPU_SOCKETS="1"
TEMPLATE_MEMORY_SIZE="4096" # Mb
TEMPLATE_STORAGE_DISK_SIZE="200G"


function setupCurrentMachine {
  apt update -y
}


function downloadImage {
  # Download the image from Internet and prepare it to have the
  # best settings for proxmox (installing qemu-guest-agent)
  echo "DOWNLOAD AND PREPARE THE VM IMAGE"
  wget "$CLOUD_IMAGE_URL"
  virt-customize --add $CLOUD_IMAGE_FILE_NAME --install qemu-guest-agent
}


function installDependencies {
  # Installing necessary dependencies
  echo "INSTALLING DEPENDENCIES"
  apt install libguestfs-tools -y
}


function createVMTemplate {
  # Creates the VM Template:
  # 1. Create a specific VM
  # 2. Set some customizations in the created VM
  # 3. Turn the created and customized VM in a template

  echo "STARTING VM TEMPLATE CREATION"

  qm create 9001 \
    --name $TEMPLATE_NAME \
    --numa 0 \
    --ostype l26 \
    --cpu cputype=host \
    --cores "$TEMPLATE_CPU_CORES" \
    --sockets "$TEMPLATE_CPU_SOCKETS" \
    --memory "$TEMPLATE_MEMORY_SIZE" \
    --net0 virtio,bridge=vmbr0

  qm importdisk 9001 $CLOUD_IMAGE_FILE_NAME local-lvm

  qm set 9001 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9001-disk-0
  qm set 9001 --ide2 local-lvm:cloudinit
  qm set 9001 --boot c --bootdisk scsi0
  qm set 9001 --serial0 socket --vga serial0
  qm set 9001 --agent enabled=1

  qm disk resize 9001 scsi0 "+$TEMPLATE_STORAGE_DISK_SIZE"

  qm template 9001
}


function main {
  setupCurrentMachine
  downloadImage
  installDependencies
  createVMTemplate
}


main
