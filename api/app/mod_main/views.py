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
    return render_template('mod_main/test.html')


@mod_main.route('/edit', methods=['POST'])
def edit_params():
    form = AdminForm(request.form)

    if form.data['inappropriate'] != "":
        mongo_utils.flag_entry_as_inappropriate(form.data)
    else:
        mongo_utils.edit_entry_doc(form.data)

    return redirect(url_for('main.index'))
