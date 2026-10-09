#!/bin/bash

# This is a draft and it will be improved later.

sudo su

echo "1" > /proc/sys/net/ipv4/ip_forward

kubeadm init --pod-network-cidr=10.244.0.0/16

export KUBECONFIG=/etc/kubernetes/admin.conf
