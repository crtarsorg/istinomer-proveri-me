from flask import Blueprint, Response, request
from flask import render_template
from app import mongo_utils
import tldextract

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
        'text': req['text'],
        'factChecked': False
    }
    mongo_utils.insert(doc)
    return Response(status=200)



