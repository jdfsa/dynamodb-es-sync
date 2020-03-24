import json
import os

import pytest

from core import app


@pytest.fixture()
def apigw_event():
    current_dir = os.path.dirname(__file__)
    with open(os.path.join(current_dir, '../../events/trigger-event.json')) as f:
        return json.load(f)


def test_lambda_handler(apigw_event):

    ret = app.lambda_handler(apigw_event, "")
    data = json.loads(ret["body"])

    assert ret["statusCode"] == 200
    assert "message" in ret["body"]
    assert data["message"] == "hello world"
    # assert "location" in data.dict_keys()
