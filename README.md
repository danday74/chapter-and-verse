# chapter-and-verse

[![build](https://img.shields.io/travis/danday74/chapter-and-verse/master.svg?label=linux)](https://travis-ci.org/danday74/chapter-and-verse)
[![coverage](https://coveralls.io/repos/github/danday74/chapter-and-verse/badge.svg)](https://coveralls.io/github/danday74/chapter-and-verse)
[![npm](https://img.shields.io/npm/v/chapter-and-verse.svg)](https://www.npmjs.com/package/chapter-and-verse)
[![dependencies](https://david-dm.org/danday74/chapter-and-verse/status.svg)](https://david-dm.org/danday74/chapter-and-verse)
[![downloads](https://img.shields.io/npm/dm/chapter-and-verse.svg)](https://www.npmjs.com/package/chapter-and-verse)

**Given a string returns an object with the bible book, chapter and verse**



<br>

# Introduction

Throw a bible reference at `chapter-and-verse` and it will return a detailed JSON object for that reference.

`chapter-and-verse` understands all common bible book abbreviations and more.

It is particularly useful when dealing with complex bible APIs or raw user input.

`chapter-and-verse` handles all the following reference formats:

| format              	| example       	| notes                     	|
|---------------------	|---------------	|---------------------------	|
| book                	| Genesis       	|                           	|
| book chapter        	| Genesis 5     	|                           	|
| book verse          	| Obadiah 3     	| single chapter books only 	|
| book verses         	| Obadiah 3-5   	| single chapter books only 	|
| book chapter:verse  	| Genesis 5:1   	|                           	|
| book chapter:verses 	| Genesis 5:1-4 	|                           	|



<br>

# Usage

```javascript 1.7
const chapterAndVerse = require('chapter-and-verse')
let cv = chapterAndVerse('Dan 4:1-3')
```

And `cv` now looks like:

```json
{
  "book": {
    "id": "Dan",
    "name": "Daniel",
    "testament": "O",
    "start": "dan",
    "abbr": ["da", "dn"],
    "chapters": 12
  },
  "reason": "matches book.id",
  "chapter": 4,
  "from": 1,
  "to": 3,
  "range": [1, 2, 3]
}
```

You can also use `cv.toString()` and `cv.toShortString()` as follows:

```javascript 1.7
cv = chapterAndVerse('Dan 4:1-3')
cv.toString() // returns 'Daniel 4:1-3'
cv.toShortString() // returns 'Daniel 4:1-3' .. no difference because Daniel has multiple chapters

cv = chapterAndVerse('ob 1-3')
cv.toString() // returns 'Obadiah 1:1-3'
cv.toShortString() // returns 'Obadiah 1-3' .. difference because Obadiah only has a single chapter
```



<br>

# Author says

The Lord bless you and keep you;
the Lord make his face to shine upon you and be gracious to you;
the Lord lift up his countenance upon you and give you peace.

[Numbers 6:24-26 ESV](https://www.biblegateway.com/passage/?search=Numbers+6%3A24-26&version=ESV "Jesus loves you")
