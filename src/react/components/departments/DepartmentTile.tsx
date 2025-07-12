import type { Department } from '@/zod/department'
import type { Employee } from '@/zod/employee'
import camelcaseKeys from 'camelcase-keys'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EmployeeTile from '@/react/components/employees/EmployeeTile'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import messageHelper from '@/util/messageHelper'

const DepartmentTile = ({ department }: { department: Department }) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [successMessages, setSuccessMessages] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()
  const { backEndUrl } = useAppContext()

  const getEmployees = useCallback(async () => {
    setSuccessMessages([])
    setErrorMessages([])

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees`,
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const camelCasedData = camelcaseKeys(fetchResult.data, { deep: true })
      const departmentEmployees = camelCasedData.filter(
        (employee: Employee) => employee.departmentId === department.id,
      )
      const sortedEmployees = departmentEmployees.sort(
        (a: Employee, b: Employee) => a.lastName.localeCompare(b.lastName),
      )

      setEmployees(sortedEmployees)
      return
    }

    setErrorMessages(['Error loading employees'])
  }, [backEndUrl, department.id])

  useEffect(() => {
    getEmployees()
  }, [getEmployees])

  const successMessageDisplay = messageHelper.showSuccesses(successMessages)
  const errorMessageDisplay = messageHelper.showErrors(errorMessages)

  const employeeDisplay = employees.map((employee, index) => {
    return (
      <EmployeeTile key={index} employee={employee} />
    )
  })

  return (
    <div className="p-2">
      {successMessageDisplay}
      {errorMessageDisplay}
      <span
        onClick={() => navigate(`/departments/details/${department.id}`)}
        style={{ cursor: 'pointer' }}
        role="button"
      >
        <h2>{department.name}</h2>
      </span>
      {employeeDisplay}
    </div>
  )
}

export default DepartmentTile
