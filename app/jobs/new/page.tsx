"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewJobForm } from '@/components/NewJobForm'
import { useRouter } from 'next/navigation'

export default function NewJobPage() {
  const router = useRouter()
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Job</CardTitle>
      </CardHeader>
      <CardContent>
        <NewJobForm onSuccess={() => router.push('/')} />
      </CardContent>
    </Card>
  )
}

