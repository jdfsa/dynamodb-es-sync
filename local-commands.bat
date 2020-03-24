# SAM
# https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-getting-started-hello-world.html


# elastic search
# https://www.elastic.co/guide/en/elasticsearch/reference/current/docker.html#docker-compose-file
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.6.1
docker run -d --name elasticsearch ^
	-p 9200:9200 ^
	-p 9300:9300 ^
	-e "discovery.type=single-node" ^
	docker.elastic.co/elasticsearch/elasticsearch:7.6.1



# kibana
# https://www.elastic.co/guide/en/kibana/current/docker.html
# docker run --link YOUR_ELASTICSEARCH_CONTAINER_NAME_OR_ID:elasticsearch -p 5601:5601 {docker-repo}:{version}
docker pull docker.elastic.co/kibana/kibana:7.6.1
docker run -d --name kibana ^
  -p 5601:5601 ^
  --link 34ecf665a092:elasticsearch ^
  -e "ELASTICSEARCH_URL=http://elasticsearch:9200" ^
  docker.elastic.co/kibana/kibana:7.6.1



# dynamodb
# https://medium.com/better-programming/how-to-set-up-a-local-dynamodb-in-a-docker-container-and-perform-the-basic-putitem-getitem-38958237b968
docker run -d -name dynamodb -p 8042:8000 amazon/dynamodb-local

aws dynamodb --endpoint-url http://localhost:8042 create-table --table-name demo-customer-info ^
--attribute-definitions AttributeName=customerId,AttributeType=S --key-schema AttributeName=customerId,KeyType=HASH ^
--provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

aws dynamodb --endpoint-url http://localhost:8042 list-tables

aws dynamodb put-item --endpoint-url http://localhost:8042 --table-name demo-customer-info ^
  --item '{"customerId": {"S": "1111"}, "email": {"S": "someemail@something.com"}}' ^
  --condition-expression "attribute_not_exists(customerId)"

aws dynamodb get-item --endpoint-url http://localhost:8042 --table-name demo-customer-info --key '{"customerId": {"S": "1111"}}'




# docs python
https://www.geeksforgeeks.org/python-docstrings/

