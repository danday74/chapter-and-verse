const _ = require('lodash')
const chalk = require('chalk')
const osis = require('./js/osis')
const books = require('./js/books1')

let exitCode = 0
let totalVerseCount = 0

osis.forEach(osis => {

  const id = osis.id
  const book = _.find(books, {id})
  totalVerseCount += book.verseCount
  const chapterCount = book.chapters.length

  if (chapterCount === 0) {
    console.warn(chalk.yellow('skipping ' + id))
  } else {

    if (chapterCount === osis.chapters) {
      console.log(chalk.green('chapter count is correct for ' + id))
    } else {
      console.error(chalk.red('chapter count is wrong for ' + id))
      exitCode = 1
    }
  }
})

if (totalVerseCount === 31102) {
  console.log(chalk.green('TOTAL VERSE COUNT IS CORRECT'))
} else {
  console.error(chalk.red('TOTAL VERSE COUNT IS WRONG'))
  exitCode = 1
}

process.exit(exitCode)
