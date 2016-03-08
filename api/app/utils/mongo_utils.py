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
        docs = self.mongo.db[self.collection_name].find(query).sort("date", pymongo.DESCENDING).limit(20)

        return list(docs)

    def edit_entry_doc(self, query=None):

        query_param = {
            "_id": ObjectId(query['doc_id'])
        }

        update_fields = {
            "factChecked": query['evaluation_mark'],
            'grade': query['grade'],
            'classification': query['classification']
        }

        # Call the function to update fields based on query params
        self._update(query_param, update_fields)

    def flag_entry_as_inappropriate(self, query):

        query_param = {
            "_id": ObjectId(query['doc_id'])
        }

        update_fields = {
            "flg_inappropriate": True,
            'inappropriate_rsn': query['inappropriate']
        }

        # Call the function to update fields based on query params
        self._update(query_param, update_fields)

    def _update(self, query_param, update_fields):

        self.mongo.db[self.collection_name].update(query_param, {"$set": update_fields})

    def find(self, query={}):

        docs = self.mongo.db[self.collection_name].find(query).sort("date", pymongo.DESCENDING)

        return docs
