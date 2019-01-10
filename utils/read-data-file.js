module.exports = fileName => {
  const fs = require('fs')
  return fs.readFileSync(fileName, 'utf8')
}
