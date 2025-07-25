import { useState } from 'react'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import messageHelper from '@/util/messageHelper'
import { validateInput } from '@/util/validateInput'

const AddDepartmentPage = () => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [location, setLocation] = useState('')
  const [successMessages, setSuccessMessages] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const { backEndUrl } = useAppContext()

  const addDepartment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    window.scrollTo(0, 0)
    setSuccessMessages([])
    setErrorMessages([])

    const validationResult = validateInput(
      { name, code, location },
      'departments',
      'INSERT',
    )

    if (!validationResult.valid) {
      setErrorMessages(validationResult.messages || [])
      return
    }

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments`,
      'POST',
      'application/json',
      'same-origin',
      { name, code, location },
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      setName('')
      setCode('')
      setLocation('')
      setSuccessMessages(['Department added successfully'])
      return
    }

    setErrorMessages(fetchResult.data?.errors || ['Error adding department'])
  }

  const successMessageDisplay = messageHelper.showSuccesses(successMessages)
  const errorMessageDisplay = messageHelper.showErrors(errorMessages)

  return (
    <div className="container col-md-10 offset-md-1 my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <h2>Add Department</h2>

      <br />
      <form onSubmit={addDepartment}>
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
        <button type="submit" className="btn btn-primary mb-3 rounded-0">
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddDepartmentPage
