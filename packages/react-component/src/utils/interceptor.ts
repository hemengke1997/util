import { isPromise } from '@minko-fe/lodash-pro'

export type Interceptor = (...args: any[]) => Promise<boolean> | boolean

export function callInterceptor(options: {
  interceptor?: Function
  args: any[]
  done: () => void
  canceled?: () => void
}) {
  const { interceptor, args, done, canceled } = options

  if (interceptor) {
    // eslint-disable-next-line prefer-spread
    const returnVal = interceptor.apply(null, args || [])

    if (isPromise(returnVal)) {
      returnVal
        .then((value) => {
          if (value) {
            done()
          } else if (canceled) {
            canceled()
          }
        })
        .catch(() => {})
    } else if (returnVal) {
      done()
    } else if (canceled) {
      canceled()
    }
  } else {
    done()
  }
}
