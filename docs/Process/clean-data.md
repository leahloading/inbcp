## Format Episode Title

I noticed the episode layout on Spotify doesn't include the descriptive season and episode prefix that appears in the rss feed. For example, if the rss feed episode title is 'S2 Episode 05: Beloved', I want it to read 'Beloved'. 

I wrote a small utility function, `formatTitle`, to remove this from the title before displaying it on the card.

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

## Strip HTML Tags

The data in the rss feed for episode description had HTML tags that needed stripping. I used a utility function `stripTags` to remove these. This function makes use of a regular expression to clean the text.

```javascript
function stripTags(original) {
  return original.replace(/(<([^>]+)>)/gi, '')
}

```

## Episode X

When fetching the itunes_episode and itunes_season properties from the data set there were missing values for a single episode. I used default parameters to account for this, and dealt with the specific episodes individually later on.

```javascript
    props: {
      episodes: feed.items.map(
        ({
          title,
          description,
          enclosures,
          published,
          itunes_image,
          itunes_season = 'X', // default
          itunes_episode = 'X', // default
        }) => ({
          title,
          description,
          published,
          image: itunes_image,
          itunes_season,
          itunes_episode,
          audio: enclosures.map((enclosure) => ({
            src: enclosure.url,
            type: enclosure.type,
          }))[0],
        })
      )
```