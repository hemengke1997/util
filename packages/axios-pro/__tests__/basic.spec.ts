import nock from 'nock'
import type { CreateAxiosOptions, RequestOptions, Result } from '../src'
import { AxiosPro, ContentTypeEnum } from '../src'

const API_URL = 'http://api.example.com'

describe('AxiosPro', () => {
  let axiosPro: AxiosPro
  let axiosOptions: CreateAxiosOptions
  let requestOptions: RequestOptions
  let nockServer: nock.Scope

  beforeEach(() => {
    axiosOptions = {
      timeout: 30 * 1000,
      headers: { 'Content-Type': ContentTypeEnum.JSON },
    }

    requestOptions = {
      joinUrlPrefix: true,
      apiUrl: API_URL,
      urlPrefix: '/v1',
      joinTime: '',
    }

    axiosPro = new AxiosPro({ requestOptions, ...axiosOptions })

    nockServer = nock(`${API_URL}/v1`)
  })

  it('should return expected data', async () => {
    nockServer.get('/data').reply(200, { foo: 'bar' })
    const response = await axiosPro.get({ url: '/data' })
    expect(response.result).toEqual({ foo: 'bar' })
  })

  it('should send a GET request', async () => {
    const response: Result = { success: true, result: 'ok' }
    nockServer.get('/test').reply(200, response)
    const result = await axiosPro.get({ url: '/test' })
    expect(result.success).toBe(true)
    expect(result.result).to.toStrictEqual(response)
  })

  it('should send a POST request', async () => {
    const response: Result = { success: true, result: 'ok' }
    nockServer.post('/test').reply(200, response)
    const result = await axiosPro.post({ url: '/test', data: { key: 'value' } })
    expect(result.success).toBe(true)
    expect(result.result).to.toStrictEqual(response)
  })

  it('should send a PUT request', async () => {
    const response: Result = { success: true, result: 'ok' }
    nockServer.put('/test').reply(200, response)
    const result = await axiosPro.put({ url: '/test', data: { key: 'value' } })
    expect(result.success).toBe(true)
    expect(result.result).to.toStrictEqual(response)
  })
})
