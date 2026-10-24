# Popeye

Popeye scans live Kubernetes resources for configuration and operational issues. This Helm chart runs it as a CronJob, with read only cluster access, and keeps scan output in the Job logs. The default schedule is hourly; use `kubectl -n popeye logs job/<job-name>` to inspect a completed scan.

The chart creates the RBAC resources Popeye needs to inspect cluster resources. Findings are reported in the scan output; this deployment does not configure a Pushgateway or persistent report storage.
