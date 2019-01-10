const readFile = require('../utils/read-data-file')

const data = readFile(process.argv[2])

console.log(data)
