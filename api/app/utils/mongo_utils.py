class MongoUtils():

    def __init__(self, mongo):
        self.mongo = mongo
        self.collection_name = 'factchecks'

    def insert(self, doc):
        self.mongo.db[self.collection_name].insert(doc)

    def find(self, query={}):
        docs = self.mongo.db[self.collection_name].find(query)
        return docs