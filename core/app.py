import json
from datetime import datetime
from elasticsearch import Elasticsearch
from ssl import create_default_context

# elasticsearch connection
# https://elasticsearch-py.readthedocs.io/en/master/
es = Elasticsearch(
    ['localhost'],
    scheme='http',
    port=9200
)


# handler
def lambda_handler(event, context):
    """
    Summary line.

    Extended description of function.

    Parameters:
    event (object): Description of arg1
    context (object):

    """

    for record in event['Records']:
        p = record['dynamodb']['NewImage']
        id = p['id']['S']
        body = {
            'product_id': p['id']['S'],
            'description': p['description']['S'],
            'price': p['price']['N'],
            'timestamp': datetime.now(),
        }

        res = es.index(index='product-index', id=id, body=body)
        print(res['result'])

        res = es.get(index='product-index', id=id)
        print(res['_source'])

        es.indices.refresh(index="product-index")

        res = es.search(index="product-index", body={"query": {"match_all": {}}})
        print("Got %d Hits:" % res['hits']['total']['value'])
        for hit in res['hits']['hits']:
            print("%(timestamp)s id:%(product_id)s - price:%(price)s" % hit["_source"])

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
            # "location": ip.text.replace("\n", "")
        }),
    }
