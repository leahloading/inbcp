import { useAudioPlayer } from '../AudioProvider'
import { PlayButton } from './PlayButton'

export function AudioPlayer() {
  let player = useAudioPlayer()

  if (!player.meta) {
    return null
  }
  return (
    <div className=" flex items-center gap-6 bg-white/90 py-4 px-4 shadow shadow-slate-200/80 ring-1 ring-slate-900/5 backdrop-blur-sm md:px-6">
      <div className="hidden md:block">
        <PlayButton player={player} size="medium" />
        <p>hi</p>
      </div>
    </div>
  )
}
