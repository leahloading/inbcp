const formatTitle = require('./formatTitle')

test('format episode title', () => {
  expect(formatTitle('S2 Episode 05: Beloved')).toBe('Beloved')
})
