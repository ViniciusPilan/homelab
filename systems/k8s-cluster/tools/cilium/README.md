# Cilium

Cilium provides the pod network and network policy enforcement for the
Kubernetes cluster. The Argo CD application installs the Cilium 1.20.2 Helm
chart into `kube-system`; Kubernetes IPAM is enabled for the kind setup.

The development kind configuration disables kindnet so Cilium is the only CNI.
Create a fresh kind cluster from that configuration before syncing this
application. Applying Cilium to a running cluster with another CNI requires a
planned migration and should not be done by simply syncing this application.
