import type { ZodIssue } from 'zod'
import { getSchemaFunction } from '@/util/zodHelper'

export const validateInput = (
  inputObject: object,
  tableName: string,
  queryType: 'INSERT' | 'UPDATE',
): { valid: boolean, messages: string[] | null } => {
  let valid = true
  let messages: string[] | null = null

  const schemaFunction = getSchemaFunction(tableName, queryType)

  if (schemaFunction) {
    const result = schemaFunction.safeParse(inputObject)

    if (!result.success) {
      valid = false
      messages = result.error.errors.map((e: ZodIssue) => e.message)
    }
  }
  else {
    valid = false
    messages = [`No schema function found for table '${tableName}'`]
  }

  return { valid, messages }
}
