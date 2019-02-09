const differenceInMinutes = require('date-fns/difference_in_minutes')
const readFile = require('../utils/read-data-file')
const data = readFile(process.argv[2])
const dataArray = data.split('\n')

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
 * Accepts array of guard data and returns the id of the guard who
 * spent the most minutes asleep along with their minutes slept total
 *
 * @param {Array} data array of chronologically sorted guard data strings
 * @returns {Object} sleepiestGuardId and highestMinutesSlept
 */
function findSleepiestGuard(data) {
  let currentGuardId = ''
  let sleepStartTime = ''
  let currentSleepTotal = 0

  let highestMinutesSlept = 0
  let sleepiestGuardId = ''

  const setNewGuard = () => {
    sleepStartTime = ''
    sleepEndTime = ''
    currentSleepTotal = 0
  }

  data.forEach(record => {
    // New guard comes on duty
    if (record.includes('Guard #')) {
      currentSleepTotal = 0
      currentGuardId = parseInt(record.match(/Guard #(\d+)/)[1])
    } else if (record.includes('asleep')) {
      // Start sleep timer
      sleepStartTime = dateFromString(record.match(/\[(.*)\]/)[1])
    } else {
      // On waking, reconcile times
      const wakeTime = dateFromString(record.match(/\[(.*)\]/)[1])
      currentSleepTotal += getMinuteDiff(sleepStartTime, wakeTime)

      if (currentSleepTotal > highestMinutesSlept) {
        highestMinutesSlept = currentSleepTotal
        sleepiestGuardId = currentGuardId
      }
    }
  })

  return {
    sleepiestGuardId,
    highestMinutesSlept,
  }
}

const { highestMinutesSlept, sleepiestGuardId } = findSleepiestGuard(timeSortedData)
