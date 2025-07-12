import type { Department } from '@/zod/department'
import camelcaseKeys from 'camelcase-keys'
import { useCallback, useEffect, useState } from 'react'
import DepartmentTile from '@/react/components/departments/DepartmentTile'
import { useAppContext } from '@/react/contexts/AppContext'
import fetchFromBackEnd from '@/util/fetchFromBackEnd'
import messageHelper from '@/util/messageHelper'

const MainPage = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [successMessages, setSuccessMessages] = useState<string[]>([])
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const { backEndUrl } = useAppContext()

  const getDepartments = useCallback(async () => {
    setSuccessMessages([])
    setErrorMessages([])

    const fetchResult = await fetchFromBackEnd(
      `${backEndUrl}/api/v1/departments`,
    )

    if (fetchResult.status >= 200 && fetchResult.status < 300) {
      const camelCasedData = camelcaseKeys(fetchResult.data, { deep: true })
      const sortedData = camelCasedData.sort(
        (a: Department, b: Department) => a.name.localeCompare(b.name),
      )

      setDepartments(sortedData)
      return
    }

    setErrorMessages(['Error loading departments'])
  }, [backEndUrl])

  useEffect(() => {
    getDepartments()
  }, [getDepartments])

  const successMessageDisplay = messageHelper.showSuccesses(successMessages)
  const errorMessageDisplay = messageHelper.showErrors(errorMessages)

  const departmentDisplay = departments.map((department, index) => {
    return (
      <div key={index} className="col-12 col-sm-6 col-lg-4 mb-3">
        <div className="card border border-light rounded-0">
          <DepartmentTile key={index} department={department} />
        </div>
      </div>
    )
  })

  return (
    <div className="container my-4">
      {successMessageDisplay}
      {errorMessageDisplay}
      <div className="container">
        <div className="row">{departmentDisplay}</div>
      </div>
    </div>
  )
}

export default MainPage
