To start using your cluster, you need to run the following as a regular user:

```sh
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

Alternatively, if you are the root user, you can run:
```sh
export KUBECONFIG=/etc/kubernetes/admin.conf
```