import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'bun:test'
import React from 'react'
import { AppContext, useAppContext } from '@/react/contexts/AppContext'

describe('appContext', () => {
  const TestComponent = () => {
    const { backEndUrl } = useAppContext()
    return <div data-testid="context-value">{backEndUrl}</div>
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('provides back-end URL for development', () => {
    render(
      <AppContext.Provider value={{ backEndUrl: 'http://localhost:3000' }}>
        <TestComponent />
      </AppContext.Provider>,
    )

    expect(screen.getByTestId('context-value').textContent).toBe(
      'http://localhost:3000',
    )
  })

  it('provides back-end URL for production', () => {
    const customUrl = 'https://production-url.com'

    render(
      <AppContext.Provider value={{ backEndUrl: customUrl }}>
        <TestComponent />
      </AppContext.Provider>,
    )

    expect(screen.getByTestId('context-value').textContent).toBe(customUrl)
  })

  it('returns context value from useAppContext hook', () => {
    const testUrl = 'https://test-api.example.com'

    render(
      <AppContext.Provider value={{ backEndUrl: testUrl }}>
        <TestComponent />
      </AppContext.Provider>,
    )

    expect(screen.getByTestId('context-value').textContent).toBe(testUrl)
  })
})
