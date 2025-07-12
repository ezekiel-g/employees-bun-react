import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditDepartmentPage
  from '@/react/components/departments/EditDepartmentPage'

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

const mockValidateInput = mock(() => Promise.resolve({
  valid: true,
  messages: [],
}))

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

mock.module('@/util/validateInput', () => ({
  validateInput: mockValidateInput,
}))

mock.module('@/react/contexts/AppContext', () => ({
  AppContext: {
    Provider: ({ children, _value }: any) => children,
  },
  useAppContext: () => mockAppContext,
}))

describe('editDepartmentPage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/departments/edit/1']}>
        <Routes>
          <Route
            path="/departments/edit/:id"
            element={<EditDepartmentPage />}
          />
        </Routes>
      </MemoryRouter>,
    )
  }

  const originalDepartment = {
    id: 1,
    name: 'Original Department Name',
    code: 'ORIG123',
    location: 'London',
  }

  const updatedDepartment = {
    name: 'Updated Department Name',
    code: 'UPD123',
    location: 'New York',
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    mockFetchFromBackEnd.mockClear()
    mockShowSuccesses.mockClear()
    mockShowErrors.mockClear()
    mockValidateInput.mockClear()
  })

  it('submits and shows success message on valid edit', async () => {
    mock(window.scrollTo)
    const mockConfirm = mock(() => true)
    Object.defineProperty(window, 'confirm', {
      value: mockConfirm,
      writable: true,
    })

    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: originalDepartment,
      message: null,
    })
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: {},
      message: null,
    })

    const { unmount } = renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: updatedDepartment.name },
    })
    fireEvent.change(screen.getByLabelText('Code'), {
      target: { value: updatedDepartment.code },
    })
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: updatedDepartment.location },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Department edited successfully')).toBeDefined()
    unmount()
  })

  it('shows error message on failed API call', async () => {
    mock(window.scrollTo)
    const mockConfirm = mock(() => true)
    Object.defineProperty(window, 'confirm', {
      value: mockConfirm,
      writable: true,
    })

    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: originalDepartment,
      message: null,
    })
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

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: updatedDepartment.name },
    })
    fireEvent.change(screen.getByLabelText('Code'), {
      target: { value: updatedDepartment.code },
    })
    fireEvent.change(screen.getByLabelText('Location'), {
      target: { value: updatedDepartment.location },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Error editing department')).toBeDefined()
    unmount()
  })
})
