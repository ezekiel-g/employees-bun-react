import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ShowEmployeePage
  from '@/react/components/employees/ShowEmployeePage'

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

const mockFormatDateAndTime = mock(
  (_date: string, _format?: string) => 'formatted date',
)

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

describe('showEmployeePage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/employees/1']}>
        <Routes>
          <Route path="/employees/:id" element={<ShowEmployeePage />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const employeeData = {
    id: 1,
    first_name: 'Alice',
    last_name: 'Smith',
    title: 'Manager',
    department_id: 1,
    email: 'alice.smith@example.com',
    country_code: '1',
    phone_number: '5551234567',
    is_active: true,
    hire_date: '2024-05-01T00:00:00',
    created_at: '2025-06-10T01:26:09',
    updated_at: '2025-06-10T01:26:09',
  }

  const departmentData = { id: 2, name: 'IT' }

  afterEach(() => {
    mockFetchFromBackEnd.mockClear()
    mockShowSuccesses.mockClear()
    mockShowErrors.mockClear()
    mockFormatDateAndTime.mockClear()
  })

  it('renders employee details on successful fetch', async () => {
    mockFetchFromBackEnd
      .mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        data: employeeData,
        message: null,
      })
      .mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        data: departmentData,
        message: null,
      })

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Smith')).toBeDefined()
    expect(screen.getByText('Alice')).toBeDefined()
    expect(screen.getByText('Manager')).toBeDefined()
    expect(screen.getByText('IT')).toBeDefined()
    expect(screen.getByText('alice.smith@example.com')).toBeDefined()
    expect(screen.getByText('15551234567')).toBeDefined()
    expect(screen.getByText('Yes')).toBeDefined()
    expect(screen.getAllByText('formatted date').length).toBeGreaterThan(0)
    unmount()
  })

  it('displays error message on employee fetch failure', async () => {
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

    expect(screen.getByText('Error loading employee')).toBeDefined()
    unmount()
  })
})
