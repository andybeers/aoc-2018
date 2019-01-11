const readFile = require('../utils/read-data-file')

const data = readFile(process.argv[2])

const dataArray = data.split('\n')

function deriveSharedLetters(stringA, stringB) {
  let mismatchCount = 0
  let sharedLetters = ''

  for (let i = 0; i < stringA.length; i++) {
    if (stringA[i] !== stringB[i]) {
      mismatchCount++
    } else {
      sharedLetters = sharedLetters + stringA[i]
    }

    if (mismatchCount > 1) {
      break
    }
  }

  return mismatchCount !== 1 ? '' : sharedLetters
}

function findMatchingBoxes(data) {
  return data.reduce((acc, str, idx) => {
    for (let i = idx + 1; i < data.length; i++) {
      const validResult = deriveSharedLetters(str, data[i])
      if (validResult) {
        acc = deriveSharedLetters(str, data[i])
      }
    }
    return acc
  }, '')
}

console.log(findMatchingBoxes(dataArray))
