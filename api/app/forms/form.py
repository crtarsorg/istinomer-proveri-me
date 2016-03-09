# coding=utf-8
from flask_wtf import Form
from wtforms import StringField, PasswordField, SelectField, HiddenField, TextAreaField, BooleanField
from app.utils.people_utils import People


class AdminForm(Form):
    username = StringField('Username')
    password = PasswordField('Password')
    doc_id = HiddenField('Id')

    inappropriate = TextAreaField('Provide a reason')
    classification = SelectField(
        'Classification',
        choices=[
            ('Notepad', 'Notepad'),
            ('Promise', 'Promise'),
            ('Truthfulness', 'Truthfulness'),
            ('Consistency', 'Consistency'),
        ]
    )

    grade = SelectField(
        'Truthful grade',
        choices=[
            ('Istina', 'Istina'),  # truthfulness
            ('Skoro istina', 'Skoro istina'),  # truthfulness
            ('Poluistina', 'Poluistina'),  # truthfulness
            ('Skoro neistina', 'Skoro neistina'),  # truthfulness
            ('Neistina', 'Neistina'),  # truthfulness
            ('Kratke noge', 'Kratke noge'),  # truthfulness

            ('Dosledno', 'Dosledno'),  # consistency
            ('Nedosledno', 'Nedosledno'),  # consistency
            (u'Nešto između', u'Nešto između')  # consistency
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

    category = SelectField('Category', choices=[
        ("Culture", "Culture"),
        ("Politics", "Politics"),
        ("Economy", "Economy"),
        ("Healthcare", "Healthcare"),
        ("Society", "Society"),
    ])

    check_author = BooleanField("Check Politician")
    dueness_promise = StringField('Promise dueness')
    date_of_statement = StringField('Date of statement')
    date_of_article_pub = StringField('Date of article')
    author_of_article = StringField('Author of article')
    politician = SelectField("Politician", choices=[(x, x) for x in People().get_name_of_politician()])
    politician_party = SelectField("Affiliated Party", choices=[(x[0], x[1]) for x in People().list_of_politicians_with_parties()])

    quote_author = StringField('Quote author')
    quote_affiliation = StringField('Quote affiliation')


