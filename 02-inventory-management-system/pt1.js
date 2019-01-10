const readFile = require('../utils/read-data-file')

const data = readFile(process.argv[2])

const dataArray = data.split('\n')

let twoCounter = 0
let threeCounter = 0

function searchString(str) {
  const letters = str.split('')

  const frequencyMap = letters.reduce((acc, letter) => {
    acc[letter] = acc[letter] ? acc[letter] + 1 : 1
    return acc
  }, {})

  const frequencyArr = Object.keys(frequencyMap)
  const hasTwo = !!frequencyArr.find(letter => frequencyMap[letter] === 2)
  const hasThree = !!frequencyArr.find(letter => frequencyMap[letter] === 3)

  if (hasTwo) {
    twoCounter++
  }
  if (hasThree) {
    threeCounter++
  }
}

dataArray.forEach(str => {
  searchString(str)
})

const checksum = twoCounter * threeCounter

console.log({ checksum })
