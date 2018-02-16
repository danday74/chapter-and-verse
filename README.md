# chapter-and-verse

[![build](https://img.shields.io/travis/danday74/chapter-and-verse/master.svg?label=linux)](https://travis-ci.org/danday74/chapter-and-verse "Jesus loves you")
[![coverage](https://coveralls.io/repos/github/danday74/chapter-and-verse/badge.svg)](https://coveralls.io/github/danday74/chapter-and-verse "Jesus loves you")
[![npm](https://img.shields.io/npm/v/chapter-and-verse.svg)](https://www.npmjs.com/package/chapter-and-verse "Jesus loves you")
[![dependencies](https://david-dm.org/danday74/chapter-and-verse/status.svg)](https://david-dm.org/danday74/chapter-and-verse "Jesus loves you")
[![downloads](https://img.shields.io/npm/dm/chapter-and-verse.svg)](https://www.npmjs.com/package/chapter-and-verse "Jesus loves you")

**Given a bible reference, validates it and returns an object with book, chapter, verse and more**



<br>

## Introduction

Throw a bible reference at `chapter-and-verse` and, if valid, it returns a detailed JSON object for that reference.

If invalid, it returns a JSON object with the reason for failure.

`chapter-and-verse` understands all common bible book abbreviations and has its own built-in book identification algorithm.

It is useful when building biblical reference based URLs, for integrating with bible APIs and for validating raw user input.

`chapter-and-verse` is written by a professional developer, has 100% unit test coverage and is ready for production use.

All our biblical data has been [triple checked](#accuracy-of-biblical-data "Jesus loves you") to ensure reliability.



<br>

## Supported reference formats

`chapter-and-verse` supports all the following reference formats:

| format              	| example       	| notes                     	|
|---------------------	|---------------	|---------------------------	|
| book                	| Genesis       	|                           	|
| book chapter        	| Genesis 5     	| multi chapter books       	|
| book verse          	| Obadiah 3     	| single chapter books      	|
| book verses         	| Obadiah 3-5   	| single chapter books only 	|
| book chapter:verse  	| Genesis 5:1   	|                           	|
| book chapter:verses 	| Genesis 5:1-4 	|                           	|



<br>

## Usage

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
    "chapters": 12,
    "versesPerChapter": [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13]
  },
  "success": true,
  "reason": "matches book.id",
  "chapter": 4,
  "from": 1,
  "to": 3
}
```

To validate a reference:

```javascript 1.7
const chapterAndVerse = require('chapter-and-verse')
const ref = 'Dan 4:1-3'
let cv = chapterAndVerse(ref)
if (cv.success === true) {
  console.log(ref + ' is valid')
}
if (cv.success === false) {
  console.log(ref + ' is invalid because ' + cv.reason)
}
```

For detailed information on validation see the [Validation](#validation "Jesus loves you") section below.



<br>

## Methods

For a **valid reference** a number of methods are available.

Use `cv.toString()` and `cv.toShortString()` as follows:

```javascript 1.7
cv = chapterAndVerse('Dan 4:1-3')
cv.toString() // returns 'Daniel 4:1-3'
cv.toShortString() // returns 'Daniel 4:1-3' .. no difference because Daniel is a multi chapter book

cv = chapterAndVerse('ob 1-3')
cv.toString() // returns 'Obadiah 1:1-3'
cv.toShortString() // returns 'Obadiah 1-3' .. difference because Obadiah is a single chapter book
```

`cv.getType()` returns one of 'book', 'chapter', 'verses' or 'verse'

Finally `cv.toSimpleObject()` provides access to a flat object containing only essential data:

```javascript 1.7
cv = chapterAndVerse('exo 33:7-12')
cv.toSimpleObject()
```

Which returns:

```json
{
  "type": "verses",
  "asString": "Exodus 33:7-12",
  "asShortString": "Exodus 33:7-12",
  "bookId": "Exod",
  "bookName": "Exodus",
  "testament": "O",
  "chapter": 33,
  "from": 7,
  "to": 12
}
```



<br>

## Validation

`chapter-and-verse` returns a failure object if it cannot resolve the biblical reference:

```json
{
  "book": {},
  "success": false,
  "reason": "book does not exist"
}
```

This happens when the:

* Book does not exist / cannot be identified

* Chapter does not exist

* Verse does not exist - see [translation specifics](#translation-specifics "Jesus loves you")

* "book verses" reference format - see [supported reference formats](#supported-reference-formats "Jesus loves you") - is used in conjunction with a multi chapter book

* reference format is unrecognised - see [supported reference formats](#supported-reference-formats "Jesus loves you")

* reference is not a string

`chapter-and-verse` is **NOT** intended to recognise apocryphal books.



## Accuracy of biblical data

<br>

All our chapter and verse data has been "triple checked" as follows:

(1) The data was entered manually and manually checked.

(2) We then ran code against our data, ensuring verse and chapter totals were correct.

(3) Finally, we programmatically tested our data against other online sources to ensure "total agreement".



<br>

## Translation specifics

Certain verses only exist in certain translations. Most notably:

* 3 John 15

`chapter-and-verse` reports 3 John 15 as valid. However, this verse does not exist in the KJV where it has been merged with 3 John 14.

This is the only discrepancy with the KJV.

* Omitted verses

In modern English translation, certain New Testament verses, which exist in the KJV, have been omitted.

For example, Matthew 17:21 ESV does not exist whereas Matthew 17:21 KJV does exist.

`chapter-and-verse` treats all omitted verses as valid and is not concerned with translation specifics.

For an in-depth discussion see [omitted verses](https://en.wikipedia.org/wiki/List_of_New_Testament_verses_not_included_in_modern_English_translations "Jesus loves you")



<br>

## Author says

The Lord bless you and keep you;

the Lord make his face to shine upon you and be gracious to you;

the Lord lift up his countenance upon you and give you peace.

[Numbers 6:24-26 ESV](https://www.biblegateway.com/passage/?search=Numbers+6%3A24-26&version=ESV "Jesus loves you")



<br><br><br>
