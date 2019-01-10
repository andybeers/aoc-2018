const readFile = require('../utils/read-data-file')

const data = readFile(process.argv[2])

const dataArray = data.split('\n')

function findFirstRepeatFrequency(dataArr) {
  const frequencyMap = {}
  let repeatFrequency
  let sum = 0

  function searchLoop() {
    for (i = 0; i < dataArr.length; i++) {
      const val = parseInt(dataArr[i])
      sum = sum + val

      if (frequencyMap[sum]) {
        repeatFrequency = sum
        break
      } else {
        frequencyMap[sum] = true
      }
    }
  }

  searchLoop()

  while (!repeatFrequency) {
    searchLoop()
  }

  return repeatFrequency
}

console.log(findFirstRepeatFrequency(dataArray))
