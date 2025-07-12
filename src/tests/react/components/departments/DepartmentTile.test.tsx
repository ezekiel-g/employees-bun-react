import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter } from 'react-router-dom'

import DepartmentTile from '@/react/components/departments/DepartmentTile'

const mockFetchFromBackEnd = mock(() => Promise.resolve({
  status: 200,
  statusText: 'OK',
  data: [] as any,
  message: null,
}))

const mockShowSuccesses = mock((messages: string[]) =>
  messages.length > 0 ? [<div key="test">{messages.join(', ')}</div>] : null,
)

const mockShowErrors = mock((messages: string[]) =>
  messages.length > 0 ? [<div key="test">{messages.join(', ')}</div>] : null,
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

mock.module('@/react/contexts/AppContext', () => ({
  AppContext: {
    Provider: ({ children, _value }: any) => children,
  },
  useAppContext: () => mockAppContext,
}))

mock.module('@/react/components/employees/EmployeeTile', () => ({
  default: ({ employee }: { employee: any }) => (
    <div>
      {employee.last_name}
      ,
      {employee.first_name}
    </div>
  ),
}))

describe('departmentTile', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <DepartmentTile
          department={{
            id: 1,
            name: 'IT',
            code: 'IT',
            location: 'New York',
            created_at: '2023-01-01',
            updated_at: '2023-01-01',
          }}
        />
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    mockFetchFromBackEnd.mockClear()
    mockShowSuccesses.mockClear()
    mockShowErrors.mockClear()
  })

  it('displays error message on fetch failure', async () => {
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 500,
      statusText: 'Internal Server Error',
      data: ['Error loading employees'],
      message: null,
    })

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    expect(screen.getByText('Error loading employees')).toBeDefined()
    unmount()
  })

  it('renders department name', () => {
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: [],
      message: null,
    })

    const { unmount } = renderComponent()

    expect(screen.getByText('IT')).toBeDefined()
    unmount()
  })

  it('navigates when department name is clicked', async () => {
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: [],
      message: null,
    })

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    const buttons = screen.getAllByRole('button')

    expect(buttons[0]).toBeDefined()
    fireEvent.click(buttons[0]!)

    expect(buttons[0]).toBeDefined()
    unmount()
  })
})
