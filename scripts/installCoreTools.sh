#!/bin/bash 

# This script will create the cluster with the project patterns and base tools:
# - Argocd (to deploy applications)
# - Kyverno (to ensure project patterns)
# - CertManager (to handle with cluster certifications issued by the homelab CA)


# Requirements:
# - Docker installed and daemon running
# - kubectl
# - Helm


# How to run:
# $ cd cluster-provisioning/scripts
# $ bash installCoreTools.sh


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

    # checkInstalledBinary "docker"
    checkInstalledBinary "kubectl"
    checkInstalledBinary "helm"

    # checkDockerIsRunning

    echo "INFO: All requirements are satisfied."
}


function installArgo() {
    echo "INFO: Installing ArgoCD"

    echo "Step 01: add repository to help repo list"
    helm repo add argo https://argoproj.github.io/argo-helm

    echo "Step 02: install Helm release and wait all be ready to proceed"
    helm install argocd argo/argo-cd --values=../../tools/argo/values.yaml --namespace=argocd --create-namespace=true --wait --version 10.9.2

    echo "Step 03: create argo applications to manage all repository applications"
    kubectl apply -f ../../tools/argo/argo-applications.yaml

    echo "Step 04: access ArgoCD"
    echo " - login: admin"
    echo " - password: $(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)"
    echo " Execute 'kubectl port-forward service/argocd-server 8080:80 -n argocd' in terminal to create port mapping to access argocd web ui"
}


function installKyverno() {
    echo "INFO: Installing Kyverno"

    echo "Step 01: add repository to help repo list"
    helm repo add kyverno https://kyverno.github.io/kyverno/
    helm repo update

    echo "Step 02: install Helm release and wait all be ready to proceed"
    helm install kyverno kyverno/kyverno -n kyverno --create-namespace=true --wait --values=../../tools/kyverno/values.yaml --version 3.9.1

    echo "Step 03: apply policies"
    kubectl apply -f ../../tools/kyverno/policies
}


function installCertManager() {
    echo "INFO: Installing CertManager"
    
    echo "Step 01: add repository to help repo list"
    helm repo add jetstack https://charts.jetstack.io
    
    echo "Step 02: install Helm release and wait all be ready to proceed"
    helm install cert-manager jetstack/cert-manager --version v1.21.2 --wait --create-namespace=true -n cert-manager --values=../../tools/certmanager/values.yaml
}


function createIntermediateCASecret() {
    kubectl create secret tls ca-ingress-tls-secret --cert=../../ca-files/intermediate-ca/certs/intermediate-ca.cert.pem --key=../../homelab/ca-files/intermediate-ca/private/intermediate-ca.key.pem -n cert-manager
}


function installIstioBase() {
    echo "INFO: Installing Istio Base components (CRDs + CNI)"
    
    echo "Step 01: add repository to help repo list"
    helm repo add istio https://istio-release.storage.googleapis.com/charts
    
    echo "Step 02: install Helm release and wait all be ready to proceed"
    helm install istio-base istio/base --version 1.30.1 --wait --create-namespace=true -n istio-system --values=../../tools/istio/base/values.yaml

    echo "Step 03: install Helm release and wait all be ready to proceed"
    helm install istio-cni istio/cni --version 1.30.1 --wait --create-namespace=true -n istio-system --values=../../tools/istio/cni/values.yaml
}


function installIstiod() {
    echo "INFO: Installing Istiod"
    
    echo "Step 01: add repository to help repo list"
    helm repo add istio https://istio-release.storage.googleapis.com/charts
    
    echo "Step 02: install Helm release and wait all be ready to proceed"
    helm install istiod istio/istiod --version 1.30.1 --wait --create-namespace=true -n istio-system --values=../../tools/istio/istiod/values.yaml
}



function installIstioGateway() {
    echo "INFO: Installing Istio Gateway"
    
    echo "Step 01: add repository to help repo list"
    helm repo add istio https://istio-release.storage.googleapis.com/charts
    
    echo "Step 02: install Helm release and wait all be ready to proceed"
    helm install istio-ingress istio/gateway --version 1.30.1 --wait --create-namespace=true -n istio-system --values=../../tools/istio/gateway/values.yaml
}


function installIstio() {
    echo "INFO: Installing Istio components"

    installIstioBase
    installIstiod
    installIstioGateway
}


function main() {
    checkRequirements

    installKyverno
    installIstio
    installCertManager
    createIntermediateCASecret
    installArgo
}

main
