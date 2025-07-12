import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import EditEmployeePage
  from '@/react/components/employees/EditEmployeePage'

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

const mockValidateInput = mock(() => ({ valid: true, messages: [] }))
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

describe('editEmployeePage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter initialEntries={['/employees/edit/1']}>
        <Routes>
          <Route
            path="/employees/edit/:id"
            element={<EditEmployeePage />}
          />
        </Routes>
      </MemoryRouter>,
    )
  }

  const originalEmployee = {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    title: 'Developer',
    department_id: 1,
    email: 'john.doe@example.com',
    country_code: '1',
    phone_number: '1234567890',
    is_active: true,
    hire_date: '2020-01-01',
  }

  const updatedEmployee = {
    firstName: 'Michael',
    lastName: 'Smith',
    title: 'Senior Developer',
    departmentId: 1,
    email: 'michael.smith@example.com',
    countryCode: '1',
    phoneNumber: '9876543210',
    isActive: false,
    hireDate: '2021-05-10',
  }

  const departments = [{ id: 1, name: 'IT' }]

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
      data: departments,
      message: null,
    })
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: originalEmployee,
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
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: updatedEmployee.firstName },
    })
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: updatedEmployee.lastName },
    })
    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: updatedEmployee.title },
    })
    fireEvent.change(screen.getByLabelText('Department'), {
      target: { value: updatedEmployee.departmentId },
    })
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: updatedEmployee.email },
    })
    fireEvent.change(screen.getByLabelText('Country code for phone number'), {
      target: { value: updatedEmployee.countryCode },
    })
    fireEvent.change(
      screen.getByLabelText('Phone number without country code'),
      {
        target: { value: updatedEmployee.phoneNumber },
      },
    )
    fireEvent.click(screen.getByLabelText('Active status'))
    fireEvent.change(screen.getByLabelText('Hire date'), {
      target: { value: updatedEmployee.hireDate },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(3)
    })

    expect(screen.getByText('Employee edited successfully')).toBeDefined()
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
      data: departments,
      message: null,
    })
    mockFetchFromBackEnd.mockResolvedValueOnce({
      status: 200,
      statusText: 'OK',
      data: originalEmployee,
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
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: updatedEmployee.firstName },
    })
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: updatedEmployee.lastName },
    })
    fireEvent.change(screen.getByLabelText('Job title'), {
      target: { value: updatedEmployee.title },
    })
    fireEvent.change(screen.getByLabelText('Department'), {
      target: { value: updatedEmployee.departmentId },
    })
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: updatedEmployee.email },
    })
    fireEvent.change(screen.getByLabelText('Country code for phone number'), {
      target: { value: updatedEmployee.countryCode },
    })
    fireEvent.change(
      screen.getByLabelText('Phone number without country code'),
      {
        target: { value: updatedEmployee.phoneNumber },
      },
    )
    fireEvent.click(screen.getByLabelText('Active status'))
    fireEvent.change(screen.getByLabelText('Hire date'), {
      target: { value: updatedEmployee.hireDate },
    })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(3)
    })

    expect(screen.getByText('Error editing employee')).toBeDefined()
    unmount()
  })
})
