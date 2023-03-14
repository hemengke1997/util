import { useMemoizedFn, useUpdate } from 'ahooks'
import querystring from 'query-string'
import type { ParseOptions, StringifyOptions } from 'query-string'
import { useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface Options {
  navigateMode?: 'push' | 'replace'
  parseOptions?: ParseOptions
  stringifyOptions?: StringifyOptions
}

const baseParseConfig: ParseOptions = {
  parseNumbers: false,
  parseBooleans: false,
}

const baseStringifyConfig: StringifyOptions = {
  skipNull: false,
  skipEmptyString: false,
}

type UrlState = Record<string, any>

// Taken from @ahookjs/use-url-state
const useUrlState = <S extends UrlState = UrlState>(initialState?: S | (() => S), options?: Options) => {
  type State = Partial<{ [key in keyof S]: any }>
  const { navigateMode = 'push', parseOptions, stringifyOptions } = options || {}

  const mergedParseOptions = { ...baseParseConfig, ...parseOptions }
  const mergedStringifyOptions = { ...baseStringifyConfig, ...stringifyOptions }

  const location = useLocation()

  const navigate = useNavigate()

  const update = useUpdate()

  const initialStateRef = useRef(typeof initialState === 'function' ? (initialState as () => S)() : initialState || {})

  const queryFromUrl = useMemo(() => {
    return querystring.parse(location.search, mergedParseOptions)
  }, [location.search])

  const targetQuery: State = useMemo(
    () => ({
      ...initialStateRef.current,
      ...queryFromUrl,
    }),
    [queryFromUrl],
  )

  const setState = (s: React.SetStateAction<State>) => {
    const newQuery = typeof s === 'function' ? s(targetQuery) : s

    update()

    navigate(
      {
        hash: location.hash,
        search: querystring.stringify({ ...queryFromUrl, ...newQuery }, mergedStringifyOptions) || '?',
      },
      {
        replace: navigateMode === 'replace',
        state: location.state,
      },
    )
  }

  return [targetQuery, useMemoizedFn(setState)] as const
}

export { useUrlState }
