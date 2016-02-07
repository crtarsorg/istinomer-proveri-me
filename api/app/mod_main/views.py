from flask import Blueprint
from flask import render_template
from app import mongo_utils

mod_main= Blueprint('main', __name__, url_prefix='/')

@mod_main.route('/', methods=['GET'])
def index():
    factcheck_requests = mongo_utils.find()
    return render_template('mod_main/index.html', factcheck_requests=factcheck_requests)