I noticed the episode layout on Spotify doesn't include the descriptive season and episode prefix that appears in the rss feed. For example, if the rss feed episode title is 'S2 Episode 05: Beloved', I want it to read 'Beloved'. 

I wrote a small utility function to remove this from the title before displaying it on the card.

The utility is highly context specific, however because I have reviewed the data set and it all follows the same model, i'm happy with my solution. 


```javascript
// formatTitle.js

function formatTitle(title) {
    // identify index of ':'
    // add 2 to this number to account for whitespace
  const substringIndex = title.indexOf(':') + 2
    // return the substring after this index
  return title.substring(substringIndex)
}

```

My jest test verified the solution.

```
const formatTitle = require('./formatTitle')

test('format episode title', () => {
  expect(formatTitle('S2 Episode 05: Beloved')).toBe('Beloved')
})

```