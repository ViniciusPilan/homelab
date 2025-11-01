#!/bin/bash

# Script used to create a VM template (Ubuntu 24.04LTS) in the proxmox host
# Source: Mateus Muller - https://www.youtube.com/watch?v=jT6_6qiJffY


CLOUD_IMAGE_URL="https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img"
CLOUD_IMAGE_FILE_NAME="jammy-server-cloudimg-amd64.img"


wget "$CLOUD_IMAGE_URL"

apt install libguestfs-tools -y

virt-customize --add $CLOUD_IMAGE_FILE_NAME \
 --install qemu-guest-agent

qm create 9001 \
 --name ubuntu-2404-cloud-init \
 --numa 0 \
 --ostype l26 \
  --cpu cputype=host \
  --cores 2 \
  --sockets 1 \
  --memory 4096 \
  --net0 virtio,bridge=vmbr0

qm importdisk 9001 $CLOUD_IMAGE_FILE_NAME local-lvm

qm set 9001 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9001-disk-0

qm set 9001 --ide2 local-lvm:cloudinit

qm set 9001 --boot c --bootdisk scsi0

qm set 9001 --serial0 socket --vga serial0

qm set 9001 --agent enabled=1

qm disk resize 9001 scsi0 +200G

qm template 9001

