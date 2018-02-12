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
  const verseCount = _.sum(book.chapters)

  if (chapterCount === 0) {
    console.warn(chalk.yellow(id + '\t SKIPPING'))
  } else {

    let failures = ''
    if (chapterCount !== osis.chapters) failures += ' - chapter count'
    if (verseCount !== book.verseCount) failures += ' - verse count'

    if (failures.length === 0) {
      console.log(chalk.green(id + '\t PASSED'))
    } else {
      exitCode = 1
      console.error(chalk.red(id + '\t FAILED FOR' + failures))
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
