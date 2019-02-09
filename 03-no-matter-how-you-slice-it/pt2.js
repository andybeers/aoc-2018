const readFile = require('../utils/read-data-file')
const data = readFile(process.argv[2])
const dataArray = data.split('\n')
// const testData = ['#1 @ 850,301: 23x12', '#2 @ 898,245: 15x10']

const decoratedData = dataArray.map(row => {
  const xCoord = parseInt(row.match('@ ([0123456789]+)')[1], 10)
  const yCoord = parseInt(row.match(',([0123456789]+)')[1], 10)
  const width = parseInt(row.match(': ([0123456789]+)')[1], 10)
  const height = parseInt(row.match('x([0123456789]+)')[1], 10)
  const id = parseInt(row.match('#([1234567890]+)')[1], 10)

  return {
    xCoord,
    yCoord,
    width,
    height,
    id,
  }
})

function buildCoords(data) {
  return data.reduce((coordMap, tile) => {
    const coords = []
    for (let i = 0; i < tile.height; i++) {
      let y = tile.yCoord + i
      for (let j = 0; j < tile.width; j++) {
        let x = tile.xCoord + j

        coords.push(`${x},${y}`)
      }
    }

    coordMap[tile.id] = coords
    return coordMap
  }, {})
}

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

const coordsById = buildCoords(decoratedData)

const winner = Object.keys(coordsById).find(id => {
  return !coordsById[id].filter(coord => frequencyMap[coord] > 1).length
})

console.log(winner)
