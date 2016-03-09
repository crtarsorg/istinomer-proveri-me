# Istinomer Fact Checker
A chrome extension to have the people over at istinomer.rs fact check text that has been highlighted on a website.


## Save Entry
### POST  /api/entry/save
#### Sample JSON Payload - Consistency
```json 
{
  "mark": true,
  "classification": "Consistency",
  "grade": "XXX",
  "category": "Politics",
  "article": {
    "author": "Carl Bernstein",
    "date": "17/01/2016"
  },
  "quote": {
    "author": "Richard Nixon",
    "politician": true,
    "date": "16/01/2016"
  }
}
```

#### Sample JSON Payload - Promise
```json 
{
  "mark": true,
  "classification": "Promise",
  "grade": "XXX",
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
 - TTTT
 - TTTT
 - TTTT
 - TTTT

###### Promise
 - PPPP
 - PPPP
 - PPPP
 - PPPP
 
###### Consistency
 - CCCC
 - CCCC
 - CCCC
 - CCCC
 
##### mark 
 - Unverified (String)
 - true (Boolean)
 - false (Boolean)

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
|-------------------|---------------|---------------------------------------------------------------|
| marks             | List\<String\>| The evaluation marks.                                         |
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
  "marks": [true],
  "classifications": ["Truthfulness", "Promise", "Consistency"],
  "grades": "",
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
