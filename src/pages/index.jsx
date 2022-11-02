import parse from 'rss-to-json'
export default function Home({ episodes }) {
  return episodes.map((episode) => {
    return (
      <>
        <div>{episode.audio.src}</div>
      </>
    )
  })
}

export async function getStaticProps() {
  let feed = await parse('https://feeds.buzzsprout.com/403111.rss')

  return {
    props: {
      episodes: feed.items.map(
        ({ title, description, enclosures, published }) => ({
          title,
          description,
          published,
          //   this is returning an object so looks like audio: { src: ..., type: ...}. access it using episode.audio.src
          audio: enclosures.map((enclosure) => ({
            src: enclosure.url,
            type: enclosure.type,
          }))[0],
        })
      ),
    },
    revalidate: 10,
  }
}
