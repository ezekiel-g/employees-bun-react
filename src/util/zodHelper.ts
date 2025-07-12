import {
  InsertDepartmentSchema,
  UpdateDepartmentSchema,
} from '@/zod/department'
import { InsertEmployeeSchema, UpdateEmployeeSchema } from '@/zod/employee'

const schemaMap = {
  departments: {
    INSERT: InsertDepartmentSchema,
    UPDATE: UpdateDepartmentSchema,
  },
  employees: {
    INSERT: InsertEmployeeSchema,
    UPDATE: UpdateEmployeeSchema,
  },
}

export const getSchemaFunction = (
  tableName: string,
  queryType: string,
) => {
  const tableInMap = schemaMap[tableName as keyof typeof schemaMap]

  if (!tableInMap)
    throw new Error(`No schema for table '${tableName}'`)

  const schemaFunction = tableInMap[queryType as keyof typeof tableInMap]

  if (!schemaFunction) {
    throw new Error(`No schema for ${queryType} on table '${tableName}'`)
  }

  return schemaFunction
}
