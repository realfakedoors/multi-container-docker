docker build -t realfakedoors/multi-container-client:latest -t realfakedoors/multi-container-client:$GIT_SHA -f ./client/Dockerfile ./client
docker build -t realfakedoors/multi-container-server:latest realfakedoors/multi-container-server:$GIT_SHA -f ./server/Dockerfile ./server
docker build -t realfakedoors/multi-container-worker:latest realfakedoors/multi-container-worker:$GIT_SHA -f ./worker/Dockerfile ./worker

docker push realfakedoors/multi-container-client:latest
docker push realfakedoors/multi-container-client:$GIT_SHA
docker push realfakedoors/multi-container-server:latest
docker push realfakedoors/multi-container-server:$GIT_SHA
docker push realfakedoors/multi-container-worker:latest
docker push realfakedoors/multi-container-worker:$GIT_SHA

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=realfakedoors/multi-container-server:$GIT_SHA
kubectl set image deployments/client-deployment client=realfakedoors/multi-container-client:$GIT_SHA
kubectl set image deployments/worker-deployment worker=realfakedoors/multi-container-worker:$GIT_SHA