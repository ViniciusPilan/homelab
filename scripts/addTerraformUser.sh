#!/bin/bash


# Purpose:
# This script is used for user and token creation in the proxmox token, necessary to be used by Terraform in new VMs provisioning.

# Requirements:
# This script must be executed inside the proxmox host.

# How to run:
# $ bash addTerraformUser.sh


function setupUser(){
    # User
    pveum user add terraform@pve

    # Role
    pveum role add TerraformRole \
    --privs "VM.Allocate,VM.Clone,VM.Config.CDROM,VM.Config.CPU,VM.Config.Disk,VM.Config.HWType,VM.Config.Memory,VM.Config.Network,VM.Config.Options,VM.Config.Cloudinit,VM.Console,VM.Audit,VM.PowerMgmt,VM.GuestAgent.Audit,VM.GuestAgent.Unrestricted,Datastore.AllocateSpace,Datastore.Audit,SDN.Use"

    # User permissions
    pveum acl modify / \
    --user terraform@pve \
    --role TerraformRole
}

function setupToken(){
    # API token
    pveum user token add terraform@pve provider

    # Token permissions
    pveum acl modify / \
    --token 'terraform@pve!provider' \
    --role TerraformRole
}


function main(){
    setupUser
    setupToken
}

main
