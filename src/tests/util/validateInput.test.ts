import { beforeEach, describe, expect, it, mock } from 'bun:test'
import { validateInput } from '@/util/validateInput'

const MockGetSchemaFunction = mock(() => ({}))

mock.module('@/util/zodHelper', () => ({
  getSchemaFunction: MockGetSchemaFunction,
}))

describe('validateInput', () => {
  let inputObject: any
  let mockSchema: any

  beforeEach(() => {
    inputObject = { firstName: 'Michael', lastName: 'Smith' }
    mockSchema = { safeParse: mock(() => ({ success: true })) }
  })

  it('returns success for valid input', () => {
    MockGetSchemaFunction.mockReturnValue(mockSchema)

    const result = validateInput(inputObject, 'users', 'INSERT')

    expect(result.valid).toBe(true)
    expect(result.messages).toBeNull()
    expect(mockSchema.safeParse).toHaveBeenCalledWith(inputObject)
  })

  it('returns validation errors for invalid input', () => {
    inputObject = { firstName: '' }
    mockSchema = {
      safeParse: mock(() => ({
        success: false,
        error: { errors: [{ message: 'required' }] },
      })),
    }
    MockGetSchemaFunction.mockReturnValue(mockSchema)

    const result = validateInput(inputObject, 'users', 'INSERT')

    expect(result.valid).toBe(false)
    expect(result.messages).toContain('required')
    expect(mockSchema.safeParse).toHaveBeenCalledWith(inputObject)
  })

  it('returns error when no schema function found', () => {
    MockGetSchemaFunction.mockReturnValue(null as any)

    const result = validateInput(inputObject, 'nonexistent', 'INSERT')

    expect(result.valid).toBe(false)
    expect((result.messages ?? []).join()).toContain('schema function')
  })

  it('handles multiple validation errors', () => {
    inputObject = { firstName: '', lastName: '' }
    mockSchema = {
      safeParse: mock(() => ({
        success: false,
        error: {
          errors: [
            { message: 'Column A required' },
            { message: 'Column B required' },
          ],
        },
      })),
    }
    MockGetSchemaFunction.mockReturnValue(mockSchema)

    const result = validateInput(inputObject, 'users', 'UPDATE')

    expect(result.valid).toBe(false)
    expect((result.messages ?? []).join()).toContain('required')
  })
})
