const readFile = require('../utils/read-data-file')

const data = readFile(process.argv[2])

const dataArray = data.split('\n')

const finalSum = dataArray.reduce((acc, curr) => {
  acc = acc + parseInt(curr)
  return acc
}, 0)

console.log(finalSum)
