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

    eventId = event['Records'][0]['eventID']
    print(eventId)

    doc = {
        'author': 'kimchy',
        'text': 'Elasticsearch: cool. bonsai cool.',
        'timestamp': datetime.now(),
    }
    res = es.index(index='test-index', id=1, body=doc)
    print(res['result'])
    res = es.get(index='test-index', id=1)
    print(res['_source'])

    es.indices.refresh(index="test-index")

    res = es.search(index="test-index", body={"query": {"match_all": {}}})
    print("Got %d Hits:" % res['hits']['total']['value'])
    for hit in res['hits']['hits']:
        print("%(timestamp)s %(author)s: %(text)s" % hit["_source"])

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "hello world",
            # "location": ip.text.replace("\n", "")
        }),
    }
