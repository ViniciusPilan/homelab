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


# TO DOs

k8sgpt

Policy as a code
- recs
- non root (verificar se ja nao ta sendo validao no baseline do security admission controller)

Examples:
- javascript coding

Workflows:
- We should have a global workflow named files validator that trigges specific actions for kubesec and yamllint only if have yaml files in the PR 
    - It's better than our current scenario because now every PR starts the yaml validator workflow (even with no yaml manifests)
    - Our current scenario already runs linters only in the yaml manifests, but a workflow named yaml lint and yaml sec validation for all PRs could make wrong point of view.

skill:
- javascript coding
- create sec reports (AI analyzes popeye and kube-bench logs to create smart reports)

apps:
- Weather as pod in kubernetes
- Brazilian financial market summary dashboard
- trivy image scan
- signed images
- build multistage
- hardning

Cluster:
- ghcr configured via image registry secret
- nodepools
- ingress
- Create storageclass provider
- Secret Operator
