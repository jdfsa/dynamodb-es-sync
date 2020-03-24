import os

from elasticsearch import Elasticsearch


def conn():
    """ Create a connection to ElasticSearch"""

    if os.environ.get('ES_ENDPOINT'):
        return Elasticsearch([os.environ.get('ES_ENDPOINT')])

    return Elasticsearch()