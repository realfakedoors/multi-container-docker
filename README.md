# multi-container-docker

## This is a sample application for practicing Kubernetes deployment.

*Running this cluster locally:*  
- make sure Kubernetes is installed and running
- apply all config files at once with `kubectl apply -f k8s`

*Note on combining k8s config files:*  
We could easily combine two objects like `client-deployment` and `client-cluster-ip` in the same file by separating each config with this on a line: `---`. We're not going to do that in this project, but it's a perfectly viable strategy, based on personal preference.  

*Why doesn't the worker Deployment have a corresponding Service or ports?*  
- Services are used to send requests into containers, and there's no object in our cluster that needs to send a request to the `multi-container-worker`.

*What is `persistentVolumeClaim` in `k8s/postgres-deployment.yaml`?*  
With a Persistent Volume, we can store our data in an object independent of our pods. The `Claim` is a request for this storage, and can be configured by size and access mode.

*Creating Encoded Secrets:*  
There are certain environment variables you can't just drop into a container's spec, like database passwords. Luckily, Kubernetes has an object called a Secret, that we can introduce with an imperative command rather than a config file. In this case, we needed to introduce a `PGPASSWORD` in our cluster, so we manually entered `kubectl create secret generic pgpassword --from-literal PGPASSWORD=<our password>`. `generic` refers to the secret type, the lower-case `pgpassword` sets our secret's name in k8s, and the `--from-literal` flag is to designate that we're adding the secret from this command rather than a file. Then we designate it in our `postgres deployment` container spec and call it in our `server-deployment`'s container spec.   