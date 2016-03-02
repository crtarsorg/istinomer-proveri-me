from pymongo import MongoClient
from flask.ext.scrypt import generate_random_salt, generate_password_hash
from bson import ObjectId

# Connect to defualt local instance of MongoClient
client = MongoClient()

# Get database and collection
db = client.istinometer

def create_user():

    db.users.remove({})

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
        "_id": ObjectId(),
        "username": str(user_name),
        "password": hashed_password,
        "salt": salt
    }

    # Now, store user credentials in MongoDB
    db.users.insert(user_doc)

    message = "\nUser %s has been created" % user_name
    print message

# Execute the function
create_user()
