# istinomer-factcheckr
A chrome extension to have the people over at istinomer.rs fact check highlighted text on a website.


## Fetch Entries
##### JSON Payload - Filter Parameters 

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

