import { PRERENDER_REVALIDATE_HEADER } from 'next/dist/server/api-utils'
import { useMemo, useReducer, useRef, useContext, createContext } from 'react'

const AudioPlayerContext = createContext()

const reducers = {
  SET_META(state, action) {
    return { ...state, meta: action.payload }
  },
  PLAY(state, _action) {
    return { ...state, playing: true }
  },
  PAUSE(state, _action) {
    return { ...state, playing: false }
  },
}

function audioReducer(state, action) {
  return reducers[action.type](state, action)
}

export function AudioProvider({ children }) {
  let [state, dispatch] = useReducer(audioReducer, {
    playing: false,
    meta: null,
  })

  let playerRef = useRef(null)

  let actions = useMemo(() => {
    return {
      play(data) {
        if (data) {
          dispatch({ type: 'SET_META', payload: data })

          // set the correct audio source on the HTML element :)
          if (playerRef.current.currentSrc !== data.audio.src) {
            let playbackRate = playerRef.current.playbackRate
            playerRef.current.src = data.audio.src
            playerRef.current.load()
            playerRef.current.pause()
            playerRef.current.playbackRate = playbackRate
            playerRef.currentTime = 0
          }
        }
        playerRef.current.play()
      },
      pause() {
        playerRef.current.pause()
      },
      toggle(data) {
        this.isPlaying(data) ? actions.pause() : actions.play(data)
      },
      isPlaying(data) {
        return data
          ? state.playing && playerRef.current.currentSrc === data.audio.src
          : state.playing
      },
    }
  }, [state.playing])

  let api = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [state, actions]
  )

  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>
      <audio
        ref={playerRef}
        onPlay={() => dispatch({ type: 'PLAY' })}
        onPause={() => dispatch({ type: 'PAUSE' })}
      />
    </>
  )
}

export function useAudioPlayer(data) {
  let player = useContext(AudioPlayerContext)

  return useMemo(
    () => ({
      ...player,
      play() {
        player.play(data)
      },
      toggle() {
        player.toggle(data)
      },
      get playing() {
        return player.isPlaying(data)
      },
    }),
    [player, data]
  )
}
