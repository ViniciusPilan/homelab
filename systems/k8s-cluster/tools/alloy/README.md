# Grafana Alloy

Grafana Alloy is Grafana's telemetry collector for gathering and forwarding
metrics, logs, and traces. This directory installs the upstream Alloy Helm
chart through Argo CD in the `alloy` namespace. A single Alloy Deployment
discovers `PodMonitor` and `ServiceMonitor` resources across all namespaces
and scrapes the pods or services selected by those resources. Create these
resources with the Prometheus Operator API (`monitoring.coreos.com/v1`) to opt
workloads into scraping; for example, a `PodMonitor` selects pods by labels and
port, while a `ServiceMonitor` selects Services by labels and endpoint port.

The Prometheus Operator CRDs must be installed in the cluster. Alloy forwards
scraped samples to Mimir at `mimir-gateway.mimir.svc.cluster.local` under the
`anonymous` tenant.
