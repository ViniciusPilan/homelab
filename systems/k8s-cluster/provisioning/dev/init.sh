#!/bin/bash 


# Purpose:
# This script will create the cluster with the project patterns and base tools.

# How to run:
# $ cd cluster-provisioning
# $ bash init.sh


function main() {
    cd scripts

    bash createClusterBase.sh
    bash installCoreTools.sh
}

main
