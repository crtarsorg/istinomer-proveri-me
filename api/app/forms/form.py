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
            ('Notepad', u'Beležnica'),
            ('Promise', 'Obecanja'),
            ('Truthfulness', 'Istinitost'),
            ('Consistency', 'Doslednost'),
        ]
    )

    grade = SelectField(
        'Ocena',
        choices=[
            ('True', 'Istina'),  # truthfulness
            ('Mostly true', 'Skoro istina'),  # truthfulness
            ('Half true', 'Poluistina'),  # truthfulness
            ('Mostly false', 'Skoro neistina'),  # truthfulness
            ('False', 'Neistina'),  # truthfulness
            ('Pants on fire', 'Kratke noge'),  # truthfulness
            ('Fulfilled', 'Ispunjeno'),  # promise
            ('Almost fulfilled', 'Skoro ispunjeno'),  # promise
            ('In progress', 'Radi se na tome'),  # promise
            ('Stalled', 'Krenuli pa stali'),  # promise
            ('Unfulfilled', 'Neispunjeno'),  # promise
            ('Not started', u'Ni započeto'),  # promise
            ('Consistent', 'Dosledno'),  # consistency
            ('In between', 'Nedosledno'),  # consistency
            ('Inconsistent', u'Nešto između')  # consistency
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


