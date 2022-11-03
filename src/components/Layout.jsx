import { AudioPlayer } from './player/AudioPlayer'

export function Layout({ children }) {
  return (
    <>
      <main>
        <div>{children}</div>
      </main>
      <div className="fixed inset-x-0 bottom-0 z-10">
        <AudioPlayer />
      </div>
    </>
  )
}
