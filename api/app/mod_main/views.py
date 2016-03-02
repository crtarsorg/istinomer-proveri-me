from flask import Blueprint, render_template, request, redirect, url_for
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
    factcheck_requests = mongo_utils.get_last_entries()
    return render_template('mod_main/test.html', factcheck_requests=factcheck_requests)


@mod_main.route('/edit', methods=['POST'])
def edit_params():
    form = AdminForm(request.form)

    mongo_utils.update_doc(form.data)

    return redirect(url_for('main.index'))
