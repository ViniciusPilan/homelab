#!/bin/bash

# Purpose: Install Cilium as the k0s cluster's CNI before bootstrapping Argo CD.
# Requirements: kubectl and Helm configured for the target cluster.
# How to run: bash scripts/installCilium.sh from any directory in the repository.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
TOOLS_DIR="$REPO_ROOT/systems/k8s-cluster/tools"
CILIUM_VERSION="1.20.2"

function checkInstalledBinary() {
    local cmd="$1"

    if ! command -v "$cmd" >/dev/null 2>&1; then
        echo "ERROR: $cmd is not installed."
        exit 1
    fi
}

function installCilium() {
    echo "INFO: Installing Cilium $CILIUM_VERSION into kube-system"

    kubectl cluster-info >/dev/null || {
        echo "ERROR: kubectl cannot reach the target cluster."
        exit 1
    }

    helm repo add cilium https://helm.cilium.io/ || exit 1
    helm repo update cilium || exit 1
    helm upgrade --install cilium cilium/cilium \
        --version "$CILIUM_VERSION" \
        --namespace kube-system \
        --create-namespace \
        --values "$TOOLS_DIR/cilium/values.yaml" \
        --wait
}

function main() {
    checkInstalledBinary kubectl
    checkInstalledBinary helm
    installCilium
}

main
