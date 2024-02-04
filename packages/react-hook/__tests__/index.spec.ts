// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { describe, expect } from 'vitest'
import { useControlledState } from '../src/useControlledState'
import { useStrictInput } from '../src/useStrictInput'

describe('useControlledState', () => {
  it('should be return default value', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 'defaultValue',
      }),
    )

    const [value] = result.current

    expect(value).toBe('defaultValue')
  })

  it('should be return value', () => {
    const { result } = renderHook(() =>
      useControlledState({
        value: 'value',
        defaultValue: 'defaultValue',
      }),
    )

    const [value] = result.current

    expect(value).toBe('value')
  })

  it('should be callback onchange that is controlled state', () => {
    let val = ''
    const { result } = renderHook(() =>
      useControlledState({
        value: 'value',
        defaultValue: 'defaultValue',
        onChange: (value) => {
          val = value
        },
      }),
    )

    const [, setValue] = result.current

    act(() => {
      setValue('controlled')
    })

    expect(val).toBe('controlled')
  })

  it('should change', () => {
    let val = ''
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 'defaultValue',
        onChange: (value) => {
          val = value
        },
      }),
    )

    const [, setValue] = result.current

    act(() => {
      setValue('changed')
    })

    expect(val).toBe('changed')
  })
})

describe('useStrictInput', () => {
  it('should only keep number', () => {
    let value = ''
    const { result } = renderHook(() =>
      useStrictInput(value, (newValue) => {
        value = newValue
      }),
    )
    act(() => {
      result.current.onChange('asd123~!@#$ ][];.,/?"*-+')
    })

    expect(value).toBe('123')
  })
})
