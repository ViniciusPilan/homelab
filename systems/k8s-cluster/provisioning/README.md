# k0s cluster on Proxmox

The current OpenTofu configuration in `pro/` provisions four Ubuntu amd64 VMs:

| Role | VM | Proxmox host | Address | vCPU | RAM | Disk |
| --- | --- | --- | --- | ---: | ---: | ---: |
| Controller | `k8s-controlplane01` | Ajax | `192.168.12.31` | 2 | 6 GiB | 18 GiB |
| Worker | `k8s-worker01` | Heitor | `192.168.12.21` | 4 | 4 GiB | 128 GiB |
| Worker | `k8s-worker02` | Heitor | `192.168.12.22` | 4 | 4 GiB | 128 GiB |
| Worker | `k8s-worker03` | Heitor | `192.168.12.23` | 4 | 4 GiB | 128 GiB |

This gives the cluster 14 vCPU and 18 GiB RAM in total, with all workloads
sharing three workers. The controller is a single point of failure, and its
18 GiB disk is much smaller than the workers' disks. Consider increasing the
controller disk for etcd growth and logs. For control-plane HA, use three
controllers and a stable API endpoint (TCP load balancer or VIP); a second
controller alone does not provide etcd quorum through a controller failure.

## Provision and install

Run OpenTofu from `systems/k8s-cluster/provisioning/pro/`. Keep Proxmox API
tokens in environment variables or a private secrets manager, review the plan,
then apply it. OpenTofu generates `pro/ansible/inventory.ini` with one
`[controlplane]` host and three `[workers]` hosts.

From the repository root, prepare the VMs and install k0s:

```sh
ansible-playbook \
  -i systems/k8s-cluster/provisioning/pro/ansible/inventory.ini \
  --private-key ~/.ssh/homelab_vms \
  ansible-playbooks/prepare-k0s-nodes.yml

ansible-playbook \
  -i systems/k8s-cluster/provisioning/pro/ansible/inventory.ini \
  --private-key ~/.ssh/homelab_vms \
  ansible-playbooks/install-k0s-cluster.yml
```

The preparation playbook supports Ubuntu amd64, configures kernel networking,
disables swap, and installs the pinned k0s binary after checksum verification.
The install playbook bootstraps the first `[controlplane]` host, then joins all
`[workers]` using a two-hour token. Token values are suppressed in Ansible
output and stored on workers with root-only permissions.

The cluster API endpoint is `192.168.12.31`. k0s uses
`network.provider: custom` with pod CIDR `10.244.0.0/16` and service CIDR
`10.96.0.0/12`; install Cilium before expecting pods to become Ready. Confirm
the CIDRs do not overlap LAN, VPN, or routed networks, and allow required
Kubernetes and Cilium traffic between nodes and administrators.

Copy the admin kubeconfig securely from the controller with
`sudo k0s kubeconfig admin`. Then install the repository's core tools and
check the nodes:

```sh
export KUBECONFIG=/path/to/secure/k0s-kubeconfig
(cd scripts && bash installCoreTools.sh)
kubectl get nodes -o wide
kubectl get pods -A
```

Review the k0s backup and restore procedure before relying on the cluster, and
back up application persistent data separately from the k0s controller state.
Change the k0s version and its SHA-256 checksum together in
`ansible-playbooks/prepare-k0s-nodes.yml` when upgrading.

## To install CNI
Run the following script:
```sh
$ bash scripts/installCoreTools.sh
```