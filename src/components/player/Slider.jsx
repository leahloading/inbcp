// useRef being imported here for use with the Adobe React Aria library
import { useRef } from 'react'
/* 
## mergeProps

mergeProps is a utility function that combines multiple props objects together in a smart way. This can be useful when you need to combine the results of 
multiple react-aria hooks onto a single element. For example, both hooks may return the same event handlers, class names, or ids, and only one of these can be applied.
[mergeProps – React Aria](https://react-spectrum.adobe.com/react-aria/mergeProps.html)

## useFocusRing 
The useFocusRing hook determines whether a focus ring should be displayed to indicate keyboard focus for a component
[useFocusRing – React Aria](https://react-spectrum.adobe.com/react-aria/useFocusRing.html)

## useSlider, useSliderThumb

Provides the behavior and accessibility implementation for a slider component representing one or more values.
[useSlider – React Aria](https://react-spectrum.adobe.com/react-aria/useSlider.html)

## VisuallyHidden

VisuallyHidden hides its children visually, while keeping content visible to screen readers.
[VisuallyHidden – React Aria](https://react-spectrum.adobe.com/react-aria/VisuallyHidden.html)
*/
import {
  mergeProps,
  useFocusRing,
  useSlider,
  useSliderThumb,
  VisuallyHidden,
} from 'react-aria'

/*
## useSliderState

Provides state management for a slider component. Stores values for all thumbs, formats values for localization, and provides methods to update the position of any thumbs.
[useSliderState – React Stately](https://react-spectrum.adobe.com/react-stately/useSliderState.html)
*/
import { useSliderState } from 'react-stately'
/*
## clsx
utility for constructing className strings conditionally.
[clsx - npm](https://www.npmjs.com/package/clsx)

clsx(...input) Returns: String
Any falsey values are discarded! Standalone Boolean values are discarded as well.
*/

import clsx from 'clsx'

/*
  ## parseTime - utility function
  
  this function is parsing seconds into hours, minutes and seconds
  It is used in conjunction with the state.getThumbValue and state.getThumbMaxValue methods 
  I think it is meant to get the current value of the thumb  value and convert it to a useful numeric format (in this case hours, minutes and seconds)
  Note: Math.floor is rounding down, this is relevant to the formatTime function's .findIndex testing function
*/
function parseTime(seconds) {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds - hours * 3600) / 60)
  seconds = seconds - hours * 3600 - minutes * 60
  return [hours, minutes, seconds]
}

/*
  ## formatTime
  
  this function is formatting the return from parseTime as timer vibe
*/
function formatTime(seconds, totalSeconds = seconds) {
  let totalWithoutLeadingZeroes = totalSeconds.slice(
    totalSeconds.findIndex((x) => x !== 0)
  )
  return seconds
    .slice(seconds.length - totalWithoutLeadingZeroes.length)
    .map((x) => x.toString().padStart(2, '0'))
    .join(':')
}

function Thumb(props) {
  let { state, trackRef, focusProps, isFocusVisible, index } = props
  let inputRef = useRef(null)
  let { thumbProps, inputProps } = useSliderThumb(
    { index, trackRef, inputRef },
    state
  )

  return (
    <div
      className="absolute top-1/2 -translate-x-1/2"
      style={{
        left: `${state.getThumbPercent(index) * 100}%`,
      }}
    >
      <div
        {...thumbProps}
        onMouseDown={(...args) => {
          thumbProps.onMouseDown(...args)
          props.onChangeStart?.()
        }}
        onPointerDown={(...args) => {
          thumbProps.onPointerDown(...args)
          props.onChangeStart?.()
        }}
        className={clsx(
          'h-4 rounded-full',
          isFocusVisible || state.isThumbDragging(index)
            ? 'w-1.5 bg-slate-900'
            : 'w-1 bg-slate-700'
        )}
      >
        <VisuallyHidden>
          <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
        </VisuallyHidden>
      </div>
    </div>
  )
}

export function Slider(props) {
  let trackRef = useRef(null)
  let state = useSliderState(props)
  let { groupProps, trackProps, labelProps, outputProps } = useSlider(
    props,
    state,
    trackRef
  )
  let { focusProps, isFocusVisible } = useFocusRing()

  let currentTime = parseTime(state.getThumbValue(0))
  let totalTime = parseTime(state.getThumbMaxValue(0))

  /* this reflects the anatomy of a Slider
      Sliders consist of a track element showing the range of available values, one or more thumbs showing the current values, 
      an optional <output> element displaying the current values textually, and a label.
    [useSlider – React Aria](https://react-spectrum.adobe.com/react-aria/useSlider.html#anatomy)
  
  */
  return (
    <div
      {...groupProps}
      className="absolute inset-x-0 bottom-full flex flex-auto touch-none items-center gap-6 md:relative"
    >
      {props.label && (
        <label className="sr-only" {...labelProps}>
          {props.label}
        </label>
      )}
      <div
        {...trackProps}
        onMouseDown={(...args) => {
          trackProps.onMouseDown(...args)
          props.onChangeStart?.()
        }}
        onPointerDown={(...args) => {
          trackProps.onPointerDown(...args)
          props.onChangeStart?.()
        }}
        ref={trackRef}
        className="relative w-full bg-slate-100 md:rounded-full"
      >
        <div
          className={clsx(
            'h-2 md:rounded-r-md md:rounded-l-xl',
            isFocusVisible || state.isThumbDragging(0)
              ? 'bg-slate-900'
              : 'bg-slate-700'
          )}
          style={{
            width:
              state.getThumbValue(0) === 0
                ? 0
                : `calc(${state.getThumbPercent(0) * 100}% - ${
                    isFocusVisible || state.isThumbDragging(0)
                      ? '0.3125rem'
                      : '0.25rem'
                  })`,
          }}
        />
        <Thumb
          index={0}
          state={state}
          trackRef={trackRef}
          onChangeStart={props.onChangeStart}
          focusProps={focusProps}
          isFocusVisible={isFocusVisible}
        />
      </div>
      <div className="hidden items-center gap-2 md:flex">

        {/* output element shows us the current running time of the playing episode  */}
        <output
          {...outputProps}
          aria-live="off"
          className={clsx(
            'hidden rounded-md px-1 py-0.5 font-mono text-sm leading-6 md:block',
            state.getThumbMaxValue(0) === 0 && 'opacity-0',
            isFocusVisible || state.isThumbDragging(0)
              ? 'bg-slate-100 text-slate-900'
              : 'text-slate-500'
          )}
        >
          {formatTime(currentTime, totalTime)}
        </output>
        <span className="text-sm leading-6 text-slate-300" aria-hidden="true">
          /
        </span>
        {/* total running time of currently playing episode (fixed value) */}
        <span
          className={clsx(
            'hidden rounded-md px-1 py-0.5 font-mono text-sm leading-6 text-slate-500 md:block',
            state.getThumbMaxValue(0) === 0 && 'opacity-0'
          )}
        >
          {formatTime(totalTime)}
        </span>
      </div>
    </div>
  )
}
