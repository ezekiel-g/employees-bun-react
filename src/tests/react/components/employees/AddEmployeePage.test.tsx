import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter } from 'react-router-dom'
import AddEmployeePage from '@/react/components/employees/AddEmployeePage'

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

describe('addEmployeePage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AddEmployeePage />
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const employeeInput = {
    firstName: 'Jane',
    lastName: 'Doe',
    title: 'Engineer',
    departmentId: '1',
    email: 'jane.doe@example.com',
    countryCode: '1',
    phoneNumber: '5551234567',
    isActive: true,
    hireDate: '2023-01-01',
  }

  const departmentData = [{ id: 1, name: 'IT' }]

  afterEach(() => {
    mockFetchFromBackEnd.mockClear()
    mockShowSuccesses.mockClear()
    mockShowErrors.mockClear()
    mockValidateInput.mockClear()
  })

  it('submits and shows success message on valid input', async () => {
    mock(window.scrollTo)

    mockFetchFromBackEnd
      .mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        data: departmentData,
        message: null,
      })
      .mockResolvedValueOnce({
        status: 201,
        statusText: 'Created',
        data: {},
        message: null,
      })

    renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    const firstNameInput = screen.getByLabelText('First name')
    const lastNameInput = screen.getByLabelText('Last name')
    const titleInput = screen.getByLabelText('Job title')
    const departmentSelect = screen.getByLabelText('Department')
    const emailInput = screen.getByLabelText('Email address')
    const countryCodeInput = screen.getByLabelText(
      'Country code for phone number',
    )
    const phoneNumberInput = screen.getByLabelText(
      'Phone number without country code',
    )
    const isActiveCheckbox = screen.getByLabelText('Active status')
    const hireDateInput = screen.getByLabelText('Hire date')
    const submitButton = screen.getByText('Submit')

    fireEvent.change(firstNameInput, {
      target: { value: employeeInput.firstName },
    })
    fireEvent.change(lastNameInput, {
      target: { value: employeeInput.lastName },
    })
    fireEvent.change(titleInput, {
      target: { value: employeeInput.title },
    })
    fireEvent.change(departmentSelect, {
      target: { value: employeeInput.departmentId },
    })
    fireEvent.change(emailInput, {
      target: { value: employeeInput.email },
    })
    fireEvent.change(countryCodeInput, {
      target: { value: employeeInput.countryCode },
    })
    fireEvent.change(phoneNumberInput, {
      target: { value: employeeInput.phoneNumber },
    })
    fireEvent.click(isActiveCheckbox)
    fireEvent.change(hireDateInput, {
      target: { value: employeeInput.hireDate },
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Employee added successfully')).toBeDefined()
  })

  it('shows error message on failed API call', async () => {
    mock(window.scrollTo)

    mockFetchFromBackEnd
      .mockResolvedValueOnce({
        status: 200,
        statusText: 'OK',
        data: departmentData,
        message: null,
      })
      .mockResolvedValueOnce({
        status: 500,
        statusText: 'Internal Server Error',
        data: ['Error adding employee'],
        message: null,
      })

    renderComponent()

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    const firstNameInput = screen.getByLabelText('First name')
    const lastNameInput = screen.getByLabelText('Last name')
    const titleInput = screen.getByLabelText('Job title')
    const departmentSelect = screen.getByLabelText('Department')
    const emailInput = screen.getByLabelText('Email address')
    const countryCodeInput = screen.getByLabelText(
      'Country code for phone number',
    )
    const phoneNumberInput = screen.getByLabelText(
      'Phone number without country code',
    )
    const isActiveCheckbox = screen.getByLabelText('Active status')
    const hireDateInput = screen.getByLabelText('Hire date')
    const submitButton = screen.getByText('Submit')

    fireEvent.change(firstNameInput, {
      target: { value: employeeInput.firstName },
    })
    fireEvent.change(lastNameInput, {
      target: { value: employeeInput.lastName },
    })
    fireEvent.change(titleInput, {
      target: { value: employeeInput.title },
    })
    fireEvent.change(departmentSelect, {
      target: { value: employeeInput.departmentId },
    })
    fireEvent.change(emailInput, {
      target: { value: employeeInput.email },
    })
    fireEvent.change(countryCodeInput, {
      target: { value: employeeInput.countryCode },
    })
    fireEvent.change(phoneNumberInput, {
      target: { value: employeeInput.phoneNumber },
    })
    fireEvent.click(isActiveCheckbox)
    fireEvent.change(hireDateInput, {
      target: { value: employeeInput.hireDate },
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalledTimes(2)
    })

    expect(screen.getByText('Error adding employee')).toBeDefined()
  })
})
