const fs = require('fs')

const data = fs.readFileSync('andyData.txt', 'utf8')

const dataArray = data.split('\n')

function stringsHaveOneMismatch(stringA, stringB) {
  let mismatchCount = 0
  for (let i = 0; i < stringA.length; i++) {
    if (stringA[i] !== stringB[i]) {
      mismatchCount++
    }
    if (mismatchCount > 1) {
      break
    }
  }

  return mismatchCount !== 1 ? false : true
}

function findMatchingBoxes(data) {
  let matches = []

  data.forEach((str, idx) => {
    data.forEach((compareStr, compareIdx) => {
      if (idx === compareIdx) return

      if (stringsHaveOneMismatch(str, compareStr)) {
        matches.push(str, compareStr)
      }
    })
  })

  const uniqueMatches = new Set(matches)
  return [...uniqueMatches]
}

function deriveSharedLetters([stringA, stringB]) {
  return stringA
    .split('')
    .filter((letter, idx) => letter === stringB[idx])
    .join('')
}

const boxArray = findMatchingBoxes(dataArray)
const sharedLetters = deriveSharedLetters(boxArray)

console.log(sharedLetters)
