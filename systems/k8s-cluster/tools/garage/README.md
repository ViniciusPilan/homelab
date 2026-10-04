# Garage

Garage runs as a single node in the `garage` namespace. Its S3 API is internal
to the cluster at `http://garage.garage.svc.cluster.local:3900`. The data and
metadata claims use the `standard` local-path StorageClass; the data claim is
20 Gi and the metadata claim is 1 Gi. Adjust those values in `values.yaml` to
match the node's available disk.

The Helm chart creates the Garage admin token and RPC secret. The generated
Secret is retained by the chart. The chart's configuration job creates the
`general` and `mimir-metrics` buckets. Create S3 keys through Garage's admin
UI or CLI and grant each key access only to the bucket it needs; keep resulting
S3 credentials out of this Git repository.

For temporary access from a workstation, forward the S3 service port:

```sh
kubectl -n garage port-forward svc/garage 3900:3900
```

Then configure an S3 client to use `http://localhost:3900` as its endpoint and
path-style addressing. In-cluster applications can use the service DNS name
above directly.
