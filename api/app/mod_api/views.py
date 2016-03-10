from flask import Blueprint, Response, request
from app import mongo_utils
import tldextract
from bson import json_util
from datetime import datetime

mod_api = Blueprint('api', __name__, url_prefix='/api')


@mod_api.route('/entry/create', methods=['POST'])
def create_entry():
    req = request.json

    extracted = tldextract.extract(req['url'])
    domain = "{}.{}".format(extracted.domain, extracted.suffix)

    doc = {
        'url': req['url'],
        'domain': domain,
        'chromeUserId': req['chrome_user_id'],
        'text': req['text'],
        'timestamp': datetime.fromtimestamp(req['date'] / 1e3),
        'mark': "Unverified"
    }
    mongo_utils.insert(doc)
    return Response(status=200)


@mod_api.route('/entry/get', methods=['POST'])
def get_entries():

    if 'chrome_user_id' in request.json:
        result = mongo_utils.get({}, request.json['chrome_user_id'])
    else:
        result = mongo_utils.get(request.json, None)

    return Response(response=json_util.dumps(result), status=200, mimetype="application/json")
