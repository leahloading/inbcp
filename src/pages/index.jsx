import parse from 'rss-to-json'

import Head from 'next/head'

import Intro from '@/components/Intro'

function EpisodeFeed({ episodes }) {
  return (
    <div className="mx-auto mt-12 grid max-w-md gap-5 md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3">
      {episodes.map((episode) => (
        <div
          key={episode.title}
          className="flex flex-col overflow-hidden rounded-sm shadow-lg"
        >
          {/* image */}
          <div className="flex-shrink-0">
            <img
              className="h-96 w-full object-cover"
              src={episode.image.href}
              alt=""
            />
          </div>
          {/* card content */}
          <div className="flex flex-1 flex-col justify-between bg-white p-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-indigo-600">
                {/* <a href={'#'} className="hover:underline">
                  {'Listen'}
                </a> */}
              </p>
              {/* <a href={'#'} className="mt-2 block"> */}
              <p className="mt-2 text-xl font-semibold text-gray-900">
                {episode.title}
              </p>
              {/* <p className="mt-3 text-base text-gray-500">
                {stripTags(episode.description)}
              </p> */}
              {/* </a> */}
            </div>
            <div className="mt-6 flex items-center">
              <div className="flex-shrink-0">
                {/* <a href={'#'}> */}
                <span className="sr-only">{`${episode.itunes_season}${episode.itunes_episode}`}</span>
                {/* </a> */}
              </div>
              <div className="">
                <p className="text-sm font-medium text-gray-900">
                  {/* <a href={'#'} className="hover:underline"> */}
                  {`Season ${episode.itunes_season} Episode ${episode.itunes_episode}`}
                  {/* </a> */}
                </p>
                <div className="flex space-x-1 text-sm text-gray-500">
                  <time dateTime={new Date(episode.published)}>
                    {new Date(episode.published).toDateString()}
                  </time>
                  {/* <span aria-hidden="true">&middot;</span> */}
                  {/* <span>{post.readingTime} read</span> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function Episodes({ episodes }) {
  return (
    <div className=" relative bg-gray-50 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Episodes
          </h2>
          <p className=" mx-auto mt-3 max-w-2xl text-gray-500 sm:mt-4">
            Rah, that&#39;s a lot of books.
          </p>
        </div>
        <EpisodeFeed episodes={episodes} />
      </div>
    </div>
  )
}
export default function Home({ episodes }) {
  return (
    <>
      <Head>
        <title>It's Not a Book Club Podcast</title>
        <meta
          name="description"
          content="A podcast by three south londoners, Reuben, Zach and Kehinde."
        />
        <meta
          property="og:description"
          content="A podcast by three south londoners, Reuben, Zach and Kehinde."
        />
      </Head>
      <Intro />
      <Episodes episodes={episodes} />
    </>
  )
}

export async function getStaticProps() {
  let feed = await parse('https://feeds.buzzsprout.com/403111.rss')

  return {
    props: {
      episodes: feed.items.map(
        ({
          title,
          description,
          enclosures,
          published,
          itunes_image,
          itunes_season = 'X',
          itunes_episode = 'X',
        }) => ({
          title,
          description,
          published,
          image: itunes_image,
          itunes_season,
          itunes_episode,
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
