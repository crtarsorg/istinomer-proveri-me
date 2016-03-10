

class MongoUsersUtils:

    def __init__(self, mongo):
        self.mongo = mongo
        self.collection_name = "users"

    def save(self, user):
        return self.mongo.db[self.collection_name].insert(user)
