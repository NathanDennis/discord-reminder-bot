const formatMessage = (msg) => {
    return msg.toString().replace(/\s+/g, " ").replace(/^\s|\s$/g, "").toLowerCase()
}

module.exports = formatMessage