import { z } from 'zod'

export const InsertDepartmentSchema = z.object({
  name: z
    .string({ required_error: 'Name required' })
    .min(1, 'Name required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return /^[A-Z0-9][A-Z0-9 \-'",.]{0,98}[A-Z0-9]$/i.test(value)
      },
      'Name can be maximum 100 characters and can contain only letters, '
      + 'numbers, spaces, hyphens, apostrophes and periods',
    ),
  code: z
    .string({ required_error: 'Code required' })
    .min(1, 'Code required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return /^[A-Z][A-Z0-9]{0,19}$/.test(value)
      },
      'Code can be maximum 20 characters and can contain only numbers and '
      + 'capital letters',
    ),
  location: z
    .string({ required_error: 'Location required' })
    .min(1, 'Location required')
    .refine(
      (value) => {
        if (value.length === 0)
          return true
        return ['New York', 'San Francisco', 'London'].includes(value)
      },
      'Location not currently valid',
    ),
  isActive: z.boolean().optional(),
})

export const UpdateDepartmentSchema = InsertDepartmentSchema.partial()

export const DepartmentSchema = InsertDepartmentSchema.extend({
  id: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type CreateDepartmentInput = z.infer<typeof InsertDepartmentSchema>
export type UpdateDepartmentInput = z.infer<typeof UpdateDepartmentSchema>
export type Department = z.infer<typeof DepartmentSchema>
