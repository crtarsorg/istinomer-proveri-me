from flask import Blueprint, Response, request, render_template
from app import mongo_utils
import tldextract
from bson import json_util
from datetime import datetime

mod_api = Blueprint('api', __name__, url_prefix='/api')


@mod_api.route('/', methods=['GET'])
def index():
    return render_template('mod_api/index.html')


@mod_api.route('/factcheck/request', methods=['POST'])
def factcheck_request():
    req = request.json

    extracted = tldextract.extract(req['url'])
    domain = "{}.{}".format(extracted.domain, extracted.suffix)

    doc = {
        'url': req['url'],
        'domain': domain,
        'chrome_user_id': req['chrome_user_id'],
        'text': req['text'],
        "date": datetime.fromtimestamp(req['date'] / 1e3),
        'factChecked': "Unverified"
    }
    mongo_utils.insert(doc)
    return Response(status=200)


@mod_api.route('/fact-check/classifications', methods=["POST"])
def query_classification():

    # validate filtering params before applying the query to DB
    if len(request.json) > 1:
        return Response(status=400)

    elif 'classifications' not in request.json:
        return Response(status=400)

    elif not set(request.json['classifications']).issubset(['Promise', 'Truthfulness', 'Consistency']):
        return Response(status=400)

    else:
        # retrieve data from database, based on classification params
        result = mongo_utils.get_entries_for_classifications(request.json['classifications'])
        return Response(response=json_util.dumps(result), status=200, mimetype="application/json")


@mod_api.route('/fact-check/status-provider', methods=['POST'])
def send_data_and_status():

    # validate filtering params before applying the query to DB
    if len(request.json) > 1:
        return Response(status=400)

    elif 'chrome_user_id' not in request.json:
        return Response(status=400)

    else:
        # retrieve data from database, based on classification params
        result = mongo_utils.find({'chrome_user_id': request.json['chrome_user_id']})

        return Response(response=json_util.dumps(result), status=200, mimetype="application/json")


@mod_api.route('/latest-fact-checks', methods=['POST'])
def get_latest_results():
    result = mongo_utils.find()
    return Response(response=json_util.dumps(result[:50]), status=200, mimetype="application/json")
