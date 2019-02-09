const readFile = require('../utils/read-data-file')
const data = readFile(process.argv[2])
const dataArray = data.split('\n')

const timeSortedData = dataArray.sort()

function findSleepiestGuard(data) {
  let currentGuardId = ''
  let sleepStartTime = ''
  let sleepEndTime = ''

  let highestMinutesSlept = 0
  let sleepiestGuardId = ''

  data.forEach(record => {
    if (record.includes('Guard #')) {
      currentGuardId = record.match(/Guard #(\d+)/)[1]
      sleepStartTime = record.match(/\[(.*)\]/)[1]
    }
  })
}

console.log(findSleepiestGuard(timeSortedData))
