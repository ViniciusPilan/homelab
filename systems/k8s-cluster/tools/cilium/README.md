# Cilium

Cilium provides pod networking and network policy enforcement. The Argo CD
application installs the Cilium 1.20.2 Helm chart into `kube-system`; Kubernetes
IPAM is enabled and uses the PodCIDRs assigned to nodes by the control plane.

The k0s cluster uses `network.provider: custom`, so k0s does not install a
second CNI. Install Cilium before syncing the Argo CD root application. The
development kind configuration also disables kindnet so Cilium is the only
CNI. Never install Cilium alongside another CNI; changing providers on an
existing cluster requires a planned cluster redeployment.
