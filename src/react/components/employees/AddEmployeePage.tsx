import type { Department } from '@/zod/department'
import camelcaseKeys from 'camelcase-keys'
import { useCallback, useEffect, useState } from 'react'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import messageHelper from '@/util/messageHelper'
import { validateInput } from '@/util/validateInput'

const AddEmployeePage = () => {
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
  const { backEndUrl } = useAppContext()

  const addEmployee = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.scrollTo(0, 0)
    setSuccessMessages([])
    setErrorMessages([])

    const validationResult = validateInput(
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
      'INSERT',
    )

    if (!validationResult.valid) {
      setErrorMessages(validationResult.messages || [])
      return
    }

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/employees`,
      'POST',
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
      setFirstName('')
      setLastName('')
      setTitle('')
      setEmail('')
      setHireDate('')
      setDepartmentId('')
      setCountryCode('')
      setPhoneNumber('')
      setIsActive(true)
      setSuccessMessages(['Employee added successfully'])
      return
    }

    setErrorMessages(fetchResult.data?.errors || ['Error adding employee'])
  }

  const getDepartments = useCallback(async () => {
    setSuccessMessages([])
    setErrorMessages([])

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

  useEffect(() => {
    getDepartments()
  }, [getDepartments])

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
      <h2>Add Employee</h2>

      <br />
      <form onSubmit={addEmployee}>
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
              setDepartmentId(
                event.target.value === ''
                  ? ''
                  : event.target.value,
              )
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
        <button type="submit" className="btn btn-primary mb-3 rounded-0">
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddEmployeePage
