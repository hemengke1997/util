import { cloneDeep, deepMerge, isFunction, isString } from '@minko-fe/lodash-pro'
import querystring from 'query-string'
import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'
import { AxiosCanceler } from './axiosCancel'
import { joinTimestamp } from './utils'

export interface RequestOptions {
  joinUrlPrefix?: boolean
  apiUrl?: string
  urlPrefix?: string
  joinTime?: string
  ignoreRepeatRequest?: boolean
}

export interface Result<T = any> {
  success: boolean
  result: T
  nativeResponse?: AxiosResponse<Result<T> | unknown>
}

export interface UploadFileParams {
  data?: Record<string, any>
  name?: string
  file: File | Blob
  filename?: string
  [key: string]: any
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  transform?: AxiosTransform
  requestOptions?: RequestOptions
}

export type ResponseErrorType = AxiosError & {
  config: CreateAxiosOptions
}

export abstract class AxiosTransform<T = any> {
  beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig

  transformResponseHook?: (res: AxiosResponse<Result>) => Result<T>

  requestCatchHook?: (e: ResponseErrorType, options: RequestOptions) => Result<T>

  requestInterceptors?: (config: AxiosRequestConfig, options: CreateAxiosOptions) => AxiosRequestConfig

  responseInterceptors?: (res: AxiosResponse<any>) => AxiosResponse<any>

  requestInterceptorsCatch?: (error: Error) => Promise<any> | undefined

  responseInterceptorsCatch?: (error: ResponseErrorType) => Promise<any> | undefined
}
export enum ContentTypeEnum {
  /**
   * json
   */
  JSON = 'application/json;charset=UTF-8',
  /**
   * 表单
   */
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  /**
   * 文件上传
   */
  FORM_DATA = 'multipart/form-data;charset=UTF-8', // 文件
}

export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
}

export const defaultTransform: AxiosTransform = {
  transformResponseHook: (res: AxiosResponse<Result>) => {
    const { data } = res || {}

    if (!data) {
      return {
        success: false,
        result: null,
        nativeResponse: res,
      }
    }

    const isSuccess = res.status === 200

    if (isSuccess) {
      return {
        success: true,
        result: data,
        nativeResponse: res,
      }
    }

    return {
      success: false,
      result: data,
      nativeResponse: res,
    }
  },

  beforeRequestHook: (config, options) => {
    const { apiUrl, joinUrlPrefix, joinTime = '', urlPrefix } = options

    if (joinUrlPrefix) {
      config.url = `${urlPrefix}${config.url}`
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }

    const params = config.params || {}

    const data = config.data || false
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      } else {
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    } else {
      if (config.method?.toUpperCase() === RequestEnum.POST && !config.headers?.['Content-Type']) {
        config.headers = {
          ...config.headers,
          'Content-Type': ContentTypeEnum.FORM_URLENCODED,
        }
      }
      if (!isString(params)) {
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data
          config.params = params
        } else {
          config.data = params
          config.params = undefined
        }
      } else {
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  requestInterceptors: (config) => {
    config.headers = Object.assign({}, config.headers)

    return config
  },

  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  responseInterceptorsCatch: (error) => {
    return Promise.reject(error)
  },

  requestCatchHook: (error) => {
    const { response } = error || {}
    return {
      success: false,
      result: response?.data || null,
      nativeResponse: response,
    }
  },
}

export const defaultOptions: CreateAxiosOptions = {
  timeout: 30 * 1000,
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  transform: defaultTransform,
  requestOptions: {
    joinUrlPrefix: true,
    apiUrl: '',
    urlPrefix: '',
    joinTime: '',
  },
  paramsSerializer: {
    serialize: (params) => querystring.stringify(params, { arrayFormat: 'bracket' }),
  },
}

export { deepMerge as mergeOptions } from '@minko-fe/lodash-pro'

export class AxiosPro {
  private axiosInstance: AxiosInstance
  readonly options: CreateAxiosOptions

  constructor(options: CreateAxiosOptions) {
    this.options = deepMerge(defaultOptions, options)
    this.axiosInstance = axios.create(options)

    this.setupInterceptors()
  }

  private createAxios(options: CreateAxiosOptions): void {
    this.axiosInstance = axios.create(options)
  }

  getTransform() {
    const { transform } = this.options
    return transform
  }

  getAxiosInstance() {
    return this.axiosInstance
  }

  reconfigAxios(options: CreateAxiosOptions) {
    if (!this.axiosInstance) return
    this.createAxios(options)
  }

  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return
    }
    Object.assign(this.axiosInstance.defaults.headers, headers)
  }

  private setupInterceptors() {
    const transform = this.getTransform()
    if (!transform) return

    const axiosCanceler = new AxiosCanceler()

    const { requestInterceptors, requestInterceptorsCatch, responseInterceptors, responseInterceptorsCatch } = transform

    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      const ignoreRepeatRequest = this.options.requestOptions?.ignoreRepeatRequest

      ignoreRepeatRequest && axiosCanceler.addPending(config)
      if (requestInterceptors && isFunction(requestInterceptors)) {
        config = requestInterceptors(config, this.options)
      }
      return config as InternalAxiosRequestConfig
    }, undefined)

    requestInterceptorsCatch &&
      isFunction(requestInterceptorsCatch) &&
      this.axiosInstance.interceptors.request.use(undefined, requestInterceptorsCatch)

    this.axiosInstance.interceptors.response.use((res: AxiosResponse<any>) => {
      res && axiosCanceler.removePending(res.config)
      if (responseInterceptors && isFunction(responseInterceptors)) {
        res = responseInterceptors(res)
      }
      return res
    }, undefined)

    responseInterceptorsCatch &&
      isFunction(responseInterceptorsCatch) &&
      this.axiosInstance.interceptors.response.use(undefined, responseInterceptorsCatch)
  }

  uploadFile<T = Result>(config: AxiosRequestConfig) {
    const formData = new window.FormData()

    if (config.data) {
      Object.keys(config.data).forEach((key) => {
        const value = config.data![key]
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item)
          })
          return
        }

        formData.append(key, config.data![key])
      })
    }

    config.data = formData

    return this.request<T>({
      ...config,
      method: 'POST',
    })
  }

  supportFormData(config: AxiosRequestConfig) {
    const headers = config.headers || this.options.headers
    const contentType = headers?.['Content-Type'] || headers?.['content-type']

    if (
      contentType !== ContentTypeEnum.FORM_URLENCODED ||
      !Reflect.has(config, 'data') ||
      config.method?.toUpperCase() === RequestEnum.GET
    ) {
      return config
    }

    return {
      ...config,
      data: querystring.stringify(config.data, { arrayFormat: 'bracket' }),
    }
  }

  get<T = Result>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options)
  }

  post<T = Result>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options)
  }

  put<T = Result>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options)
  }

  delete<T = Result>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options)
  }

  patch<T = Result>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PATCH' }, options)
  }

  request<T = Result>(config: AxiosRequestConfig, options?: RequestOptions) {
    let conf: CreateAxiosOptions = cloneDeep(config)
    const transform = this.getTransform()

    const { requestOptions } = this.options

    const opt: RequestOptions = Object.assign({}, requestOptions, options)

    const { beforeRequestHook, requestCatchHook, transformResponseHook } = transform || {}
    if (beforeRequestHook && isFunction(beforeRequestHook)) {
      conf = beforeRequestHook(conf, opt)
    }

    conf.requestOptions = opt

    conf = this.supportFormData(conf)

    return new Promise<T>((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformResponseHook && isFunction(transformResponseHook)) {
            try {
              const ret = transformResponseHook(res) as unknown as T
              resolve(ret)
            } catch (err) {
              reject(err || new Error('[axios-pro]: request error!'))
            }
            return
          }
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: ResponseErrorType) => {
          if (axios.isCancel(e)) {
            return
          }

          if (requestCatchHook && isFunction(requestCatchHook)) {
            resolve(requestCatchHook(e, opt) as unknown as Promise<T>)
            return
          }
          if (axios.isAxiosError(e)) {
            // TODO
          }
          reject(e)
        })
    })
  }
}
