const setIntervalVerb = (message) => {
    let intervalVerb = ''

    if (message.includes('minutes') || (message.includes('minute'))) {
        intervalVerb = 'm'
    }

    if (message.includes('hours') || message.includes('hour')) {
        intervalVerb = 'h'
    }

    if (message.includes('days') || message.includes('day')) {
        intervalVerb = 'd'
    }

    if (message.includes('weeks') || message.includes('week')) {
        intervalVerb = 'w'
    }

    if (message.includes('months') || message.includes('month')) {
        intervalVerb = 'M'
    }

    if (message.includes('years') || message.includes('year')) {
        intervalVerb = 'y'
    }
    return intervalVerb
}

module.exports = setIntervalVerb