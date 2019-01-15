const readFile = require('../utils/read-data-file')
const data = readFile(process.argv[2])
const dataArray = data.split('\n')

const decoratedData = dataArray.map(row => {
  const xCoord = parseInt(row.match('@ ([0123456789]+)')[1], 10)
  const yCoord = parseInt(row.match(',([0123456789]+)')[1], 10)
  const width = parseInt(row.match(': ([0123456789]+)')[1], 10)
  const height = parseInt(row.match('x([0123456789]+)')[1], 10)

  return {
    xCoord,
    yCoord,
    width,
    height,
  }
})

function buildFrequencyMap(data) {
  return data.reduce((acc, curr) => {
    for (let i = 0; i < curr.height; i++) {
      let y = curr.yCoord + i

      for (let j = 0; j < curr.width; j++) {
        let x = curr.xCoord + j

        let position = acc[`${x},${y}`]
        acc[`${x},${y}`] = position ? (position += 1) : 1
      }
    }

    return acc
  }, {})
}

const frequencyMap = buildFrequencyMap(decoratedData)

const sharedTileCount = Object.keys(frequencyMap).reduce((acc, curr) => {
  if (frequencyMap[curr] > 1) {
    acc = ++acc
  }
  return acc
}, 0)

console.log(sharedTileCount)
