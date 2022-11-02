function formatTitle(title) {
  const substringIndex = title.indexOf(':') + 2
  return title.substring(substringIndex)
}

module.exports = formatTitle
