#!/bin/bash 


# Purpose:
# This script will create the cluster with the project patterns and base tools.

# How to run:
# $ cd systems/k8s-cluster/provisioning/dev
# $ bash init.sh


function main() {
    cd scripts

    bash ../../../../scripts/dev/createClusterBase.sh
    bash ../../../../scripts/installCoreTools.sh
}

main
