# kube-bench

This one-shot Job runs the k0s `k0s-1.0` kube-bench profile against the
control-plane node. It uses the upstream v0.16.0 image, mounts the k0s profile
files from this directory, and mounts host configuration read-only with the
host PID namespace enabled so checks can inspect host processes and files.

Run it with:

```sh
kubectl apply -k systems/k8s-cluster/tools/kube-bench
kubectl logs -f job/kube-bench
```

The Job is pinned to `k8s-controlplane01` and runs as root with host PID access;
admission policy must permit host PID and hostPath volumes. Delete the Job
after saving its output if you no longer need it:

```sh
kubectl delete -k systems/k8s-cluster/tools/kube-bench
```

The profile files under `cfg/` are from the
[k0s kube-bench configuration](https://github.com/k0sproject/k0s/tree/main/docs/kube-bench/cfg).
They are loaded into ConfigMaps by Kustomize. The control-plane node is selected
by the Job's node selector; this remains a single-node audit. The k0s guide
documents checks that are intentionally skipped or require local configuration:
[k0s CIS benchmark guide](https://docs.k0sproject.io/stable/cis_benchmark/).
