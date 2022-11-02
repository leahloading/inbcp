const stripTags = require('./stripTags')

const htmlData =
  "<p><br/>''BELOVED'' is Toni Morrison's fifth novel, and the podcast's second time diving into one of her literary classics. <br/><br/>Winning the Pulitzer Prize for Fiction in 1988,  'Beloved' is set after the American Civil War and tells the story of a family of formerly enslaved people whose Cincinnati home is haunted by a malevolent spirit. <br/><br/>Not  immediately easy to read,  the guys were quickly won over by Toni Morrison's seamless skill with words.  Tune in  to a discussion deciphering the books periodic jumps from the past and present,  shared trauma and the impact positive and negative experiences have on ones' reality. <br/><br/><b>Twitter:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>Instagram:</b> @ITSNOTABOOKCLUBPODCAST<br/><b>TikTok: </b>@itsnotabookclubpodcast</p>"

const output =
  "''BELOVED'' is Toni Morrison's fifth novel, and the podcast's second time diving into one of her literary classics. Winning the Pulitzer Prize for Fiction in 1988,  'Beloved' is set after the American Civil War and tells the story of a family of formerly enslaved people whose Cincinnati home is haunted by a malevolent spirit. Not  immediately easy to read,  the guys were quickly won over by Toni Morrison's seamless skill with words.  Tune in  to a discussion deciphering the books periodic jumps from the past and present,  shared trauma and the impact positive and negative experiences have on ones' reality. Twitter: @ITSNOTABOOKCLUBPODCASTInstagram: @ITSNOTABOOKCLUBPODCASTTikTok: @itsnotabookclubpodcast"

test('strip HTML tags', () => {
  expect(stripTags(htmlData)).toBe(output)
})
