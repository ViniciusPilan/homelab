#!/bin/bash

# Ref: https://github.com/cri-o/packaging/blob/main/README.md#usage

KUBERNETES_VERSION=v1.34
CRIO_VERSION=v1.34

# Install the dependencies for adding repositories
apt-get update
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


# Install the packages
apt-get update
apt-get install -y cri-o kubelet kubeadm kubectl

# Start CRI-O
systemctl start crio.service


# Bootstrap a cluster
swapoff -a
modprobe br_netfilter
sysctl -w net.ipv4.ip_forward=1

# kubeadm init
