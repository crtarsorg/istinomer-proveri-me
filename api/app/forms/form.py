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
        'Grade',
        choices=[
            ('Istina', 'Istina'),  # truthfulness
            ('Skoro istina', 'Skoro istina'),  # truthfulness
            ('Poluistina', 'Poluistina'),  # truthfulness
            ('Skoro neistina', 'Skoro neistina'),  # truthfulness
            ('Neistina', 'Neistina'),  # truthfulness
            ('Kratke noge', 'Kratke noge'),  # truthfulness
            ('Ispunjeno', 'Ispunjeno'),  # promise
            ('Skoro ispunjeno', 'Skoro ispunjeno'),  # promise
            ('Radi se na tome', 'Radi se na tome'),  # promise
            ('Krenuli pa stali', 'Krenuli pa stali'),  # promise
            ('Neispunjeno', 'Neispunjeno'),  # promise
            (u'Ni započeto', u'Ni započeto'),  # promise
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
        ("Culture", "Kultura"),
        ("Politics", "Politika"),
        ("Economy", "Ekonomija"),
        ("Healthcare", "Zdravstvo"),
        ("Society", "Drustvo"),
    ])

    check_author = BooleanField("Check Politician")
    dueness_promise = StringField('Promise dueness')
    date_of_statement = StringField('Date of statement')
    date_of_article_pub = StringField('Date of article')
    author_of_article = StringField('Author of article')
    politician = SelectField(
        "Politician",
        choices=[(x, x) for x in sorted(People().get_name_of_politician())]
    )

    politician_party = SelectField(
        "Affiliation",
        choices=[(x[0], x[1]) for x in sorted(People().list_of_politicians_with_parties(), key=lambda x: x[1])]
    )

    quote_author = StringField('Quote author')
    quote_affiliation = StringField('Affiliation')


