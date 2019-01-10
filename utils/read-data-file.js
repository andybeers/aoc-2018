const fs = require('fs')

function readFile(fileName) {
  return fs.readFileSync(fileName, 'utf8')
}

module.exports = readFile
