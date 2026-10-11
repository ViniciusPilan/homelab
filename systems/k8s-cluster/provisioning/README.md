# k0s cluster on Proxmox

This repository provisions four Ubuntu amd64 VMs across two Proxmox hosts and
joins them into one k0s cluster:

| Role | VM | Proxmox host | Address |
| --- | --- | --- | --- |
| Bootstrap controller | `k8s-controlplane01` | Heitor | `192.168.12.21` |
| Controller | `k8s-controlplane02` | Ajax | `192.168.12.31` |
| Worker | `k8s-worker01` | Heitor | `192.168.12.22` |
| Worker | `k8s-worker02` | Ajax | `192.168.12.32` |

The cluster API address is `192.168.12.21`. This is a single endpoint on the
bootstrap controller, so this layout is **not control-plane highly available**.
Two controllers also do not provide etcd quorum during a controller failure.
For HA, add a third controller and provide a stable TCP load balancer/VIP for
the Kubernetes API before changing the API endpoint in `ansible/k0s.yaml`.

## 1. Check prerequisites and networking

- Confirm the Ubuntu Proxmox template, `ubuntu` account, SSH key, QEMU guest
  agent, DNS, and NTP/time synchronization.
- Reserve all four addresses and confirm both Proxmox hosts and every VM can
  reach each other. Confirm the pod CIDR `10.244.0.0/16` and service CIDR
  `10.96.0.0/12` do not overlap your LAN, VPN, or other routed networks.
