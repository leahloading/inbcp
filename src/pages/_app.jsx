import { AudioProvider } from '@/components/AudioProvider'
import { Layout } from '@/components/Layout'
import '@/styles/tailwind.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <AudioProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AudioProvider>
  )
}
