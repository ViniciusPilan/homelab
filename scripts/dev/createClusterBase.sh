#!/bin/bash 


# Purpose:
# This script will create the cluster with the project patterns and base tools:
# - All Kubernetes components to run applications
# - Kubernetes Gateway API Custom Resource Definitions (to allow setting of ingress traffic management with GatewayAPI)

# Requirements:
# - Docker installed and daemon running
# - Kind
# - kubectl

# How to run:
# $ cd cluster-provisioning/scripts
# $ bash createClusterBase.sh


function checkInstalledBinary() {
    local cmd=$1

    echo "Binary $cmd is installed?"

    if ! command -v $cmd &> /dev/null; then
        echo "ERROR: $cmd is not installed."
        exit 1
    fi

    echo "OK: $cmd is installed."
}


function checkDockerIsRunning() {
    echo "Docker is running?"

    if ! docker info &> /dev/null; then
        echo "ERROR: Docker is installed but is not running."
        exit 1
    fi

    echo "OK: Docker is running."
}


function checkRequirements() {
    echo "INFO: Checking the requirements"

    checkInstalledBinary "docker"
    checkInstalledBinary "kind"
    checkInstalledBinary "kubectl"

    checkDockerIsRunning

    echo "INFO: All requirements are satisfied."
}


function createClusterBase() {
    echo "INFO: Starting the cluster creation process" 
    kind create cluster --config=../config.yaml --name=k8s-cluster
 
    echo "INFO: Waiting nodes be ready to proceed"
    kubectl wait --for=condition=Ready nodes --all --timeout=5m
}


function installGatewayCRDs() {
    echo "INFO: Installing Gateway API CRDs"
    kubectl apply --server-side -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.6.1/standard-install.yaml
}


function main() {
    checkRequirements
    createClusterBase
    installGatewayCRDs
}

main
