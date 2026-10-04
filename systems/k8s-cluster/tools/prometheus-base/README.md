# Prometheus base

This Helm release installs the Prometheus Operator CRDs and the Kubernetes core component Services and ServiceMonitors (API server, controller manager, scheduler, etcd, kubelet, kube-proxy, and CoreDNS). Grafana Alloy can discover these ServiceMonitors and perform the scrapes. The chart's Prometheus Operator, Prometheus, Alertmanager, Grafana, kube-state-metrics, node exporter, and default rules are disabled.
