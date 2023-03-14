import type { Mocked } from 'vitest'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { service } from './service'

vi.mock('./service.ts')

const mockedService = service as Mocked<typeof service>

export const fetchUsers = async () => {
  return await service.get({ url: '/users' })
}

export const createUser = async (user) => {
  return await service.post({ url: '/users', data: user })
}

describe('request methods', () => {
  beforeEach(() => {
    mockedService.get.mockReset()
    mockedService.post.mockReset()
  })

  describe('fetch users', () => {
    test('makes a GET request to fetch users', async () => {
      const usersMock = [{ id: 1 }, { id: 2 }]
      mockedService.get.mockResolvedValue({
        result: usersMock,
        success: true,
      })

      const users = (await fetchUsers()).result

      expect(mockedService.get).toHaveBeenCalledWith({ url: '/users' })
      expect(users).toStrictEqual(usersMock)
    })
  })

  describe('createUser', () => {
    test('makes a POST request to create a new user', async () => {
      const newUserPayload = {
        name: 'john doe',
      }
      const newUserMock = {
        id: 1,
        ...newUserPayload,
      }
      mockedService.post.mockResolvedValue({
        result: newUserMock,
      })

      const newUser = (await createUser(newUserPayload)).result

      expect(mockedService.post).toHaveBeenCalledWith({ url: '/users', data: newUserPayload })
      expect(newUser).toStrictEqual(newUserMock)
    })
  })

  describe('request failed', async () => {
    test('f', async () => {
      // const users = await fetchUsers()
    })
  })
})
