docker build -t johnhigginsavila/report-api:latest -t johnhigginsavila/report-api:$SHA -f ./Dockerfile .
docker push johnhigginsavila/report-api:latest
docker push johnhigginsavila/report-api:$SHA
