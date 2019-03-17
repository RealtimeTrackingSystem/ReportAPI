docker build -t johnhigginsavila/report-api-api:latest -t johnhigginsavila/report-api:$SHA -f ./Dockerfile .
docker push johnhigginsavila/report-api:latest
docker push johnhigginsavila/report-api:$SHA
kubectl apply -f k8s
kubectl set image deployments/report-api-deployment report-api=johnhigginsavila/report-api:$SHA