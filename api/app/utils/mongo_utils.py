import pymongo
from bson import ObjectId
from datetime import datetime


class MongoUtils():

    def __init__(self, mongo):
        self.mongo = mongo
        self.collection_name = 'entries'

    def insert(self, doc):
        self.mongo.db[self.collection_name].insert(doc)

    def get_by_classifications(self, classifications):
        query = {
            "classification": {
                "$in": classifications
            }
        }

        docs = self.mongo.db[self.collection_name]\
            .find(query)\
            .sort("timestamp", pymongo.DESCENDING)\
            .limit(20)

        return list(docs)

    def create(self):
        pass

    def edit_entry_doc(self, query=None):

        query_param = {
            "_id": ObjectId(query['doc_id'])
        }

        update_fields = {
            "mark": query['evaluation_mark'],
            'grade': query['grade'],
            'classification': query['classification'],
            'category': query['category'],
            'article': {
                'author': query['author_of_article'],
                'date': self.convert_str_to_date(query['date_of_article_pub'])
            },
            'quote': {
                'politician': query['politician'],
                'author': query['quote_author'],
                'affiliation': query['quote_author_affiliation'],
                'date': self.convert_str_to_date(query['date_of_statement'])
            }
        }

        if 'promise_due_date' in query:
            
            update_fields['promise'] = {
                'due': self.convert_str_to_date(query['promise_due_date'])
            }

        # Call the function to update fields based on query params
        self._update(query_param, update_fields)

    def flag_entry_as_inappropriate(self, query):

        query_param = {
            "_id": ObjectId(query['doc_id'])
        }

        update_fields = {
            'inappropriate': query['inappropriate']
        }

        # Call the function to update fields based on query params
        self._update(query_param, update_fields)

    def _update(self, query_param, update_fields):

        self.mongo.db[self.collection_name].update(query_param, {"$set": update_fields})

    def find(self, query={}):

        docs = self.mongo.db[self.collection_name].find(query).sort("timestamp", pymongo.DESCENDING)

        return docs

    def get(self, query=None, chrome_user_id=None):

        query_params = {}
        project = {
            "domain": True,
            "url": True,
            "text": True,
            'mark': True,
            'timestamp': {'$dateToString': {'format': "%d/%m/%Y %H:%M:%S", "date": "$timestamp"}}
        }

        if 'marks' in query:
            if query['marks']:
                query_params = {
                    "mark": {"$in": query['marks']}
                }

        if 'classifications' in query:
            query_params["classification"] = {"$in": query['classifications']}

            project['classification'] = True

            if "Promise" in query["classifications"]:

                if 'promise' in query:

                    query_params['promise'] = {}
                    if query['promise']['dueFrom'] and query['promise']['dueFrom'] != '':
                        query_params['promise.due'] = {}

                        query_params['promise.due']['$gte'] = \
                            self.convert_str_to_date(query['promise']['dueFrom'])

                        project['promise'] = {
                            "due": {'$dateToString;': {'format': "%d/%m/%Y", "date": "$promise.due"}}
                        }

                    if query['promise']['dueTo'] and query['promise']['dueTo'] != '':

                        if 'due' not in query_params['promise']:
                            query_params['promise.due'] = {}

                            project['promise'] = {
                                "due": {'$dateToString;': {'format': "%d/%m/%Y", "date": "$promise.due"}}
                            }

                        query_params['promise.due']['$gte'] = \
                            self.convert_str_to_date(query['promise']['dueTo'])

        if 'grades' in query:
            if query['grades']:
                query_params = {
                    "grade": {"$in": query['grades']}
                }
                project['grade'] = True

        if 'categories' in query:

            if query['categories']:
                query_params = {
                    "category": {"$in": query['categories']}
                }
                project['category'] = True

        if 'article' in query:

            if 'authors' in query['article']:
                if query['article']['authors']:
                    query_params['article.author'] = {"$in": query['article']['authors']}

                    project['article.author'] = True

            if 'date' in query['article']:
                if query['article']['date']:
                    query_params['article.date'] = {}

                    if query['article']['date']['from'] and query['article']['date']['from'] != '':
                        query_params['article.date']['$gte'] = self.convert_str_to_date(query['article']['date']['from'])

                    if query['article']['date']['to'] and query['article']['date']['to'] != '':
                        query_params['article.date']['$lte'] = self.convert_str_to_date(query['article']['date']['to'])

                project['article.date'] = {'$dateToString': {'format': "%d/%m/%Y", "date": "$article.date"}}
        # Build the quote query params
        if 'quote' in query:

            if 'politician' in query['quote']:
                if query['quote']['politician']:
                    query_params['quote.politician'] = query['quote']['politician']

                    project['quote.politician'] = True

            if 'author' in query['quote']:
                if query['quote']['author']:
                    query_params['quote.author'] = query['quote']['author']

                    project['quote.author'] = True

            if 'date' in query['quote']:
                if query['quote']['date']:
                    query_params['quote.date'] = {}

                    if query['quote']['date']['from'] and query['quote']['date']['from'] != '':
                        query_params['quote.date']['$gte'] = self.convert_str_to_date(query['quote']['date']['from'])

                    if query['quote']['date']['to'] and query['quote']['date']['to'] != '':
                        query_params['quote.date']['$lte'] = self.convert_str_to_date(query['quote']['date']['to'])

                    project['quote.date'] = {'$dateToString': {'format': "%d/%m/%Y", "date": "$quote.date"}}

        # Make sure we only get for given chrome user, if chrome user id is specified:
        if chrome_user_id:
            query_params['chromeUserId'] = chrome_user_id
            project['chromeUserId'] = True

        else:
            # Let's make sure we don't return entries that have been flagged as inappropriate:
            query_params['inappropriate'] = {'$exists': False}

        pipeline = [
            {"$match": query_params}
        ]

        if project:
            project_stage = {
                "$project": project
            }
            pipeline.append(project_stage)

        print pipeline
        # Execute query
        docs = self.mongo.db[self.collection_name].aggregate(pipeline)

        return docs['result']

    @staticmethod
    def convert_str_to_date(date_str):
        return datetime.strptime(date_str, "%d/%m/%Y")
