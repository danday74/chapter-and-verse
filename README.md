# chapter-and-verse

[![build](https://img.shields.io/travis/danday74/chapter-and-verse/master.svg?label=linux)](https://travis-ci.org/danday74/chapter-and-verse)
[![coverage](https://coveralls.io/repos/github/danday74/chapter-and-verse/badge.svg)](https://coveralls.io/github/danday74/chapter-and-verse)
[![npm](https://img.shields.io/npm/v/chapter-and-verse.svg)](https://www.npmjs.com/package/chapter-and-verse)
[![dependencies](https://david-dm.org/danday74/chapter-and-verse/status.svg)](https://david-dm.org/danday74/chapter-and-verse)
[![downloads](https://img.shields.io/npm/dm/chapter-and-verse.svg)](https://www.npmjs.com/package/chapter-and-verse)

**Given a bible reference, validates it and returns an object with book, chapter, verse and more**



<br>

## Introduction

Throw a bible reference at `chapter-and-verse` and, if the reference is valid, it returns a detailed JSON object for that reference.

If invalid, it returns a JSON object with the reason for failure.

`chapter-and-verse` understands all common bible book abbreviations and has its own built-in book identification algorithm.

It is particularly useful when formulating bible reference based URLs, for dealing with complex bible APIs / raw user input and, of course, for validation.

`chapter-and-verse` is written by a professional developer, has 100% unit test coverage and is ready for production use.



<br>

## Supported reference formats

`chapter-and-verse` handles all the following reference formats:

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
let cv = chapterAndVerse('Dan 4:1-3')
if (cv.success === true) {
  // Put your VALID reference code here
}
if (cv.success === false) {
  // Put your INVALID reference code here
}
```

For detailed information on validation see the [Validation](#validation) section below.



<br>

## Methods

For a **valid reference** a number of methods are available.

Use `cv.toString()` and `cv.toShortString()` as follows:

```javascript 1.7
cv = chapterAndVerse('Dan 4:1-3')
cv.toString() // returns 'Daniel 4:1-3'
cv.toShortString() // returns 'Daniel 4:1-3' .. no difference because Daniel has multiple chapters

cv = chapterAndVerse('ob 1-3')
cv.toString() // returns 'Obadiah 1:1-3'
cv.toShortString() // returns 'Obadiah 1-3' .. difference because Obadiah only has a single chapter
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
  "asString": "Daniel 4:1-3",
  "asShortString": "Daniel 4:1-3",
  "bookId": "Dan",
  "bookName": "Daniel",
  "testament": "O",
  "chapter": 4,
  "from": 1,
  "to": 3
}
```



<br>

## Validation

`chapter-and-verse` returns a failure object if it cannot resolve the biblical reference:

```json
{
  "success": false,
  "reason": "book does not exist"
}
```

This happens when the:

* Book does not exist / cannot be identified

* Chapter does not exist

* Verse does not exist - see [translation complexities](#translation-complexities)

* "book verses" reference format - see [supported reference formats](#supported-reference-formats) - is used in conjunction with a multi chapter book

* reference format is unrecognised - see [supported reference formats](#supported-reference-formats)

* reference is not a string

`chapter-and-verse` is **NOT** intended to recognise apocryphal books.



<br>

## Translation complexities

Certain verses only exist in certain translation. Most notably:

* KJV - 3 John 15 does not exist, it has been merged with 3 John 14

* ESV and other modern English translation - Certain New Testament verses, which exist in the KJV, have been removed

`chapter-and-verse` is not aware of translation specifics and assumes that all verses exist.

For an in-depth discussion on missing verses see [missing verses](https://en.wikipedia.org/wiki/List_of_New_Testament_verses_not_included_in_modern_English_translations)



<br>

## Author says

The Lord bless you and keep you;

the Lord make his face to shine upon you and be gracious to you;

the Lord lift up his countenance upon you and give you peace.

[Numbers 6:24-26 ESV](https://www.biblegateway.com/passage/?search=Numbers+6%3A24-26&version=ESV "Jesus loves you")



<br><br><br>
