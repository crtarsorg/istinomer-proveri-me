from flask import Blueprint, render_template, request, redirect, url_for, Response
from app import mongo_utils
from app.forms.form import AdminForm
from app.utils.people_utils import People

mod_main = Blueprint('main', __name__)


@mod_main.route('/', methods=['GET'])
def index():
    # print request.args
    # skip = 0
    # limit = 20
    # entries = mongo_utils.find(skip, limit)
    # total = mongo_utils.total_facts()
    # form = AdminForm()
    # return render_template('mod_main/index.html', factcheck_requests=entries, form=form, total = total)
    return redirect(url_for('main.show', show=20, page=0))

@mod_main.route('/show', methods=['GET'])
def show():
    show = request.args.get('show')
    page = request.args.get('page')
    if show is None or page is None:
        return redirect(url_for('main.index'))
    skip = int(show) * int(page)
    limit = int(show)
    entries = mongo_utils.find(skip, limit)
    total = mongo_utils.total_facts()
    form = AdminForm()
    return render_template('mod_main/index.html', factcheck_requests=entries, form=form, total = total, page = int(page), show = int(show), people = People().get_name_of_politician())

@mod_main.route('/feed-module', methods=['GET'])
def feed_module():
    return render_template('mod_main/feed_module.html')


# FIXME: Need to check if user is authenticated as Admin
@mod_main.route('/entry/inappropriate', methods=['POST'])
def inappropriate():
    form = AdminForm(request.form)
    mongo_utils.flag_entry_as_inappropriate(form.data)
    return redirect(url_for('main.index'))

@mod_main.route('/entry/remove/inappropriate', methods=['POST'])
def remove_inappropriate():
    form = AdminForm(request.form)
    mongo_utils.remove_inappropriate_flag_entry(form.data)
    return redirect(url_for('main.index'))


# FIXME: Need to check if user is authenticated as Admin
@mod_main.route('/entry/edit', methods=['POST'])
def edit():
    mongo_utils.edit_entry_doc(request.json)
    return Response(status=200)


@mod_main.route('/entry/delete', methods=['POST'])
def delete():
    form = AdminForm(request.form)
    mongo_utils.soft_delete_entry(form.data)
    return redirect(url_for('main.index'))
