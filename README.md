#### This is a sample application for practicing Kubernetes deployment.

### Running this cluster locally:  
- make sure Docker Desktop's Kubernetes extension is installed and running
- apply all config files at once with `kubectl apply -f k8s`
- fire up your browser and head to `localhost` with no port specified.

### Note on combining k8s config files:  
We could easily combine two objects like `client-deployment` and `client-cluster-ip` in the same file by separating each config with this on a line: `---`. We're not going to do that in this project, but it's a perfectly viable strategy, based on personal preference.  

### Why doesn't the worker Deployment have a corresponding Service or ports?  
- Services are used to send requests into containers, and there's no object in our cluster that needs to send a request to the `multi-container-worker`.

### What is `persistentVolumeClaim` in `k8s/postgres-deployment.yaml`?  
With a Persistent Volume, we can store our data in an object independent of our pods. The `Claim` is a request for this storage, and can be configured by size and access mode.

### Creating Encoded Secrets:  
There are certain environment variables you can't just drop into a container's spec, like database passwords. Luckily, Kubernetes has an object called a Secret, that we can introduce with an imperative command rather than a config file. In this case, we needed to introduce a `PGPASSWORD` in our cluster, so we manually entered `kubectl create secret generic pgpassword --from-literal PGPASSWORD=<our password>`. `generic` refers to the secret type, the lower-case `pgpassword` sets our secret's name in k8s, and the `--from-literal` flag is to designate that we're adding the secret from this command rather than a file. Then we call it in both our `postgres-deployment` and `server-deployment`'s container specs.   

### The Ingress Service (`k8s/ingress-service.yaml`):  
- introduced locally via `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.0.4/deploy/static/provider/cloud/deploy.yaml`
- introduced to Google Cloud via ``
- For the `kubernetes/ingress-nginx` project in particular, our Ingress acts as both a Controller and Router. The setup of this service changes a bit depending on your environment, but we're configuring this to be deployed locally and on Google Cloud.

### Running Kubernetes Dashboard for Docker Desktop:  
- `kubectl apply -f kubernetes-dashboard.yaml` using the file from this repository
- `kubectl proxy`
- in the browser: `http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/`
- click `SKIP` at the sign-in screen.

### Deploying to Google Cloud via Github/Travis:  
- navigate to `console.cloud.google.com`and set up an account
- create a new Project and enable the Kubernetes Engine
- fire up a fresh GKE Standard Cluster
- connect your Github repo to Travis CI.
- create a new `Service Account` in Google Cloud's `IAM & Admin` dashboard with a `Kubernetes Engine Admin` role.
- click `Manage Keys` next to your newly created account in the Service Accounts table and create a new key of type JSON. the new key file should download to your computer.
- spin up a new container with the Travis CLI: `docker run -it -v $(pwd):/app ruby:2.4 sh`
- create a new Github Personal Access Token for Travis that uses [these permissions](https://docs.travis-ci.com/user/github-oauth-scopes/#repositories-on-httpstravis-cicom-private-and-public).
- `gem install travis` in the new container
- `travis login --github-token <GENERATED_TOKEN> --com`
- copy the JSON key file into the working directory
- `cd app`, `ls`, verify that the file is there
- `travis encrypt-file <YOUR_KEY_FILE>.json -r <USERNAME>/<REPO> --com`
- copy the `openssl` command that it spits out and paste it in `.travis.yml` over line 12.
- check the `.json.enc` file into git and _DELETE_ the original key file.
- `exit` the container.
- update line 21 in `.travis.yml` to your Google Cloud project name (actually the ID in the Projects index table).
- change line 23 in `.travis.yml` to your Google Cloud data center (found in the `Clusters` table).
- update line 25 to your cluster's name.
- update line 27 to your own docker login env vars in Travis settings (case sensitive).
- update lines 29 and 33 to your own test image name and docker id.
- in `deploy.sh`, replace all image names with your own.  

##### in your Google Cloud cluster, open a Cloud Shell Terminal session and run these commands to set up your env: 
- `gcloud config set project <YOUR PROJECT ID>`
- `gcloud config set compute/zone <YOUR REGION>`
- `gcloud container clusters get-credentials <YOUR CLUSTER NAME>`

##### Install Helm (a k8s package manager) and ingress-nginx in your Cloud Shell:
- `curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3`
- `chmod 700 get_helm.sh`
- `./get_helm.sh`
- `helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx`
- `helm install my-release ingress-nginx/ingress-nginx`
- if there's an error like `charge requires kubeVersion: >=1.16.0-0...`,
  you might need a quick manual cluster upgrade:
  `gcloud container clusters upgrade  YOUR_CLUSTER_NAME --master --cluster-version 1.16`

### A note on image tags in `deploy.sh`:  
We tag our images with a `:latest` version so that all our images are kept current if we need to redeploy our whole cluster, and a `:$GIT_SHA` version as a little trick to be able to refer to a container's production image version with its associated commit if something breaks.