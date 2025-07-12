import type { Department } from '@/zod/department'
import camelcaseKeys from 'camelcase-keys'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import messageHelper from '@/util/messageHelper'
import { validateInput } from '@/util/validateInput'

const EditDepartmentPage = () => {
  const [department, setDepartment] = useState<Department>({} as Department)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [location, setLocation] = useState('')
  const [successMessages, setSuccessMessages] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const navigate = useNavigate()
  const { id } = useParams()
  const { backEndUrl } = useAppContext()

  const editDepartment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.scrollTo(0, 0)
    setSuccessMessages([])
    setErrorMessages([])

    const validationResult = await validateInput(
      { name, code, location },
      'departments',
      'UPDATE',
    )

    if (!validationResult.valid) {
      setErrorMessages(validationResult.messages || [])
      return
    }

    if (
      name === department?.name
      && code === department?.code
      && location === department?.location
    ) {
      setErrorMessages(['No changes detected'])
      return
    }

    if (!window.confirm(`Edit ${department.name}?`))
      return

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments/${department.id}`,
      'PATCH',
      'application/json',
      'same-origin',
      { name, code, location },
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const updatedDepartmentData = camelcaseKeys(
        fetchResult.data,
      ) as Department

      setDepartment(updatedDepartmentData)
      setSuccessMessages(['Department edited successfully'])
      return
    }

    setErrorMessages(fetchResult.data?.errors || ['Error editing department'])
  }

  const getDepartment = useCallback(async () => {
    setSuccessMessages([])
    setErrorMessages([])

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments/${id}`,
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const departmentData = camelcaseKeys(fetchResult.data) as Department

      setDepartment(departmentData)
      setName(departmentData.name ?? '')
      setCode(departmentData.code ?? '')
      setLocation(departmentData.location ?? '')
      return
    }

    setErrorMessages(['Error loading department'])
  }, [backEndUrl, id])

  useEffect(() => {
    getDepartment()
  }, [getDepartment])

  const successMessageDisplay = messageHelper.showSuccesses(successMessages)
  const errorMessageDisplay = messageHelper.showErrors(errorMessages)

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>
        Edit
        {department.name}
      </h2>

      <br />
      <form onSubmit={editDepartment}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="code" className="form-label">
            Code
          </label>
          <input
            type="text"
            className="form-control rounded-0"
            id="code"
            value={code}
            onChange={event => setCode(event.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <select
            className="form-control rounded-0"
            id="location"
            value={location}
            onChange={event => setLocation(event.target.value)}
          >
            <option value="">Select location...</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="London">London</option>
          </select>
        </div>

        <br />
        <button type="submit" className="btn btn-primary mb-3 rounded-0 me-2">
          Submit
        </button>
        <button
          onClick={(event) => {
            event.preventDefault()
            navigate(`/departments/details/${department.id}`)
          }}
          className="btn btn-secondary mb-3 rounded-0"
        >
          Back to Details
        </button>
      </form>
    </div>
  )
}

export default EditDepartmentPage
