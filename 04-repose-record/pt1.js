const differenceInMinutes = require('date-fns/difference_in_minutes')
const readFile = require('../utils/read-data-file')
const data = readFile(process.argv[2])
const dataArray = data.split('\n')

// Arrange data chronologically
const timeSortedData = dataArray.sort()

// EXAMPLE GUARD DATA
// '[1518-03-20 23:50] Guard #1553 begins shift',
// '[1518-03-21 00:00] falls asleep',
// '[1518-03-21 00:41] wakes up',
// '[1518-03-21 00:45] falls asleep',
// '[1518-03-21 00:59] wakes up',

/**
 * Accepts a date-time string from the data source of format:
 * 1518-03-20 23:50
 * and returns a corresponding javascript date object
 *
 * @param {String} dateString datetime segment from a data entry
 * @returns {Date}
 */
function dateFromString(dateString) {
  const yearMonthSplit = dateString.split('-')

  const year = parseInt(yearMonthSplit[0])
  const month = parseInt(yearMonthSplit[1])
  const day = parseInt(yearMonthSplit[2].split(' ')[0])
  const hour = parseInt(dateString.match(/\d+(?=:)/)[0])
  const minute = parseInt(dateString.split(':')[1])

  return new Date(year, month, day, hour, minute)
}

/**
 * Accepts two Date objects and returns the difference
 * in minutes between the two as a _positive_ integer
 *
 * @param {Date} dateA date to compare
 * @param {Date} dateB date to compare
 * @returns {Number}
 */
function getMinuteDiff(dateA, dateB) {
  return Math.abs(differenceInMinutes(dateA, dateB))
}

/**
 * Accepts the raw puzzle data and returns an object
 * whose keys are guard Ids
 *
 * @param {String} dataString
 * @returns {Object} map of guard Ids
 */
function constructGuardMap(dataString) {
  const ids = dataString.match(/#(\d+)/gm)

  return ids.reduce((acc, curr) => {
    const stripped = curr.replace('#', '')
    acc[stripped] = 0
    return acc
  }, {})
}

/**
 * Accepts array of puzzle data and a guardMap and returns the id of the
 * guard who spent the most minutes asleep
 *
 * @param {Array} data array of chronologically sorted guard data strings
 * @param {Object} guardMap map of guard ids
 * @returns {Number} id of sleepiest guard
 */
function findSleepiestGuard(data, guardMap) {
  let currentGuardId = ''
  let sleepStartTime = ''
  let currentSleepTotal = 0

  data.forEach(record => {
    // New guard comes on duty
    if (record.includes('Guard #')) {
      guardMap[currentGuardId] += currentSleepTotal
      currentSleepTotal = 0
      currentGuardId = parseInt(record.match(/Guard #(\d+)/)[1])
    } else if (record.includes('asleep')) {
      // Start sleep timer
      sleepStartTime = dateFromString(record.match(/\[(.*)\]/)[1])
    } else {
      // On waking, reconcile times
      const wakeTime = dateFromString(record.match(/\[(.*)\]/)[1])
      currentSleepTotal += getMinuteDiff(sleepStartTime, wakeTime)
    }
  })

  const guardArray = Object.keys(guardMap).map(key => ({
    id: key,
    minutes: guardMap[key],
  }))

  guardArray.sort((a, b) => a.minutes > b.minutes)

  return guardArray[0].id
}

/**
 * Returns all relevant data items for a given guard
 *
 * @param {String} data sorted puzzle data
 * @param {Number} guardId id of desired guard data
 * @returns {Array} array of data rows
 */
function guardDataById(data, guardId) {
  let dataForGuard = []
  let foundGuard = false

  data.forEach(item => {
    if (!item) {
      console.log('scoop')
    } else if (foundGuard && !item.includes('Guard #')) {
      dataForGuard.push(item)
    } else if (item.includes('Guard #')) {
      if (item.match(/Guard #(\d+)/)[1] === guardId) {
        foundGuard = true
      } else {
        foundGuard = false
      }
    }
  })

  return dataForGuard
}

/**
 * Accepts an array of just sleep/wake data for a given guard
 * and returns the minute they are most often sleeping.
 *
 * @param {Array} data Array wake/sleep data for a guard
 * @returns {Number} the minute a guard most often sleeps
 */
function getSleepiestMinute(data) {
  const minuteMap = {}
  let sleepTime

  data.forEach((row, idx) => {
    const minute = parseInt(row.match(/:(\d+)/)[1])

    // Sleep begin
    if (idx % 2 === 0) {
      sleepTime = minute
    } else {
      // Wake
      for (let i = sleepTime; i < minute; i++) {
        minuteMap[i] = minuteMap[i] ? minuteMap[i] + 1 : 1
      }
    }
  })

  return Object.keys(minuteMap).sort((a, b) => minuteMap[b] - minuteMap[a])[0]
}

const sleepiestGuard = findSleepiestGuard(timeSortedData, constructGuardMap(data))
console.log('Sleepiest guard ID: ', sleepiestGuard)

const sleepiestGuardData = guardDataById(timeSortedData, '1549')

console.log('Sleepiest minute: ', getSleepiestMinute(sleepiestGuardData))
console.log('Answer: ', 1549 * 41)
