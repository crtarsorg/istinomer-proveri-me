from flask import Blueprint, render_template, request, redirect, url_for, Response
from app import mongo_utils
from app.forms.form import AdminForm

mod_main = Blueprint('main', __name__)


@mod_main.route('/', methods=['GET'])
def index():

    factcheck_requests = mongo_utils.find()
    form = AdminForm()
    return render_template('mod_main/index.html', factcheck_requests=factcheck_requests, form=form)


@mod_main.route('/test', methods=['GET'])
def result():
    return render_template('mod_main/test.html')


@mod_main.route('/edit', methods=['POST'])
def edit_params():
    form = AdminForm(request.form)
    mongo_utils.flag_entry_as_inappropriate(form.data)
    return redirect(url_for('main.index'))


@mod_main.route('/entry/save', methods=['POST'])
def submit_data():
    mongo_utils.edit_entry_doc(request.json)
    return Response(status=200)
