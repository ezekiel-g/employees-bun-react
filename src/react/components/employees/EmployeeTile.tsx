import type { Employee } from '@/zod/employee'
import { useNavigate } from 'react-router-dom'

const EmployeeTile = ({ employee }: { employee: Employee }) => {
  const navigate = useNavigate()

  return (
    <div>
      <span
        onClick={() => navigate(`/employees/details/${employee.id}`)}
        style={{ cursor: 'pointer' }}
        role="button"
      >
        {employee.lastName}
        {', '}
        {employee.firstName}
      </span>
    </div>
  )
}

export default EmployeeTile
