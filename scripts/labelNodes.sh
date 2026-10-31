# This is a draft file.

kubectl label node k8s-worker01 nodepool=general availability=low
kubectl label node k8s-worker02 nodepool=general availability=low
kubectl label node k8s-worker03 nodepool=llm availability=low gpu=true
kubectl label node k8s-worker04 nodepool=core availability=high
