import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewJobForm } from '@/components/NewJobForm'
import { useNavigate } from 'react-router-dom'

export default function NewJobPage() {
  const navigate = useNavigate()
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <NewJobForm onSuccess={() => navigate('/')} />
      </CardContent>
    </Card>
  )
}

