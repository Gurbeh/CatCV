import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import { getJobDescriptionByIdAction } from '@/lib/actions/jobDescriptions'
import JobDetailClient from './JobDetailClient'

interface JobDetailPageProps {
  params: { id: string }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await getJobDescriptionByIdAction(params.id)

  if (!job) {
    notFound()
  }

  return <JobDetailClient job={job} />
}
