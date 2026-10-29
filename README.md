# homelab
Repository to centralize the files of my homelab.

See the [k0s provisioning runbook](systems/k8s-cluster/provisioning/README.md)
for the Proxmox VM and Ansible deployment steps.

## Kubernetes cluster tools

The following tools are declared as active Argo CD applications in
`systems/k8s-cluster/tools/argo/applications/`:

| Tool | What it does |
| --- | --- |
| Cilium | Provides pod networking (CNI) and enforces Kubernetes network policies. |
| Garage | Provides S3-compatible object storage within the cluster. |
| Grafana Alloy | Discovers configured PodMonitor and ServiceMonitor resources, scrapes metrics, and forwards them to the configured Mimir endpoint. |
| Grafana | Provides dashboards and visualizations, configured with Mimir as its default metrics data source. |
| Istio (base, CNI, Istiod, ingress gateway) | Provides the service mesh: installs its resource definitions and node networking integration, runs the mesh control plane, and exposes ingress traffic through a gateway. |
| Kyverno | Enforces Kubernetes policies; the Argo CD application also applies the repository's policy manifests. |
| kube-prometheus-stack (Prometheus base) | Installs Prometheus Operator CRDs and Kubernetes component monitoring resources. Prometheus is enabled in agent mode; Alertmanager, bundled Grafana, kube-state-metrics, node exporter, and default rules are disabled. |
| Metrics Server | Collects resource usage metrics for Kubernetes nodes and pods, used by features such as `kubectl top` and resource-based autoscaling. |

Mimir and cert-manager have application manifests in the same directory, but
their manifests are currently commented out and are not active Argo CD
applications.


# TO DOs

kube-bench
kubesec?
popeye?
k8sgpt

Create storageclass provider

Secret Operator

Policy as a code
- recs
- non root (verificar se ja nao ta sendo validao no baseline do security admission controller)
