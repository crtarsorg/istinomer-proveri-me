# Istinomer Fact Checker
A chrome extension to have the people over at istinomer.rs fact check text that has been highlighted on a website.


## Save Entry
### POST  /api/entry/save
#### Sample JSON Payload
```json 
{
  "classification": "Consistency",
  "grade": "XXX",
  "mark": "True",
  "category": "Politics",
  "article": {
    "author": "Carl Bernstein",
    "date": "17/01/2016"
  },
  "quote": {
    "author": "Richard Nixon",
    "politician": True,
    "date": "16/01/2016"
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
 - Unverified
 - True
 - False

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
| classifications   | List\<String\>| The classifications.                                          |
| grades            | List\<String\>| The grades.                                                   |
| marks             | List\<String\>| The evaluation marks.                                         |
| categories        | List\<String\>| The categories.                                               |
| article.authors   | List\<String\>| The article authors.                                          |
| article.from      | Date          | The publication _from date_.                                  |
| article.to        | Date          | The publication _to date_.                                    |
| quote.authors     | List\<String\>| The quote authors.                                            |
| quote.politician  | Boolean       | Indication whether the quote author is a politician or not.   |
| quote.affiliations| List\<String\>| The quote authors' affiliations.                              |
| quote.from        | Date          | The quote _from date_.                                        |
| quote.to          | Date          | The quote _to date_.                                          |


#### Sample JSON Payload
```json 
{
  "classifications": ["Truthfulness", Promise", "Consistency"],
  "grades": "",
  "marks": [True],
  "categories": ["Politics"],
  "article": {
    "authors": ["Carl Bernstein", "Bob Woodward"]
    "date": {
      "from: "01/06/1972",
      "to": "01/01/1975"
    }
  },
  "quote": {
    "author": "Richard Nixon",
    "politician": True,
    "date": {
      "from: "01/06/1972",
      "to": "01/01/1975"
    }
  }
}
``` 
