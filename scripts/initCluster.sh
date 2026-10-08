#!/bin/bash

# This is a draft and it will be improved later.

sudo su

kubeadm init

echo "1" > /proc/sys/net/ipv4/ip_forward

export KUBECONFIG=/etc/kubernetes/admin.conf
