---
name: deploy-cluster-tool
description: Add a new tool to this Kubernetes cluster using its ArgoCD application and Helm values file conventions.
---

# Deploy a cluster tool

Use this skill when the user asks to add or deploy a new tool in this cluster repository.

## Required files

- Create the ArgoCD application under `tools/argo/applications/`.
- Create the tool's values file at `tools/<tool-name>/values.yaml`.
- Create a quick README.md file at the tool directory `tools/<tool-name>` explaining what is the tool and why it's used.

Inspect the repository's existing ArgoCD applications and tool directories first. Follow their naming, formatting, source, destination, sync, and namespace conventions. Do not invent chart or cluster settings when the repository or the user's request does not establish them.

## Helm values reference

At the very beginning of every new `values.yaml`, add a YAML comment with a direct reference to the complete default values file for the Helm chart at the exact chart version used by the ArgoCD application. The reference must identify the version and point to the full chart values file (for example, the chart's version-tagged `values.yaml` in its source repository or an equivalent authoritative chart artifact). Verify the reference corresponds to the selected chart and version; do not use a moving `main`, `master`, or `latest` reference when a version-specific reference is available.

When the tool needs local overrides, put them after that reference comment.

When no local values are needed, still create `values.yaml`. It must contain only these two comments, with the reference first:

```yaml
# Full chart values for <chart> version <version>: <version-specific URL>
# This values.yaml is intentionally empty to keep the repository pattern.
```

In the comment defined above, in `<version-specific URL>` replace with the default file version in the repository, not the raw version.

Do not add `{}`, placeholder keys, or other content to that intentionally empty file.

## Completion

Keep the change scoped to the requested tool. Summarize the created application and values file, and mention any chart/version detail that could not be verified from available repository or authoritative chart sources.
