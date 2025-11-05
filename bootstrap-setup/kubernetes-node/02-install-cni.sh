#!/bin/bash

# Script that installs Cilium CNI in a Kubernetes node

# Refs: 
# - https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#install-the-cilium-cli
# - https://docs.cilium.io/en/stable/gettingstarted/k8s-install-default/#install-cilium


CILIUM_CLI_VERSION=$(curl -s https://raw.githubusercontent.com/cilium/cilium-cli/main/stable.txt)
CLI_ARCH=arm64


function installCiliumCLI {
  if [ "$(uname -m)" = "aarch64" ]; then CLI_ARCH=arm64; fi
  curl -L --fail --remote-name-all https://github.com/cilium/cilium-cli/releases/download/${CILIUM_CLI_VERSION}/cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}
  sha256sum --check cilium-linux-${CLI_ARCH}.tar.gz.sha256sum
  sudo tar xzvfC cilium-linux-${CLI_ARCH}.tar.gz /usr/local/bin
  rm cilium-linux-${CLI_ARCH}.tar.gz{,.sha256sum}
}

function installCilium {
  cilium install --version 1.18.3
}

function main {
  installCiliumCLI
  installCilium
}

main
