from flask.ext.scrypt import generate_random_salt, generate_password_hash
from app import create_app, mongo_users_utils

app = create_app()

def create_user():

    # Enter user name
    user_name = raw_input("Enter a username: ")
    while user_name == '':
        user_name = raw_input("Username can't be empty: ")

    # Enter password
    password = raw_input("Enter a password: ")
    while password == '':
        password = raw_input("Password can't be empty: ")

    # generate salt that will flavour the hash
    salt = generate_random_salt()
    # generate password hash together with the salt value
    hashed_password = generate_password_hash(str(password), salt)

    # Build user document
    user_doc = {
        "username": str(user_name),
        "password": hashed_password,
        "salt": salt
    }

    # Now, store user credentials in MongoDB
    with app.app_context():

        try:
            result = mongo_users_utils.save(user_doc)
            if result:
                print "\nUser %s has been created" % user_name
            else:
                print "\nAn error has occurred."

        except Exception as e:
            print "\nAn error occurred.\n %s" % e


# Execute the function
create_user()
