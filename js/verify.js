const _ = require('lodash')
const chalk = require('chalk')
const osis = require('./osis')
const verses1 = require('./verses1')

osis.forEach(book => {
  const id = book.id
  const verse = _.find(verses1, {id})
  const chapterCount = verse.verses.length
  if (chapterCount !== book.chapters) {
    if (chapterCount === 0) {
      console.warn(chalk.yellow('chapter count is zero for ' + id))
    } else {
      console.error(chalk.red('chapter count is wrong for ' + id))
    }
  } else {
    console.log(chalk.green('chapter count is correct for ' + id))
  }
})
