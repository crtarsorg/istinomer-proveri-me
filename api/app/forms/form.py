# coding=utf-8
from flask_wtf import Form
from wtforms import StringField, PasswordField, SelectField, HiddenField, TextAreaField, BooleanField
from app.utils.people_utils import People


class AdminForm(Form):
    username = StringField(u'Korisničko ime')
    password = PasswordField(u'Šifra')
    doc_id = HiddenField('Id')

    inappropriate = TextAreaField('Navedite razlog')
    classification = SelectField(
        'Tip izjave',
        choices=[
            ('Backlog', 'Backlog'),
            ('Notepad', 'Notepad'),
            ('Promise', 'Promise'),
            ('Truthfulness', 'Truthfulness'),
            ('Consistency', 'Consistency'),
        ]
    )

    grade = SelectField(
        'Ocena',
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

    category = SelectField('Category', choices=[
        ("Culture", "Kultura"),
        ("Politics", "Politika"),
        ("Economy", "Ekonomija"),
        ("Healthcare", "Zdravstvo"),
        ("Society", "Drustvo"),
    ])

    check_author = BooleanField(u"Izaberite ukoliko je u pitanju izjava javnog funkcionera.")
    dueness_promise = StringField(u'Rok kada ističe obećanje')
    date_of_statement = StringField('Datum izjave')
    date_of_article_pub = StringField('Datum ocene')
    author_of_article = StringField('Autor ocene')
    politician = SelectField(
        "Javni funkcioner",
        choices=[(x, x) for x in sorted(People().get_name_of_politician())]
    )

    politician_party = SelectField(
        "Pripadnost",
        choices=[(x[0], x[1]) for x in sorted(People().list_of_politicians_with_parties(), key=lambda x: x[1])]
    )

    quote_author = StringField('Citirajte autora')
    quote_affiliation = StringField('Pripadnost')


