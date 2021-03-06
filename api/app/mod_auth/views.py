# -*- coding: utf-8 -*-
from flask import Blueprint, request, redirect, current_app, session, url_for
from flask.ext.scrypt import check_password_hash
from app.forms.form import AdminForm
from app import mongo

mod_auth = Blueprint('admin', __name__, url_prefix='/auth')


@mod_auth.route('/login', methods=['POST'])
def login():
    error = None
    form = AdminForm(request.form)

    username = form.username.data
    password = form.password.data
    user_doc = mongo.db.users.find_one({"username": username})

    if user_doc is None:
        error = "Korisnik ne postoji"
    elif password == "" or not check_password_hash(password, user_doc["password"], user_doc["salt"]):
        error = "Pogrešna lozinka"

    else:
        session['logged_in'] = True
        session['username'] = username
        current_app.logger.info('User %s is logged in' % username)

    return redirect(url_for('main.index'))


@mod_auth.route('/logout', methods=['GET'])
def logout():
    if 'logged_in' in session and session['logged_in'] is True:
        session.pop('logged_in', None)

        username = session['username']
        session.pop('username', None)

        current_app.logger.info('user %s is logged out' % username)

        return redirect(url_for('main.index'))

    else:
        return redirect(url_for('main.index'))
