# Istinomer Fact Checker

Project Description

A chrome extension to have the people over at istinomer.rs fact check text that has been highlighted on a website

Technical Instructions

    Linux Distribution Example: Ubuntu 18.04 LTS t
    MongoDB 3.2.x
    Python 2.X

Initial Setup
# 2. Local Installation (UBUNTU)

First create a folder in your desktop called dev:

    $ cd ~
    $ mkdir dev
    $ cd dev

## Getting the project in your local machine:

    $ git clone https://github.com/crtarsorg/istinomer-proveri-me.git

    $ cd istinomer-proveri-me

create a config.cfg inside api directory and paste the contents of config-template.cfg to the new file that you created

    $ cd api 
    $ touch config.cfg 
    $ cat config-template.cfg > config.cfg 

open the config.cfg file and pass the following arguments to it 

[Application]
#put any port that you wish which is not in use example 8000
SERVER_PORT = 8000

#put any string that you wish as a secret key, example: 'mySecretKey'
SECRET_KEY = 'mySecretKey'

[Mongo]

DB_NAME = 'Mongodb'

[Logging]
#this will create a directory named log and a logfile errors.log in the app directory 
PATH = /logs/errors.log 
LEVEL = ERROR 


    $ bash install.sh 

(this script will check whether your system consists python 2.x, if it does (if it does not, it will install python 2.7.3) then it will create a virtualenvironment with python2.7.x and inside that virtualenvironment it will install the python dependecies that are required to setup the app)

# Install the requirements and run the app:

    $ bash install.sh
    $ bash run-debug.sh


Note: In oder to test the installed extension you need to install POSTMAN in your system and make the POST request through it


- install POSTMAN API https://www.getpostman.com/downloads/
- make a POST request adding the url in which the server is running in your local system example: http://0.0.0.0:8000/api/entry/submit
- At the body select JSON file application and paste the following JSON payload


## Save Entry
### POST  /api/entry/save
#### Sample JSON Payload - Truthfulness
```json 
{
  "domain": "washingtonpost.com",
  "url": "https://www.washingtonpost.com/opinions/nixon-both-lofty-and-criminal/2015/07/24/5e3ee074-2b1a-11e5-bd33-395c05608059_story.html",
  "text": "I ordered that they use any means necessary, including illegal means, to accomplish this goal.... The president of the United States can never admit that.",
  "chrome_user_id": "xzy",
  "classification": "Truthfulness",
  "grade": "True",
  "category": "Politics",
  "article": {
    "author": "Carl Bernstein",
    "date": "24/07/2015"
  },
  "quote": {
    "author": "Richard Nixon",
    "politician": true,
    "date": "01/01/1973"
  }
}
```

#### Sample JSON Payload - Promise
```json 
{
  "classification": "Promise",
  "grade": "Fulfilled",
  "category": "Politics",
  "article": {
    "author": "Carl Bernstein",
    "date": "18/04/1973"
  },
  "quote": {
    "author": "Richard Nixon",
    "politician": true,
    "date": "17/04/1973"
  },
  "promise": {
    "due": "01/05/1973"
  }
}
``` 

#### Parameter Options
##### classification 
 - Backlog (Backlog)
 - Consistency (Doslednost)
 - Notepad (Beležnica)
 - Promise (Obecanja)
 - Truthfulness (Istinitost)


##### grade 
###### Truthfulness (Istinitost)
 - False (Neistina)
 - Half true (Poluistina)
 - Mostly false (Skoro neistina)
 - Mostly true (Skoro istina)
 - Pants on fire (Kratke noge)
 - True (Istina)

###### Promise (Obecanja)

 - Almost fulfilled (Skoro ispunjeno)
 - Fulfilled (Ispunjeno)
 - In progress (Radi se na tome)
 - Not started (Ni započeto)
 - Stalled (Krenuli pa stali)
 - Unfulfilled (Neispunjeno)

###### Consistency (Doslednost)
 - Consistent (Dosledno)
 - Inconsistent (Nedosledno) 
 - In between (Nešto između)

##### category 
 - Culture (Kultura)
 - Politics (Politika)
 - Economy (Ekonomija)
 - Healthcare (Zdravstvo)
 - Society (Drustvo)


## Fetch Entries
### POST  /api/entry/get
#### JSON Payload - Filter Parameters 

| Property          | Data Type     | Description                                                   |
|-------------------|---------------|---------------------------------------------------------------|
| classifications   | List\<String\>| The classifications.                                          |
| grades            | List\<String\>| The grades.                                                   |
| categories        | List\<String\>| The categories.                                               |
| article.authors   | List\<String\>| The article authors.                                          |
| article.from      | Date          | The publication _from_ date.                                  |
| article.to        | Date          | The publication _to_ date.                                    |
| quote.authors     | List\<String\>| The quote authors.                                            |
| quote.politician  | Boolean       | Indication whether the quote author is a politician or not.   |
| quote.affiliations| List\<String\>| The quote authors' affiliations.                              |
| quote.from        | Date          | The quote _from_ date.                                        |
| quote.to          | Date          | The quote _to_ date.                                          |
| promise.dueFrom   | Date          | The promise _due from_ date.                                  |
| promise.dueTo     | Date          | The promise _due to_ date.                                    |


#### Sample JSON Payload
```json 
{
  "classifications": ["Truthfulness", "Promise", "Consistency"],
  "grades": ["Mostly true", "Fulfilled", "Consistent"],
  "categories": ["Politics"],
  "article": {
    "authors": ["Carl Bernstein", "Bob Woodward"],
    "date": {
      "from": "01/06/1972",
      "to": "01/01/1975"
    }
  },
  "quote": {
    "author": "Richard Nixon",
    "politician": true,
    "date": {
      "from": "01/06/1972",
      "to": "01/01/1975"
    }
  }
}
``` 

**Note:** Can only apply _promise.dueFrom_ and _promise.dueTo_ filters when classification only contains _"Promise"_ (i.e. `"classifications": ["Promise"]`.
