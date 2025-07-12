import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter } from 'react-router-dom'
import AddDepartmentPage from '@/react/components/departments/AddDepartmentPage'

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
  AppContext: { Provider: ({ children, _value }: any) => children },
  useAppContext: () => mockAppContext,
}))

describe('addDepartmentPage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <AddDepartmentPage />
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    document.body.innerHTML = ''
  })

  const departmentInput = {
    name: 'Engineering',
    code: 'ENG123',
    location: 'New York',
  }

  afterEach(() => {
    mockFetchFromBackEnd.mockClear()
    mockShowSuccesses.mockClear()
    mockShowErrors.mockClear()
    mockValidateInput.mockClear()
  })

  it('submits and shows success message on valid input', async () => {
    mock(window.scrollTo)

    mockFetchFromBackEnd.mockResolvedValue({
      status: 201,
      statusText: 'Created',
      data: {},
      message: null,
    })

    renderComponent()

    const nameInput = screen.getByLabelText('Name')
    const codeInput = screen.getByLabelText('Code')
    const locationSelect = screen.getByLabelText('Location')
    const submitButton = screen.getByText('Submit')

    fireEvent.change(nameInput, {
      target: { value: departmentInput.name },
    })
    fireEvent.change(codeInput, {
      target: { value: departmentInput.code },
    })
    fireEvent.change(locationSelect, {
      target: { value: departmentInput.location },
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    expect(screen.getByText('Department added successfully')).toBeDefined()
  })

  it('shows error message on failed API call', async () => {
    mock(window.scrollTo)

    mockFetchFromBackEnd.mockResolvedValue({
      status: 500,
      statusText: 'Internal Server Error',
      data: ['Error adding department'],
      message: null,
    })

    renderComponent()

    const nameInput = screen.getByLabelText('Name')
    const codeInput = screen.getByLabelText('Code')
    const locationSelect = screen.getByLabelText('Location')
    const submitButton = screen.getByText('Submit')

    fireEvent.change(nameInput, {
      target: { value: departmentInput.name },
    })
    fireEvent.change(codeInput, {
      target: { value: departmentInput.code },
    })
    fireEvent.change(locationSelect, {
      target: { value: departmentInput.location },
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockFetchFromBackEnd).toHaveBeenCalled()
    })

    expect(screen.getByText('Error adding department')).toBeDefined()
  })
})
