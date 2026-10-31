# K8sGPT

K8sGPT runs in the `k8sgpt` namespace and exposes its in-cluster service for
Kubernetes analysis. The chart grants it cluster-wide read-only access to
resources so its analyzers can inspect the cluster.

The chart defaults to the OpenAI backend but does not include an API key.
Configure credentials through the chart's `secret.secretKey` value using a
secret-management workflow before expecting AI explanations. The chart expects
that value to be base64 encoded and creates the `ai-backend-secret` Secret.
Do not commit API credentials to this repository. The deployment can still
start without credentials, but backend analysis will not work.

The Argo CD Application pins the chart source to upstream tag `v0.4.41` (chart
version `1.0.0`).
