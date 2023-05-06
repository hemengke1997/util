import { describe, expect, test } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useStrictInput } from '../src/useStrictInput'

describe('condition', () => {
  test('test', () => {
    expect(1).toBe(1)
  })
})

describe('useStrictInput', () => {
  it('should only keep number', () => {
    let value = '123'
    const { result } = renderHook(() =>
      useStrictInput(value, (newValue) => {
        value = newValue
      })
    )
    act(() => {
      result.current.onChange('aslkdj123')
    })

    expect(value).toBe('123')
  })
})
