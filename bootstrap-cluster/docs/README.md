# Homelab

## Kubernetes nodes architecture
![arch-img](./homelab-nodes-arch.jpeg)

## The on-premise machines
The homelab currently has two proxmox nodes, each one hosting some virtual machines:
- Aquiles
- Heitor

Each one of these VMs that run in the proxmox nodes is a Kubernetes cluster node.

## The Kubernetes nodes
There are only three node groups in this homelab:
1. **node-group: control-plane** - The control-plane nodes, one per on-premise machine.
2. **node-group: app** -  Contains the core application workloads (llm).
3. **node-group: tools** - Contains the core tools to allow cluster and the app works fine.
