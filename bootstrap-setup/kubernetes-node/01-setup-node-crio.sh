#!/bin/bash


# Script that make the setup of a Kubernetes node (control-plane)

# Ref: https://github.com/cri-o/packaging/blob/main/README.md#usage


KUBERNETES_VERSION=v1.34
CRIO_VERSION=v1.34


function installDependencies {
  # Install the dependencies for adding repositories
  apt-get update -y
  apt-get install -y software-properties-common curl

  # Add the Kubernetes repository
  curl -fsSL https://pkgs.k8s.io/core:/stable:/$KUBERNETES_VERSION/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

  echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/$KUBERNETES_VERSION/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list

  # Add the CRI-O repository
  curl -fsSL https://download.opensuse.org/repositories/isv:/cri-o:/stable:/$CRIO_VERSION/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/cri-o-apt-keyring.gpg

  echo "deb [signed-by=/etc/apt/keyrings/cri-o-apt-keyring.gpg] https://download.opensuse.org/repositories/isv:/cri-o:/stable:/$CRIO_VERSION/deb/ /" |
    tee /etc/apt/sources.list.d/cri-o.list
}


function installCorePackages {
  # Install the packages
  apt-get update -y
  apt-get install -y cri-o kubelet kubeadm kubectl

  # Start CRI-O
  systemctl start crio.service
}


function bootstrapClusterNode {
  swapoff -a
  modprobe br_netfilter
  sysctl -w net.ipv4.ip_forward=1

  # kubeadm init
}


function main {
  installDependencies
  installCorePackages
  bootstrapClusterNode
}

main
