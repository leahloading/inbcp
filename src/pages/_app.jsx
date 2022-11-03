import { Layout } from '@/components/Layout'
import '@/styles/tailwind.css'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
