const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const _ = require('lodash')
const chapterAndVerse = require('./cv')
const errors = require('./errors')

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
