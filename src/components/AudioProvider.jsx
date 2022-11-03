/* as the name of this component suggests, its main purpose is to provide the ability to use audio in our application. 
   it has logic relating to:
   - controlling the state of the audio element
    - using useReducer to manage the multiple different states
    - useContext to pass this context to child components
    - useRef to access the browser APIs associated with the HTMLMediaElement 'audio'
    - useMemo to watch for changes to dependencies and optimise performance 
    - useAudioPlayer function to pass episode data back up to the actions object and perform checks about the source URL and other metadata

  note the AudioProvider function is only returning
   1. a single audio player element (without controls attribute so we can't actually see it, only access its features)
   2. the AudioPlayerContext.Provider component that allows us to pass our state and actions object to child components (see variable called api)
*/

import { createContext, useContext, useMemo, useReducer, useRef } from 'react'

// there is use of ES6 shorthands throughout this page, eg to initialise methods on objects

/* createContext lets components pass information deep down without explicitly passing props.
Call createContext outside any components to create one or more contexts.
createContext returns a context object. Components can read context by passing it to useContext()

See useAudioPlayer function for useContext implementation
*/

const AudioPlayerContext = createContext()

/* setting up reducer functions to manage state
  this includes all the possible state that needs management in our audio player

  ## purpose

  calling an of this methods will update the state variable returned by the useReducer hook in our audioProvider function component
  
  In computing the payload is the part of transmitted data that is the actual intended message. 
  Having an object property called payload probably helps to have consistency in our dispatch function's action object:

  {
    type: ...
    payload: ...
  }
  */
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
  TOGGLE_MUTE(state, _action) {
    return { ...state, muted: !state.muted }
  },
  SET_CURRENT_TIME(state, action) {
    return { ...state, currentTime: action.payload }
  },
  SET_DURATION(state, action) {
    return { ...state, duration: action.payload }
  },
}

// access desired reducer functions declared on object above using bracket notation '[action.type]'
function audioReducer(state, action) {
  return reducers[action.type](state, action)
}

export function AudioProvider({ children }) {
  /* 
  ## useReducer: to manage state

    setup useReducer by passing a reducer function and initial state
    and returning a stateful value and a dispatch function (to “dispatch” user actions to the reducer)
  */

  let [state, dispatch] = useReducer(audioReducer, {
    playing: false,
    muted: false,
    duration: 0,
    currentTime: 0,
    meta: null,
  })

  /*
  Using useRef, we are able to access the DOM node of the audio element, and therefore access the browser APIs associated with this element.
  The methods and properties being used belong to the HTMLMediaElement interface of the DOM API. [HTMLMediaElement - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)

  First we import useRef, then use it to declare a ref inside our component. See the audio element in the return of this 
  component for how you pass it to the DOM node using the ref attribute.
  */
  let playerRef = useRef(null)

  // actions object with a bunch of action methods that ultimately use browser API methods and properties of the audio element
  // i think these the methods on this actions object are for the children of the AudioProvider component, so they can update the state of the audio element
  let actions = useMemo(() => {
    return {
      play(data) {
        if (data) {
          dispatch({ type: 'SET_META', payload: data })

          /* HTMLMediaElement.currentSrc property contains the absolute URL of the chosen media resource.
            This if statement is checking that the URL of the source of the media resource using audio element DOM node is the same as the 'audioPlayerData'
            ie the episode data from the json returned by getStaticProps async function

            IF the URL of the media resource used by the audio element DOES NOT match the episode data src
              it will pause and set current playback time to 0
            OTHERWISE it will play the media resource
          */
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
      seekBy(amount) {
        playerRef.current.currentTime += amount
      },
      seek(time) {
        playerRef.current.currentTime = time
      },
      playbackRate(rate) {
        playerRef.current.playbackRate = rate
      },
      toggleMute() {
        dispatch({ type: 'TOGGLE_MUTE' })
      },
      /* 
      ## isPlaying
      
      this method isPlaying will always return a boolean

      it first asks if data is present
        IF TRUE
          then it returns the result of the expression below, which will be a boolean 
            is state.playing true?
            AND
            is the current url of the media resource used by audio element equal to the data audio src?
        
      if this returns a true boolean value then the toggle method will pause the playing audio
      if it returns false then the toggle method will trigger the dispatch of new metadata to state variable and play the new episode.

        
      */
      isPlaying(data) {
        return data
          ? state.playing && playerRef.current.currentSrc === data.audio.src
          : state.playing
      },
    }
  }, [state.playing])
  /*
  ## useMemo actions and state dependency 
  note the useMemo dependency on state.playing on the lines above here.
   */

  let api = useMemo(() => ({ ...state, ...actions }), [state, actions])

  /* a note on AudioPlayerContext.Provider
      by this point we have already created our context, now we are providing a value for this context that any child
      components will be able to access
      by providing the AudioPlayerContext with the value of the 'api' variable, 
      any components below can access any of the state values and any of the actions methods. 
      This essentially allows us to call the dispatch function to update the state using our reducer function (audioReducer and thus reducers)
    
      This is especially  true because the AudioProvider component is initilaised on every page because it is used in the custom App (_app.jsx)
      This might also allow us to keep state when navigating pages? e.g. Pressing play on a podcast and having it continue even if you click on another podcast page

      useReducer allows us to manage mu;tiple pieces of state more easily and useContext provides us access to the state and actions methods that allow us to update that state
  */

  // note how the children are wrapped in the AudioPlayerContext.Provider
  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>
      <audio
        // passing our ref to the DOM node for the audio element
        // note how there is NO controls attribute
        ref={playerRef}
        onPlay={() => dispatch({ type: 'PLAY' })}
        onPause={() => dispatch({ type: 'PAUSE' })}
        onTimeUpdate={(event) => {
          dispatch({
            type: 'SET_CURRENT_TIME',
            payload: Math.floor(event.target.currentTime),
          })
        }}
        onDurationChange={(event) => {
          dispatch({
            type: 'SET_DURATION',
            payload: Math.floor(event.target.duration),
          })
        }}
        muted={state.muted}
      />
    </>
  )
}

/* the data parameter here is ultimately provided to the function in the [episode] and index.jsx pages. They pass in the data about the episode.

It looks something like this:

// [episode.jsx]

let audioPlayerData = useMemo(
    () => ({
      title: episode.title,
      audio: {
        src: episode.audio.src,
        type: episode.audio.type,
      },
      link: `/${episode.id}`,
    }),
    [episode]
  )

    let player = useAudioPlayer(audioPlayerData)

    Passing in this data allows us to make checks against things like the media resource url.
    
    In index.jsx it is used in the EpisodeEntry component, ie we are only ever passing in data about a SINGLE episode.
*/

export function useAudioPlayer(data) {
  // context provider from AudioProvider component which is basically the things attached to the api variable
  let player = useContext(AudioPlayerContext)

  /* i'm not sure about this but i think returning this object has something to do with the components at a lower level that
    receive player as a prop being able to access properties
    UseMemo expects a calculation function as its first argument, and we need to wrap the return in parentheses to prevent an implicit return
    so all we actually have here is a copy of player (using spread operator) and then adding two methods and a getter
  */
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
