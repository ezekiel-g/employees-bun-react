import type { Department } from '@/zod/department'
import type { Employee } from '@/zod/employee'
import camelcaseKeys from 'camelcase-keys'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import messageHelper from '@/util/messageHelper'
import { validateInput } from '@/util/validateInput'

const EditEmployeePage = () => {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [departments, setDepartments] = useState<Department[]>([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [title, setTitle] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [email, setEmail] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [hireDate, setHireDate] = useState('')
  const [successMessages, setSuccessMessages] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()
  const { id } = useParams()
  const { backEndUrl } = useAppContext()

  const editEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.scrollTo(0, 0)
    setSuccessMessages([])
    setErrorMessages([])

    const validationResult = await validateInput(
      {
        firstName,
        lastName,
        title,
        departmentId,
        email,
        countryCode,
        phoneNumber,
        isActive,
        hireDate,
      },
      'employees',
      'UPDATE',
    )

    if (!validationResult.valid) {
      setErrorMessages(validationResult.messages || [])
      return
    }

    if (
      firstName === employee?.firstName
      && lastName === employee?.lastName
      && title === employee?.title
      && departmentId === employee?.departmentId?.toString()
      && email === employee?.email
      && countryCode === employee?.countryCode
      && phoneNumber === employee?.phoneNumber
      && isActive === employee?.isActive
      && hireDate
      === (employee?.hireDate
        ? new Date(employee.hireDate).toISOString().split('T')[0]
        : '')
    ) {
      setErrorMessages(['No changes detected'])
      return
    }

    if (
      !window.confirm(`Edit ${lastName}, ${firstName}?`)
    ) {
      return
    }

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${employee?.id}`,
      'PATCH',
      'application/json',
      'same-origin',
      {
        firstName,
        lastName,
        title,
        departmentId,
        email,
        countryCode,
        phoneNumber,
        isActive,
        hireDate,
      },
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const updatedEmployeeData = camelcaseKeys(fetchResult.data) as Employee

      setEmployee(updatedEmployeeData)
      setSuccessMessages(['Employee edited successfully'])
      return
    }

    setErrorMessages(fetchResult.data?.errors || ['Error editing employee'])
  }

  const getDepartments = useCallback(async () => {
    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments`,
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const camelCasedData = camelcaseKeys(fetchResult.data, { deep: true })
      setDepartments(camelCasedData)
      return
    }

    setErrorMessages(['Error loading departments'])
  }, [backEndUrl])

  const getEmployee = useCallback(async () => {
    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees/${id}`,
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const employeeData = camelcaseKeys(fetchResult.data) as Employee

      setEmployee(employeeData)
      setFirstName(employeeData.firstName || '')
      setLastName(employeeData.lastName || '')
      setTitle(employeeData.title || '')
      setDepartmentId(employeeData.departmentId?.toString() || '')
      setEmail(employeeData.email || '')
      setCountryCode(employeeData.countryCode || '')
      setPhoneNumber(employeeData.phoneNumber || '')
      setIsActive(employeeData.isActive || false)

      const fetchedHireDate = employeeData.hireDate

      if (fetchedHireDate
        && !Number.isNaN(new Date(fetchedHireDate).getTime())) {
        setHireDate(new Date(fetchedHireDate).toISOString().split('T')[0] || '')
      }
      else {
        setHireDate('')
      }

      return
    }

    setErrorMessages(['Error loading employee'])
  }, [backEndUrl, id])

  useEffect(() => {
    setSuccessMessages([])
    setErrorMessages([])
    getDepartments()
    getEmployee()
  }, [getEmployee, getDepartments])

  const successMessageDisplay = messageHelper.showSuccesses(successMessages)
  const errorMessageDisplay = messageHelper.showErrors(errorMessages)

  const departmentOptions = departments.map((department) => {
    return (
      <option key={department.id} value={department.id}>
        {department.name}
      </option>
    )
  })

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>
        Edit
        {' '}
        {lastName}
        ,
        {' '}
        {firstName}
      </h2>

      <br />
      <form onSubmit={editEmployee}>
        <div className="mb-3">
          <label htmlFor="firstName" className="form-label">
            First name
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="firstName"
            value={firstName}
            onChange={event => setFirstName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="lastName" className="form-label">
            Last name
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="lastName"
            value={lastName}
            onChange={event => setLastName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Job title
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="title"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="departmentId" className="form-label">
            Department
          </label>
          <select
            className="form-control rounded-0"
            id="departmentId"
            value={departmentId}
            onChange={(event) => {
              setDepartmentId(event.target.value)
            }}
          >
            <option value="">Select department...</option>
            {departmentOptions}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="countryCode" className="form-label">
            Country code for phone number
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="countryCode"
            value={countryCode}
            onChange={event => setCountryCode(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phoneNumber" className="form-label">
            Phone number without country code
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="phoneNumber"
            value={phoneNumber}
            onChange={event => setPhoneNumber(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="isActive" className="form-label">
            Active status
          </label>
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input rounded-0"
              id="isActive"
              checked={isActive === true}
              onChange={
                event => setIsActive(!!event.target.checked)
              }
            />
            <label className="form-check-label" htmlFor="isActive">
              Active
            </label>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="hireDate" className="form-label">
            Hire date
          </label>
          <input
            type="date"
            className="form-control rounded-0"
            id="hireDate"
            value={hireDate}
            onChange={event => setHireDate(event.target.value)}
          />
        </div>

        <br />
        <button type="submit" className="btn btn-primary mb-3 rounded-0 me-2">
          Submit
        </button>
        <button
          onClick={(event) => {
            event.preventDefault()
            navigate(`/employees/details/${employee?.id}`)
          }}
          className="btn btn-secondary mb-3 rounded-0"
        >
          Back to Details
        </button>
      </form>
    </div>
  )
}

export default EditEmployeePage
