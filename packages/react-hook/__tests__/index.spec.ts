// @vitest-environment jsdom

import { describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useStrictInput } from '../src/useStrictInput'
import { useControlledState } from '../src/useControlledState'

describe('condition', () => {
  test('test', () => {
    expect(1).toBe(1)
  })
})

describe('useControlledState', () => {
  it('should be return default value', () => {
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 'defaultValue',
      })
    )

    const [value] = result.current

    expect(value).toBe('defaultValue')
  })

  it('should be return value', () => {
    const { result } = renderHook(() =>
      useControlledState({
        value: 'value',
        defaultValue: 'defaultValue',
      })
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
        onChange: (value, preValue) => {
          val = value
        },
      })
    )

    const [_, setValue] = result.current

    act(() => {
      setValue('controlled')
    })

    expect(val).toBe('controlled')
  })

  it('should not be callback onchange that is not controlled state', () => {
    let val = ''
    const { result } = renderHook(() =>
      useControlledState({
        defaultValue: 'defaultValue',
        onChange: (value, preValue) => {
          val = value
        },
      })
    )

    const [value, setValue] = result.current

    act(() => {
      setValue('controlled')
    })

    expect(val).toBe('')
  })
})

describe('useStrictInput', () => {
  it('should only keep number', () => {
    let value = ''
    const { result } = renderHook(() =>
      useStrictInput(value, (newValue) => {
        value = newValue
      })
    )
    act(() => {
      result.current.onChange('asd123~!@#$ ][];.,/?"*-+')
    })

    expect(value).toBe('123')
  })
})
