import { AxiosPro } from '../src'

const service = new AxiosPro({
  requestOptions: {
    apiUrl: 'https://jsonplaceholder.typicode.com',
  },
  withCredentials: true,
})

export { service }
