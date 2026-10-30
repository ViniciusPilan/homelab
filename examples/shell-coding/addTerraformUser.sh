#!/bin/bash


# Purpose:
# This script is used for user and token creation in the proxmox token, 
# necessary to be used by Terraform in new VMs provisioning.

# Requirements:
# This script must be executed inside the proxmox host.

# How to run:
# $ bash addTerraformUser.sh


USER_NAME=terraform@pve
ROLE_NAME=TerraformRole


function setupUser(){
    local privs=(
        VM.Allocate
        VM.Clone
        VM.Config.CDROM
        VM.Config.CPU
        VM.Config.Disk
        VM.Config.HWType
        VM.Config.Memory
        VM.Config.Network
        VM.Config.Options
        VM.Config.Cloudinit
        VM.Console
        VM.Audit
        VM.PowerMgmt
        VM.GuestAgent.Audit
        VM.GuestAgent.Unrestricted
        Datastore.AllocateSpace
        Datastore.Audit
        SDN.Use    
    )
    
    # User
    pveum user add $USER_NAME

    # Role
    pveum role add $ROLE_NAME \
    --privs "${privs[@]}"

    # User permissions
    pveum acl modify / \
    --user $USER_NAME \
    --role $ROLE_NAME
}

function setupToken(){
    # API token
    pveum user token add $USER_NAME provider

    # Token permissions
    pveum acl modify / \
    --token "$USER_NAME!provider" \
    --role $ROLE_NAME
}


function main(){
    setupUser
    setupToken
}

main
