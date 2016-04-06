from flask import Blueprint, render_template, request, redirect, url_for, Response
from app import mongo_utils
from app.forms.form import AdminForm

mod_main = Blueprint('main', __name__)


@mod_main.route('/', methods=['GET'])
def index():
    entries = mongo_utils.find()
    form = AdminForm()
    return render_template('mod_main/index.html', factcheck_requests=entries, form=form)

@mod_main.route('/feed-module', methods=['GET'])
def feed_module():
    return render_template('mod_main/feed_module.html')


#FIXME: Need to check if user is authenticated as Admin
@mod_main.route('/entry/inappropriate', methods=['POST'])
def inappropriate():
    form = AdminForm(request.form)
    mongo_utils.flag_entry_as_inappropriate(form.data)
    return redirect(url_for('main.index'))


#FIXME: Need to check if user is authenticated as Admin
@mod_main.route('/entry/edit', methods=['POST'])
def edit():
    mongo_utils.edit_entry_doc(request.json)
    return Response(status=200)



@mod_main.route('/entry/delete', methods=['POST'])
def delete():
    form = AdminForm(request.form)
    mongo_utils.soft_delete_entry(form.data)
    return redirect(url_for('main.index'))
