kubectl apply -f k8s
kubectl set image deployments/report-api-deployment report-api=johnhigginsavila/report-api:$SHA