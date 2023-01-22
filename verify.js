const chalk = require('chalk')
const books = require('./js/books.json')
const osis = require('./js/osis.json')

let exitCode = 0
let totalVerseCount = 0

osis.forEach(osis => {

  const id = osis.id
  const book = books.find(b => b.id === id)
  totalVerseCount += book.verseCount
  const chapterCount = book.chapters.length
  const verseCount = book.chapters.reduce((acc, verseCount) => acc + verseCount, 0)

  if (chapterCount === 0) {
    exitCode = 1
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

if (totalVerseCount === 31103) {
  console.log(chalk.green('CHECKSUM IS CORRECT'))
} else {
  exitCode = 1
  console.error(chalk.red('CHECKSUM IS WRONG'))
}

process.exit(exitCode)
