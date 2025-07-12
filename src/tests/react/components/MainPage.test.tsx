import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, mock } from 'bun:test'
import { MemoryRouter } from 'react-router-dom'
import MainPage from '@/react/components/MainPage'

const mockDepartments = [
  { id: 1, name: 'Dept 1' },
  { id: 2, name: 'Dept 2' },
]

const MockFetchFromBackEnd = mock(() => Promise.resolve({
  status: 200,
  data: mockDepartments,
}) as any)

mock.module('@/util/fetchFromBackEnd', () => ({
  default: MockFetchFromBackEnd,
}))

describe('MainPage', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>,
    )
  }

  afterEach(() => mock.restore())

  it('renders departments on successful fetch', async () => {
    MockFetchFromBackEnd.mockReturnValue(Promise.resolve({
      status: 200,
      data: mockDepartments,
    }))

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Dept 1')).toBeDefined()
    })

    expect(screen.getByText('Dept 2')).toBeDefined()
  })

  it('displays error message on fetch failure', async () => {
    MockFetchFromBackEnd.mockReturnValue(Promise.resolve({
      status: 500,
      data: null,
    }))

    renderComponent()

    await waitFor(() => {
      expect(screen.getByText('Error loading departments')).toBeDefined()
    })
  })
})
