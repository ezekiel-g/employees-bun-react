import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AddDepartmentPage from '@/react/components/departments/AddDepartmentPage'
import EditDepartmentPage
  from '@/react/components/departments/EditDepartmentPage'
import ShowDepartmentPage
  from '@/react/components/departments/ShowDepartmentPage'
import AddEmployeePage from '@/react/components/employees/AddEmployeePage'
import EditEmployeePage from '@/react/components/employees/EditEmployeePage'
import ShowEmployeePage from '@/react/components/employees/ShowEmployeePage'
import MainPage from '@/react/components/MainPage'
import Navbar from '@/react/components/Navbar'

const App = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading)
    return <div>Loading...</div>

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/departments/details/:id"
          element={<ShowDepartmentPage />}
        />
        <Route path="/departments/add" element={<AddDepartmentPage />} />
        <Route path="/departments/edit/:id" element={<EditDepartmentPage />} />
        <Route path="/employees/details/:id" element={<ShowEmployeePage />} />
        <Route path="/employees/add" element={<AddEmployeePage />} />
        <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
