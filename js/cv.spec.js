const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const _ = require('lodash')
const chapterAndVerse = require('./cv')
const errors = require('./errors')

const FIRST = {
  BOOK: 'gen',
  CHAPTER: 'gen 1',
  VERSE: 'gen 1:1',
  VERSES: 'gen 1:1-4'
}
const LAST = {
  BOOK: 'rev',
  CHAPTER: 'rev 22',
  VERSE: 'rev 22:21',
  VERSES: 'rev 22:18-21'
}
const SUMS = {
  BOOK: 66,
  CHAPTER: 1189,
  VERSE: 31103,
  VERSES: 31100
}

let cv

describe('chapter-and-verse', () => {

  describe('format book', () => {

    const mergeBook = {
      chapter: null,
      from: null,
      to: null
    }

    it('matches book.id', () => {
      cv = chapterAndVerse('exod')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          success: true,
          reason: 'matches book.id'
        }, mergeBook))
      expect(cv.toString()).to.equal('Exodus')
      expect(cv.toShortString()).to.equal('Exodus')
      expect(cv.getType()).to.equal('book')
    })

    it('matches a book.abbr', () => {
      cv = chapterAndVerse('ex')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          success: true,
          reason: 'matches a book.abbr'
        }, mergeBook))
      expect(cv.toString()).to.equal('Exodus')
      expect(cv.toShortString()).to.equal('Exodus')
      expect(cv.getType()).to.equal('book')
    })

    it('starts with book.start', () => {
      cv = chapterAndVerse('exo')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          success: true,
          reason: 'starts with book.start'
        }, mergeBook))
      expect(cv.toString()).to.equal('Exodus')
      expect(cv.toShortString()).to.equal('Exodus')
      expect(cv.getType()).to.equal('book')

      cv = chapterAndVerse('Obadiah')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Obadiah'
          },
          success: true,
          reason: 'starts with book.start'
        }, mergeBook))
      expect(cv.toString()).to.equal('Obadiah')
      expect(cv.toShortString()).to.equal('Obadiah')
      expect(cv.getType()).to.equal('book')
    })

    it('starts with returns failure where str is too long', () => {
      cv = chapterAndVerse('1 Chronicless')
      expect(cv).to.eql(errors.book)
    })
  })

  describe('format book-chapter-or-book-verse', () => {

    it('sets chapter for multi chapter book', () => {
      cv = chapterAndVerse('exo 40')
      expect(cv).to.containSubset({
        book: {
          name: 'Exodus'
        },
        success: true,
        reason: 'starts with book.start',
        chapter: 40,
        from: null,
        to: null
      })
      expect(cv.toString()).to.equal('Exodus 40')
      expect(cv.toShortString()).to.equal('Exodus 40')
      expect(cv.getType()).to.equal('chapter')
    })

    it('sets chapter and verse for single chapter book', () => {
      cv = chapterAndVerse('oba 21')
      expect(cv).to.containSubset({
        book: {
          name: 'Obadiah'
        },
        success: true,
        reason: 'starts with book.start',
        chapter: 1,
        from: 21,
        to: 21
      })
      expect(cv.toString()).to.equal('Obadiah 1:21')
      expect(cv.toShortString()).to.equal('Obadiah 21')
      expect(cv.getType()).to.equal('verse')
    })

    it('returns failure where chapter is zero', () => {
      cv = chapterAndVerse('exo 0')
      expect(cv).to.eql(errors.chapter)
    })

    it('returns failure where chapter does not exist', () => {
      cv = chapterAndVerse('exo 41')
      expect(cv).to.eql(errors.chapter)
    })

    it('returns failure where verse is zero', () => {
      cv = chapterAndVerse('oba 0')
      expect(cv).to.eql(errors.verse)
    })

    it('returns failure where verse does not exist', () => {
      cv = chapterAndVerse('oba 22')
      expect(cv).to.eql(errors.verse)
    })
  })

  describe('format book-verses', () => {

    it('sets chapter and verses for single chapter book', () => {
      cv = chapterAndVerse('oba 1-5')
      expect(cv).to.containSubset({
        book: {
          name: 'Obadiah'
        },
        success: true,
        reason: 'starts with book.start',
        chapter: 1,
        from: 1,
        to: 5
      })
      expect(cv.toString()).to.equal('Obadiah 1:1-5')
      expect(cv.toShortString()).to.equal('Obadiah 1-5')
      expect(cv.getType()).to.equal('verses')
    })

    it('returns failure for multi chapter book', () => {
      cv = chapterAndVerse('exo 5-7')
      expect(cv).to.eql(errors.bookVersesFormat)
    })
  })

  describe('format book-chapter-verse', () => {

    it('sets chapter and verse', () => {
      cv = chapterAndVerse('exo 7:25')
      expect(cv).to.containSubset({
        book: {
          name: 'Exodus'
        },
        success: true,
        reason: 'starts with book.start',
        chapter: 7,
        from: 25,
        to: 25
      })
      expect(cv.toString()).to.equal('Exodus 7:25')
      expect(cv.toShortString()).to.equal('Exodus 7:25')
      expect(cv.getType()).to.equal('verse')
    })

    it('returns failure where chapter does not exist', () => {
      cv = chapterAndVerse('exo 41:57')
      expect(cv).to.eql(errors.chapter)
    })
  })

  describe('format book-chapter-verses', () => {

    it('sets chapter and verses', () => {
      cv = chapterAndVerse('exo 33:23-20')
      expect(cv).to.containSubset({
        book: {
          name: 'Exodus'
        },
        success: true,
        reason: 'starts with book.start',
        chapter: 33,
        from: 20,
        to: 23
      })
      expect(cv.toString()).to.equal('Exodus 33:20-23')
      expect(cv.toShortString()).to.equal('Exodus 33:20-23')
      expect(cv.getType()).to.equal('verses')
    })
  })

  describe('toSimpleObject', () => {

    it('toSimpleObject', () => {
      cv = chapterAndVerse('exo 33:7-12')
      expect(cv).to.containSubset({
        book: {id: 'Exod', name: 'Exodus', testament: 'O', start: 'exo', abbr: ['ex'], chapters: 40},
        success: true,
        reason: 'starts with book.start',
        chapter: 33,
        from: 7,
        to: 12
      })
      expect(cv.toSimpleObject()).to.eql({
        type: 'verses',
        asString: 'Exodus 33:7-12',
        asShortString: 'Exodus 33:7-12',
        bookId: 'Exod',
        bookName: 'Exodus',
        testament: 'O',
        chapter: 33,
        from: 7,
        to: 12
      })
    })
  })

  describe('next', () => {

    it('book', () => {
      let bookCount = 0
      cv = chapterAndVerse(FIRST.BOOK)
      while (cv.success) {
        bookCount++
        cv = cv.next()
      }
      expect(bookCount).to.equal(SUMS.BOOK)
    })

    it('chapter', () => {
      let chapterCount = 0
      cv = chapterAndVerse(FIRST.CHAPTER)
      while (cv.success) {
        chapterCount++
        cv = cv.next()
      }
      expect(chapterCount).to.equal(SUMS.CHAPTER)
    })

    it('verse', () => {
      let verseCount = 0
      cv = chapterAndVerse(FIRST.VERSE)
      while (cv.success) {
        verseCount++
        cv = cv.next()
      }
      expect(verseCount).to.equal(SUMS.VERSE)
    })

    it('multiple verses', () => {
      let verseCount = 0
      cv = chapterAndVerse(FIRST.VERSES)
      while (cv.success) {
        verseCount++
        cv = cv.next()
      }
      expect(verseCount).to.equal(SUMS.VERSES)
    })

    it('reversal', () => {
      cv = chapterAndVerse(FIRST.VERSE)
      const cvReversal = cv.next().prev()
      delete cv.reason
      delete cvReversal.reason
      expect(cv).to.eql(cvReversal)
    })
  })

  describe('prev', () => {

    it('book', () => {
      let bookCount = 0
      cv = chapterAndVerse(LAST.BOOK)
      while (cv.success) {
        bookCount++
        cv = cv.prev()
      }
      expect(bookCount).to.equal(SUMS.BOOK)
    })

    it('chapter', () => {
      let chapterCount = 0
      cv = chapterAndVerse(LAST.CHAPTER)
      while (cv.success) {
        chapterCount++
        cv = cv.prev()
      }
      expect(chapterCount).to.equal(SUMS.CHAPTER)
    })

    it('verse', () => {
      let verseCount = 0
      cv = chapterAndVerse(LAST.VERSE)
      while (cv.success) {
        verseCount++
        cv = cv.prev()
      }
      expect(verseCount).to.equal(SUMS.VERSE)
    })

    it('multiple verses', () => {
      let verseCount = 0
      cv = chapterAndVerse(LAST.VERSES)
      while (cv.success) {
        verseCount++
        cv = cv.prev()
      }
      expect(verseCount).to.equal(SUMS.VERSES)
    })

    it('reversal', () => {
      cv = chapterAndVerse(LAST.VERSE)
      const cvReversal = cv.prev().next()
      delete cv.reason
      delete cvReversal.reason
      expect(cv).to.eql(cvReversal)
    })
  })

  describe('failure', () => {

    it('returns failure where no format applies', () => {
      cv = chapterAndVerse('exo 10a')
      expect(cv).to.equal(errors.format)
    })

    it('returns failure where non string arg given', () => {
      cv = chapterAndVerse(9)
      expect(cv).to.equal(errors.type)
    })

    it('returns failure where no arg given', () => {
      cv = chapterAndVerse()
      expect(cv).to.equal(errors.format)
    })

    it('returns failure where next book does not exist', () => {
      cv = chapterAndVerse(LAST.BOOK)
      expect(cv.next()).to.equal(errors.nextBook)
    })

    it('returns failure where next chapter does not exist', () => {
      cv = chapterAndVerse(LAST.CHAPTER)
      expect(cv.next()).to.equal(errors.nextChapter)
    })

    it('returns failure where next verse does not exist', () => {
      cv = chapterAndVerse(LAST.VERSE)
      expect(cv.next()).to.equal(errors.nextVerse)
    })

    it('returns failure where previous book does not exist', () => {
      cv = chapterAndVerse(FIRST.BOOK)
      expect(cv.prev()).to.equal(errors.prevBook)
    })

    it('returns failure where previous chapter does not exist', () => {
      cv = chapterAndVerse(FIRST.CHAPTER)
      expect(cv.prev()).to.equal(errors.prevChapter)
    })

    it('returns failure where previous verse does not exist', () => {
      cv = chapterAndVerse(FIRST.VERSE)
      expect(cv.prev()).to.equal(errors.prevVerse)
    })

    it('throws when toString is called', () => {
      cv = chapterAndVerse(9)
      expect(() => {
        cv.toString()
      }).to.throw(/toString.+the reference is not a string/)
    })

    it('throws when toShortString is called', () => {
      cv = chapterAndVerse(9)
      expect(() => {
        cv.toShortString()
      }).to.throw(/toShortString.+the reference is not a string/)
    })

    it('throws when getType is called', () => {
      cv = chapterAndVerse(9)
      expect(() => {
        cv.getType()
      }).to.throw(/getType.+the reference is not a string/)
    })

    it('throws when toSimpleObject is called', () => {
      cv = chapterAndVerse(9)
      expect(() => {
        cv.toSimpleObject()
      }).to.throw(/toSimpleObject.+the reference is not a string/)
    })

    it('throws when next is called', () => {
      cv = chapterAndVerse(9)
      expect(() => {
        cv.next()
      }).to.throw(/next.+the reference is not a string/)
    })

    it('throws when prev is called', () => {
      cv = chapterAndVerse(9)
      expect(() => {
        cv.prev()
      }).to.throw(/prev.+the reference is not a string/)
    })
  })

  describe('example', () => {

    it('example', () => {
      const chapterAndVerse = require('../index')
      let cv

      cv = chapterAndVerse('Dan 4:1-3')
      expect(cv.toString()).to.equal('Daniel 4:1-3')
      expect(cv.toShortString()).to.equal('Daniel 4:1-3')
      expect(cv.getType()).to.equal('verses')

      cv = chapterAndVerse('ob 1-3')
      expect(cv.toString()).to.equal('Obadiah 1:1-3')
      expect(cv.toShortString()).to.equal('Obadiah 1-3')
      expect(cv.getType()).to.equal('verses')
    })
  })
})
