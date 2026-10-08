#!/bin/bash


# Purpose:
# This script is used to create a VM template in the Proxmox host.

# Requirements:
# This script must be executed inside the proxmox host.

# How to run:
# $ scp -i ~/.ssh/homelab_vms scripts/createVMTemplate.sh root@192.168.12.20:/root/createVMTemplate.sh
# $ ssh root@192.168.12.20
# $ bash createVMTemplate.sh


UBUNTU_IMAGE=resolute-server-cloudimg-amd64.img
RESOURCES_CPU_CORES=2
RESOURCES_CPU_SOCKETS=1
RESOURCES_MEMORY_BYTES=6144
RESOURCES_DISK_SIZE_GB=150


function setupProxMoxNode() {
    apt update -y
    apt install libguestfs-tools -y
}


function downloadImage() {
    wget "https://cloud-images.ubuntu.com/resolute/current/${UBUNTU_IMAGE}"
    
    virt-customize --add $UBUNTU_IMAGE \
        --install qemu-guest-agent
}


function configureVMTemplate(){
    qm create 9001 \
    --name ubuntu-2604-cloud-init \
    --numa 0 \
    --ostype l26 \
    --cpu cputype=host \
    --cores $RESOURCES_CPU_CORES \
    --sockets $RESOURCES_CPU_SOCKETS \
    --memory $RESOURCES_MEMORY_BYTES \
    --net0 virtio,bridge=vmbr0


    qm importdisk 9001 "/tmp/${UBUNTU_IMAGE}" local-lvm

    qm set 9001 --scsihw virtio-scsi-pci --scsi0 local-lvm:vm-9001-disk-0

    qm set 9001 --ide2 local-lvm:cloudinit

    qm set 9001 --boot c --bootdisk scsi0

    qm set 9001 --serial0 socket --vga serial0

    qm set 9001 --agent enabled=1

    qm disk resize 9001 scsi0 "+${RESOURCES_DISK_SIZE_GB}G"

    qm template 9001
}


function main(){
    cd /tmp || exit
    
    setupProxMoxNode
    downloadImage
    configureVMTemplate
}

main
