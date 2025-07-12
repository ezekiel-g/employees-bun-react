import { afterAll, beforeAll, describe, expect, it, mock } from 'bun:test'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'

describe('fetchFromBackEnd', () => {
  let originalConsoleError: any

  beforeAll(() => {
    originalConsoleError = console.error
    console.error = () => {}
  })

  afterAll(() => console.error = originalConsoleError)

  it('returns the correct response for a successful fetch', async () => {
    const mockResponse = { message: 'Success', data: { key: 'value' } }
    const mockJson = mock(() => Promise.resolve(mockResponse))
    const mockFetch = mock(() => Promise.resolve({
      status: 200,
      statusText: 'OK',
      json: mockJson,
    }))

    const originalFetch = globalThis.fetch
    globalThis.fetch = mockFetch as any

    const result = await fetchFromBackEnd('https://api.example.com')

    expect(result.status).toBe(200)
    expect(result.statusText).toBe('OK')
    expect(result.data).toEqual(mockResponse)
    expect(result.message).toBe('Success')
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'GET',
      headers: {},
      credentials: 'same-origin',
    })

    globalThis.fetch = originalFetch
  })

  it('returns an error message when fetch fails', async () => {
    const mockFetch = mock(() => Promise.reject(new Error('Network error')))

    const originalFetch = globalThis.fetch
    globalThis.fetch = mockFetch as any

    const result = await fetchFromBackEnd('https://api.example.com')

    expect(result.status).toBe(500)
    expect(result.statusText).toBe('Internal server error')
    expect(result.message).toBe('Network error')
    expect(result.data).toBeNull()

    globalThis.fetch = originalFetch
  })

  it('sets correct headers when provided as a string', async () => {
    const mockResponse = { message: 'Success' }
    const mockJson = mock(() => Promise.resolve(mockResponse))
    const mockFetch = mock(() => Promise.resolve({
      status: 200,
      statusText: 'OK',
      json: mockJson,
    }))

    const originalFetch = globalThis.fetch
    globalThis.fetch = mockFetch as any

    const result = await fetchFromBackEnd(
      'https://api.example.com',
      'POST',
      'application/xml',
    )

    expect(result.status).toBe(200)
    expect(result.statusText).toBe('OK')
    expect(result.message).toBe('Success')
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      credentials: 'same-origin',
    })

    globalThis.fetch = originalFetch
  })

  it('adds Content-Type header when body is provided', async () => {
    const mockResponse = { message: 'Created' }
    const mockJson = mock(() => Promise.resolve(mockResponse))
    const mockFetch = mock(() => Promise.resolve({
      status: 201,
      statusText: 'Created',
      json: mockJson,
    }))

    const originalFetch = globalThis.fetch
    globalThis.fetch = mockFetch as any

    const result = await fetchFromBackEnd(
      'https://api.example.com',
      'POST',
      {},
      'same-origin',
      { key: 'value' },
    )

    expect(result.status).toBe(201)
    expect(result.statusText).toBe('Created')
    expect(result.message).toBe('Created')
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: '{"key":"value"}',
    })

    globalThis.fetch = originalFetch
  })
})
