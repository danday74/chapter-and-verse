const _ = require('lodash')
const chalk = require('chalk')
const osis = require('./osis')
const books = require('./books1')

let exitCode = 0

osis.forEach(osis => {

  const id = osis.id
  const book = _.find(books, {id})
  const chapterCount = book.chapters.length
  if (chapterCount !== osis.chapters) {
    if (chapterCount === 0) {
      console.warn(chalk.yellow('chapter count is zero for ' + id))
    } else {
      console.error(chalk.red('chapter count is wrong for ' + id))
      exitCode = 1
    }
  } else {
    console.log(chalk.green('chapter count is correct for ' + id))
  }
})

process.exit(exitCode)
