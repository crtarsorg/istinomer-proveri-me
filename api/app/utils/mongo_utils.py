import pymongo
from bson import ObjectId


class MongoUtils():

    def __init__(self, mongo):
        self.mongo = mongo
        self.collection_name = 'factchecks'

    def insert(self, doc):
        self.mongo.db[self.collection_name].insert(doc)

    def get_entries_for_classifications(self, classifications):
        query = {
            "classification": {
                "$in": classifications
            }
        }
        docs = self.mongo.db[self.collection_name].find(query).sort("date", pymongo.DESCENDING)

        return list(docs)

    def get_last_entries(self):
        query = {
            "classification": {
                "$in": ['Promise', 'Truthfulness', 'Consistency']
            }
        }
        docs = self.mongo.db[self.collection_name].find(query).limit(20)

        return docs

    def update_doc(self, query=None):

        self.mongo.db[self.collection_name].update(
                {
                    "_id": ObjectId(query['doc_id'])
                },
                {
                    "$set": {
                        "factChecked": query['evaluation_mark'],
                        'grade': query['grade'],
                        'classification': query['classification']
                    }
                }
        )

    def find(self, query={}):

        docs = self.mongo.db[self.collection_name].find(query)

        return docs