- Allow SSH from the Ansible machine. Allow TCP `6443` from cluster nodes and
  administrators to the API endpoint. Allow k0s controller join traffic on TCP
  `9443` between controllers, and node-to-node traffic required by the chosen
  CNI. Consult the [k0s networking port list](https://docs.k0sproject.io/stable/networking/)
  and [Cilium requirements](https://docs.cilium.io/en/stable/operations/system_requirements/)
  when applying host or network firewalls.
- Keep Proxmox API credentials in environment variables or an ignored local
  `.env`; never put them into committed Terraform files.

## 2. Provision the VMs

Review and apply the centralized OpenTofu configuration. It provisions the
VMs on both Proxmox hosts and writes one inventory containing every cluster
node:

```sh
cd systems/k8s-cluster/provisioning/iac
tofu init
tofu plan
tofu apply
```

Inspect the plans before applying. The Terraform state files in these
directories contain infrastructure details and must remain private.

## 3. Prepare all nodes

The centralized configuration writes the complete inventory to
`systems/k8s-cluster/provisioning/iac/ansible/inventory.ini`. Use it for both
node preparation and cluster installation:

```sh
ansible-playbook \
  -i systems/k8s-cluster/provisioning/iac/ansible/inventory.ini \
  --private-key ~/.ssh/homelab_vms \
  ansible-playbooks/prepare-k0s-nodes.yml
```

The playbook supports Ubuntu amd64, configures forwarding and bridge filtering,
disables swap, and installs k0s `v1.36.4+k0s.1` after verifying its published
SHA-256 checksum from the [official k0s release](https://github.com/k0sproject/k0s/releases/tag/v1.36.4%2Bk0s.1).
Change the version and checksum together when upgrading.

## 4. Install k0s and join the nodes

Run the cluster playbook from the repository root:

```sh
ansible-playbook \
  -i systems/k8s-cluster/provisioning/iac/ansible/inventory.ini \
  --private-key ~/.ssh/homelab_vms \
  ansible-playbooks/install-k0s-cluster.yml
```

It configures the first Heitor VM as the bootstrap controller, joins the Ajax
controller, then joins both workers. Join tokens are generated during the run
and written with root-only permissions under `/etc/k0s/` on joining nodes.
They are not printed in Ansible output. Keep Ansible output and controller
access restricted.

## 5. Install Cilium, then verify the cluster

k0s is configured with `network.provider: custom`, so it does not install its
built-in CNI. Install Cilium first using the dedicated script after setting
`KUBECONFIG` to the administrator kubeconfig:

```sh
export KUBECONFIG=/path/to/secure/k0s-kubeconfig
bash scripts/installCilium.sh
```

After Cilium is healthy, bootstrap Argo CD and its root application:

```sh
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update argo
helm upgrade --install argocd argo/argo-cd \
  --version 10.9.2 \
  --namespace argocd --create-namespace \
  --values systems/k8s-cluster/tools/argo/values.yaml --wait
kubectl apply -f systems/k8s-cluster/tools/argo/argo-applications.yaml
```

Run these steps after the configuration has been committed and pushed to the
branch referenced by Argo CD. The older `scripts/installCoreTools.sh` also
installs Kyverno and Istio directly; use it only if you intend that full
installation flow.

Get an admin kubeconfig on the controller with `sudo k0s kubeconfig admin` and
copy it securely to the admin workstation. Verify:

```sh
kubectl get nodes -o wide
kubectl get pods -A
```

All four nodes should become `Ready` after Cilium is healthy. Also confirm
cross-node pod traffic, pod DNS, and API access from an authorized client.

## 6. Add-ons and ongoing operations

The Argo CD root application deploys the manifests under
`systems/k8s-cluster/tools/argo/applications`. Review each tool's storage,
ingress, node selector, and network assumptions before enabling it. Decide on
LAN service exposure and DNS (for example, a load balancer implementation or
an external reverse proxy) before exposing applications.

### Backup and restore

Run a k0s backup on a controller and copy it off the Proxmox host. The archive
contains k0s-managed configuration, PKI, and embedded etcd state, but it does
not include application PersistentVolume data or every object applied directly
to the API. Back those up separately.

```sh
sudo install -d -m 0700 /var/backups/k0s
sudo k0s backup --save-path=/var/backups/k0s
BACKUP_ARCHIVE="$(sudo find /var/backups/k0s -maxdepth 1 -type f \
  -name 'k0s_backup_*.tar.gz' -printf '%T@ %p\n' | sort -nr | \
  head -n 1 | cut -d' ' -f2-)"
test -n "$BACKUP_ARCHIVE" && \
  sudo gpg --symmetric --cipher-algo AES256 "$BACKUP_ARCHIVE"
```

Encrypt the resulting archive before sending it to off-host storage. Restore
only onto a clean replacement controller, following the [k0s restore guide](https://docs.k0sproject.io/stable/backup/).
Restore the controller state first, start k0s with the restored configuration,
then rejoin other controllers and workers. Keep the API `externalAddress`
unchanged during restore. Rehearse the procedure with a disposable cluster
before relying on it.

### Upgrade

Change the pinned k0s version and its verified SHA-256 checksum together in
`ansible-playbooks/prepare-k0s-nodes.yml`. Back up first, read the [k0s upgrade
guide](https://docs.k0sproject.io/stable/upgrade/) and [version skew policy](https://docs.k0sproject.io/stable/version-skew-policy/),
and upgrade one minor release at a time. Run the preparation playbook to put
the new binary on all nodes, then restart the controllers one at a time and
wait for each to recover before restarting the next. For each worker, cordon
and drain before restarting its service, then uncordon it after it returns:

On each controller in sequence, run:

```sh
sudo systemctl restart k0scontroller
sudo k0s status
```

```sh
kubectl cordon k8s-worker01
kubectl drain k8s-worker01 --ignore-daemonsets
ssh ubuntu@192.168.12.22 sudo systemctl restart k0sworker
kubectl uncordon k8s-worker01
```

Repeat for `k8s-worker02` at `192.168.12.32`. The current two-controller
layout can lose etcd quorum if either controller goes down, so upgrades require
a maintenance window and a recent backup. Only drain when workloads can be
moved safely; review local storage and disruption budgets first.

### Credentials and node replacement

The install playbook creates role-specific join tokens with a two-hour expiry.
Re-run it when joining nodes to generate fresh tokens; restrict access to the
controller and root-owned token files under `/etc/k0s/`. Rotate SSH and
Proxmox API credentials through their respective systems and update the
repository's ignored local environment files as needed.

To replace a worker, first check workload capacity, then cordon and drain it
with `kubectl`, remove/recreate the VM through the appropriate OpenTofu
configuration, apply that OpenTofu configuration to regenerate its inventory,
prepare it, and run the cluster playbook to join it again. For controller
replacement, follow the restore procedure and account for the current cluster's
two-member etcd quorum limitation.
