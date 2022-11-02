
Building out the user interface is the primary focus of my work in this project.

// insert categories of work image

I’m using the podcast [rss-feed](https://feeds.buzzsprout.com/403111.rss) to get the episode data into my application, in combination with the [rss-to-json](https://www.npmjs.com/package/rss-to-json) package. This package allows me to transform the data into a format I can work with.

// insert code example

A single episode has this data structure

```json
 {
          "title": "S2 Episode 05: Beloved",
          "description": "<p><br/>''BELOVED'' is Toni Morrison's fifth novel, and the podcast's second time diving into one of her literary classics. <br/><br/>Winning the Pulitzer Prize for Fiction in 1988,  'Beloved' is set after the American Civil War and tells the story of a family of formerly enslaved people whose Cincinnati home is haunted by a malevolent spirit. <br/><br/>Not  immediately easy to read,  the guys were quickly won over by Toni Morrison's seamless skill with words.  Tune in  to a discussion deciphering the books periodic jumps from the past and present,  shared trauma and the impact positive and negative experiences have on ones' reality. <br/><br/><b>Twitter:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>Instagram:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>TikTok: </b>@itsnotabookclubpodcast</p>",
          "published": 1651705200000,
          "created": 1651705200000,
          "category": [],
          "content": "<p><br/>''BELOVED'' is Toni Morrison's fifth novel, and the podcast's second time diving into one of her literary classics. <br/><br/>Winning the Pulitzer Prize for Fiction in 1988,  'Beloved' is set after the American Civil War and tells the story of a family of formerly enslaved people whose Cincinnati home is haunted by a malevolent spirit. <br/><br/>Not  immediately easy to read,  the guys were quickly won over by Toni Morrison's seamless skill with words.  Tune in  to a discussion deciphering the books periodic jumps from the past and present,  shared trauma and the impact positive and negative experiences have on ones' reality. <br/><br/><b>Twitter:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>Instagram:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>TikTok: </b>@itsnotabookclubpodcast</p>",
          "enclosures": [
             {
                "url": "https://pdcn.co/e/www.buzzsprout.com/403111/10542841-s2-episode-05-beloved.mp3",
                "length": "58803637",
                "type": "audio/mpeg"
             }
          ],
          "content_encoded": "<p><br/>''BELOVED'' is Toni Morrison's fifth novel, and the podcast's second time diving into one of her literary classics. <br/><br/>Winning the Pulitzer Prize for Fiction in 1988,  'Beloved' is set after the American Civil War and tells the story of a family of formerly enslaved people whose Cincinnati home is haunted by a malevolent spirit. <br/><br/>Not  immediately easy to read,  the guys were quickly won over by Toni Morrison's seamless skill with words.  Tune in  to a discussion deciphering the books periodic jumps from the past and present,  shared trauma and the impact positive and negative experiences have on ones' reality. <br/><br/><b>Twitter:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>Instagram:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>TikTok: </b>@itsnotabookclubpodcast</p>",
          "itunes_author": "It's Not A Book Club Podcast",
          "itunes_explicit": true,
          "itunes_duration": 4898,
          "itunes_season": 2,
          "itunes_episode": 5,
          "itunes_episodeType": "full",
          "itunes_image": {
             "href": "https://storage.buzzsprout.com/variants/2zephlfuhdifrqps680vwv4a3kd2/60854458c4d1acdf4e1c2f79c4137142d85d78e379bdafbd69bd34c85f5819ad.jpg"
          },
          "media": {}
       }


```

I pass my episode data to my functional component using the  Next.js data fetching feature, getStaticProps.