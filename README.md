# Istinomer Fact Checker
A chrome extension to have the people over at istinomer.rs fact check text that has been highlighted on a website.


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
  "grade": "Istina",
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
  "grade": "Krenuli pas stali",
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
 - Truthfulness
 - Promise
 - Consistency

##### grade 
###### Truthfulness
 - Istina
 - Kratke noge
 - Neistina
 - Poluistina
 - Skoro istina
 - Skoro neistina

###### Promise
 - Ispunjeno
 - Krenuli pas stali
 - Neispunjeno
 - Ni započeto
 - Radi se na tome
 - Skoro ispunjeno
 
###### Consistency
 - Dosledno
 - Nedosledno
 - Nešto između


##### category 
 - Culture
 - Politics
 - Economy
 - Healthcare
 - Society

 
## Fetch Entries
### POST  /api/entry/get
#### JSON Payload - Filter Parameters 

| Property          | Data Type     | Description                                                   |
|-------------------|---------------|---------------------------------------------------------------|                        |
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
  "grades": ["Istina", "Ispunjeno", "Dosledno"],
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
