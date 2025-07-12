import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ShowDepartmentPage
  from '@/react/components/departments/ShowDepartmentPage'

const mockFetchFromBackEnd = mock(() => Promise.resolve({
  status: 200,
  statusText: 'OK',
  data: {},
  message: null,
}))

const mockShowSuccesses = mock((messages: string[]) =>
  messages.length > 0 ? [<div key="test">{messages.join(', ')}</div>] : null,
)

const mockShowErrors = mock((messages: string[]) =>
  messages.length > 0 ? [<div key="test">{messages.join(', ')}</div>] : null,
)

const mockFormatDateAndTime = mock((_date: string) => 'formatted date')

const mockAppContext = { backEndUrl: 'http://localhost:3000' }

mock.module('@/util/fetchFromBackEnd', () => ({
  default: mockFetchFromBackEnd,
}))

mock.module('@/util/messageHelper', () => ({
  default: {
    showSuccesses: mockShowSuccesses,
    showErrors: mockShowErrors,
  },
}))

mock.module('@/util/formatDateAndTime', () => ({
  default: mockFormatDateAndTime,
}))

mock.module('@/react/contexts/AppContext', () => ({
  AppContext: { Provider: ({ children, _value }: any) => children },
  useAppContext: () => mockAppContext,
}))

describe('showDepartmentPage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/departments/1']}>
        <Routes>
          <Route path="/departments/:id" element={<ShowDepartmentPage />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const departmentData = {
    id: 1,
    name: 'IT',
    code: 'IT1',
    location: 'New York',
    created_at: '2023-01-01T12:00:00Z',
    updated_at: '2023-06-01T15:00:00Z',
  }

  afterEach(() => {
    mockFetchFromBackEnd.mockClear()
    mockShowSuccesses.mockClear()
    mockShowErrors.mockClear()
    mockFormatDateAndTime.mockClear()
  })

  it('renders department details on successful fetch', async () => {
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: departmentData,
      message: null,
    })

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    expect(screen.getByText('ID')).toBeDefined()
    expect(screen.getAllByText('IT').length).toBeGreaterThan(0)
    expect(screen.getByText('IT1')).toBeDefined()
    expect(screen.getByText('New York')).toBeDefined()
    unmount()
  })

  it('displays error message on fetch failure', async () => {
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 500,
      statusText: 'Internal Server Error',
      data: undefined as any,
      message: null,
    })

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    expect(screen.getByText('Error loading department')).toBeDefined()
    unmount()
  })
})
