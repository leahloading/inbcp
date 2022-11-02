function stripTags(original) {
  return original.replace(/(<([^>]+)>)/gi, '')
}

module.exports = stripTags
