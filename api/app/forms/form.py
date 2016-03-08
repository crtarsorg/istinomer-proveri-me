# coding=utf-8
from flask_wtf import Form
from wtforms import StringField, PasswordField, SelectField, HiddenField, TextAreaField


class AdminForm(Form):
    username = StringField('Username')
    password = PasswordField('Password')
    doc_id = HiddenField('Id')

    grade = StringField('Grade')
    classification = SelectField(
        'Classification',
        choices=[
            ('Promise', 'Promise'),
            ('Truthfulness', 'Truthfulness'),
            ('Consistency', 'Consistency')
        ]
    )

    evaluation_mark = SelectField(
        'Evaluation mark',
        choices=[
            ('True', 'True'),
            ('False', 'False'),
            ('Unverified', 'Unverified')
        ]
    )

    inappropriate = TextAreaField('Provide a reason')
