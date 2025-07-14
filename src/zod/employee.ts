import { z } from 'zod'

const nameRegex = /^\p{L}(?:[\p{L}'\- ]{0,98}\p{L})?$/u
const emailRegex = /^[\w.%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const countryCodeRegex = /^\d{1,4}$/
const phoneNumberRegex = /^\d{7,15}$/

export const InsertEmployeeSchema = z.object({
  firstName: z
    .string({ required_error: 'First name required' })
    .min(1, 'First name required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return nameRegex.test(value)
      },
      'First name can be maximum 100 characters and can contain only letters, '
      + 'apostrophes, hyphens and spaces between words',
    ),
  lastName: z
    .string({ required_error: 'Last name required' })
    .min(1, 'Last name required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return nameRegex.test(value)
      },
      'Last name can be maximum 100 characters and can contain only letters, '
      + 'apostrophes, hyphens and spaces between words',
    ),
  title: z
    .string({ required_error: 'Job title required' })
    .min(1, 'Job title required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return nameRegex.test(value)
      },
      'Job title can be maximum 100 characters and can contain only letters, '
      + 'apostrophes, hyphens and spaces between words',
    ),
  departmentId: z
    .string({ required_error: 'Department required' })
    .min(1, 'Department required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return /^\d+$/.test(value)
      },
      'Department invalid',
    )
    .or(z.number({ required_error: 'Department required' })),
  email: z
    .string({ required_error: 'Email address required' })
    .min(1, 'Email address required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return emailRegex.test(value)
      },
      'Email address must have a valid format',
    ),
  countryCode: z
    .string({ required_error: 'Country code required' })
    .min(1, 'Country code required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return countryCodeRegex.test(value)
      },
      'Country code must be between 1 and 4 digits and contain only digits',
    ),
  phoneNumber: z
    .string({ required_error: 'Phone number required' })
    .min(1, 'Phone number required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return phoneNumberRegex.test(value)
      },
      'Phone number must be between 7 and 15 digits and contain only digits',
    ),
  isActive: z.boolean().optional(),
  hireDate: z
    .string({ required_error: 'Hire date required' })
    .min(1, 'Hire date required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return !Number.isNaN(Date.parse(value))
      },
      'Hire date required',
    ),
})

export const UpdateEmployeeSchema = InsertEmployeeSchema.partial()

export const EmployeeSchema = InsertEmployeeSchema.extend({
  id: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type CreateEmployeeInput = z.infer<typeof InsertEmployeeSchema>
export type UpdateEmployeeInput = z.infer<typeof UpdateEmployeeSchema>
export type Employee = z.infer<typeof EmployeeSchema>
