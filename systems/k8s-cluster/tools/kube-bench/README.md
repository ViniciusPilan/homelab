# kube-bench

This one-shot Job runs kube-bench against the control-plane node. It uses the
upstream v0.16.0 image and mounts the host's `/etc` and `/var` read-only, with
the host PID namespace enabled so the checks can inspect host processes and
configuration.

Run it with:

```sh
kubectl apply -f systems/k8s-cluster/tools/kube-bench/job.yaml
kubectl logs -f job/kube-bench
```

The Job is pinned to `k8s-controlplane01` and runs as root with host PID access;
admission policy must permit host PID and hostPath volumes. Delete the Job
after saving its output if you no longer need it:

```sh
kubectl delete -f systems/k8s-cluster/tools/kube-bench/job.yaml
```

## k0s results

kube-bench's built-in version detection selects a generic Kubernetes CIS
benchmark; kube-bench v0.16.0 does not list a k0s-specific benchmark in its
supported benchmark map. Some results may therefore reflect generic Kubernetes
paths or checks that do not match k0s. For a k0s-aware audit, use the
`k0s-1.0` configuration documented by the [k0s CIS benchmark guide](https://docs.k0sproject.io/stable/cis_benchmark/).
