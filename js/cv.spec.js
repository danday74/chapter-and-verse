const chai = require('chai')
const chaiSubset = require('chai-subset')
chai.use(chaiSubset)
const expect = chai.expect
const _ = require('lodash')
const chapterAndVerse = require('./cv')

let cv

describe('chapter-and-verse', () => {

  describe('type book', () => {

    const mergeBook = {
      chapter: null,
      from: null,
      to: null,
      range: null
    }

    it('matches book.id', () => {
      cv = chapterAndVerse('exod')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          reason: 'matches book.id'
        }, mergeBook))
    })

    it('matches a book.abbr', () => {
      cv = chapterAndVerse('ex')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          reason: 'matches a book.abbr'
        }, mergeBook))
    })

    it('starts with book.start', () => {
      cv = chapterAndVerse('exo')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          reason: 'starts with book.start'
        }, mergeBook))

      cv = chapterAndVerse('Exodus')
      expect(cv).to.containSubset(
        _.assign({
          book: {
            name: 'Exodus'
          },
          reason: 'starts with book.start'
        }, mergeBook))
    })

    it('fails', () => {
      cv = chapterAndVerse('Exoduss')
      expect(cv).to.be.null
    })
  })

  describe('type book-chapter-or-book-verse', () => {

    it('sets chapter for multi chapter book', () => {
      cv = chapterAndVerse('exo 40')
      expect(cv).to.containSubset({
        book: {
          name: 'Exodus'
        },
        chapter: 40,
        from: null,
        to: null,
        range: null,
        reason: 'starts with book.start'
      })
    })

    it('sets chapter and verse for single chapter book', () => {
      cv = chapterAndVerse('oba 40')
      expect(cv).to.containSubset({
        book: {
          name: 'Obadiah'
        },
        chapter: 1,
        from: 40,
        to: 40,
        range: [40],
        reason: 'starts with book.start'
      })
    })

    it('fails where chapter does not exist', () => {
      cv = chapterAndVerse('exo 41')
      expect(cv).to.be.null
    })

    it('fails where chapter is zero', () => {
      cv = chapterAndVerse('exo 0')
      expect(cv).to.be.null
    })

    it('fails where verse is zero', () => {
      cv = chapterAndVerse('oba 0')
      expect(cv).to.be.null
    })

    it('fails where verse is greater than 176', () => {
      cv = chapterAndVerse('oba 177')
      expect(cv).to.be.null
    })
  })

  describe('type book-verses', () => {

    it('sets chapter and verses for single chapter book', () => {

      cv = chapterAndVerse('oba 40-45')
      expect(cv).to.containSubset({
        book: {
          name: 'Obadiah'
        },
        chapter: 1,
        from: 40,
        to: 45,
        range: [40, 41, 42, 43, 44, 45],
        reason: 'starts with book.start'
      })
    })

    it('fails for multi chapter book', () => {
      cv = chapterAndVerse('exo 40-45')
      expect(cv).to.be.null
    })
  })

  describe('type book-chapter-verse', () => {

    it('sets chapter and verse', () => {

      cv = chapterAndVerse('exo 7:57')
      expect(cv).to.containSubset({
        book: {
          name: 'Exodus'
        },
        chapter: 7,
        from: 57,
        to: 57,
        range: [57],
        reason: 'starts with book.start'
      })
    })
  })

  describe('type book-chapter-verses', () => {

    it('sets chapter and verses', () => {

      cv = chapterAndVerse('exo 33:111-99')
      expect(cv).to.containSubset({
        book: {
          name: 'Exodus'
        },
        chapter: 33,
        from: 99,
        to: 111,
        range: [99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
        reason: 'starts with book.start'
      })
    })
  })

  describe('invalid', () => {

    it('type null fails', () => {
      cv = chapterAndVerse('exo 10a')
      expect(cv).to.be.null
    })

    it('non string arg fails', () => {
      cv = chapterAndVerse(9)
      expect(cv).to.be.null
    })
  })
})
