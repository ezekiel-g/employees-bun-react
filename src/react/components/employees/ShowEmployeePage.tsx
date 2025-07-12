import type { Department } from '@/zod/department'
import type { Employee } from '@/zod/employee'
import camelcaseKeys from 'camelcase-keys'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import formatDateAndTime from '@/util/formatDateAndTime'
import messageHelper from '@/util/messageHelper'

const ShowEmployeePage = () => {
  const [employee, setEmployee] = useState<Employee>({} as Employee)
  const [department, setDepartment] = useState<Department>({} as Department)
  const [successMessages, setSuccessMessages] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()
  const { id } = useParams()
  const { backEndUrl } = useAppContext()

  const getDepartment = useCallback(
    async (departmentId: number) => {
      const fetchResult = await fetchFromBackEnd(
        `${backEndUrl}/api/v1/departments/${departmentId}`,
      )

      if (fetchResult.status >= 200 && fetchResult.status < 300) {
        setDepartment(camelcaseKeys(fetchResult.data) as Department)
        setErrorMessages([])
        return
      }

      setErrorMessages(['Error loading department'])
    },
    [backEndUrl],
  )

  const getEmployee = useCallback(async () => {
    setSuccessMessages([])
    setErrorMessages([])

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${id}`,
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const employeeData = camelcaseKeys(fetchResult.data) as Employee
      setEmployee(employeeData)
      getDepartment(Number(employeeData.departmentId))
      return
    }

    setErrorMessages(['Error loading employee'])
  }, [backEndUrl, id, getDepartment])

  const deleteEmployee = async () => {
    setSuccessMessages([])
    setErrorMessages([])

    if (
      !window.confirm(`Delete ${employee.lastName}, ${employee.firstName}?`)
    ) {
      return
    }

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${employee.id}`,
      'DELETE',
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      alert('Employee deleted successfully')
      navigate('/')
    }

    setErrorMessages(['Error deleting employee'])
  }

  useEffect(() => {
    getEmployee()
  }, [getEmployee])

  const successMessageDisplay = messageHelper.showSuccesses(successMessages)
  const errorMessageDisplay = messageHelper.showErrors(errorMessages)

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>
        {employee.lastName}
        ,
        {employee.firstName}
      </h2>

      <br />
      <table className="table table-bordered table-dark">
        <thead>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>ID</td>
            <td>{employee.id}</td>
          </tr>
          <tr>
            <td>First name</td>
            <td>{employee.firstName}</td>
          </tr>
          <tr>
            <td>Last name</td>
            <td>{employee.lastName}</td>
          </tr>
          <tr>
            <td>Job title</td>
            <td>{employee.title}</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>{department.name}</td>
          </tr>
          <tr>
            <td>Email address</td>
            <td>{employee.email}</td>
          </tr>
          <tr>
            <td>Phone number</td>
            <td>
              {employee.countryCode}
              {employee.phoneNumber}
            </td>
          </tr>
          <tr>
            <td>Active</td>
            <td>{employee.isActive === true ? 'Yes' : 'No'}</td>
          </tr>
          <tr>
            <td>Hire date</td>
            <td>{formatDateAndTime(employee.hireDate, 'date' as any)}</td>
          </tr>
          <tr>
            <td>Date created</td>
            <td>{formatDateAndTime(employee.createdAt)}</td>
          </tr>
          <tr>
            <td>Date last updated</td>
            <td>{formatDateAndTime(employee.updatedAt)}</td>
          </tr>
        </tbody>
      </table>

      <br />
      <div className="d-flex justify-content-between">
        <button
          onClick={() => navigate(`/employees/edit/${employee.id}`)}
          className="btn btn-primary mb-3 rounded-0"
        >
          Edit
        </button>
        <button
          onClick={deleteEmployee}
          className="btn btn-danger mb-3 rounded-0"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default ShowEmployeePage
