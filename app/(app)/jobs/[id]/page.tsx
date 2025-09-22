import { notFound } from 'next/navigation'
import { getJobDescriptionByIdAction } from '@/lib/actions/jobDescriptions'
import JobDetailClient from './JobDetailClient'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params
  const job = await getJobDescriptionByIdAction(id)

  if (!job) {
    notFound()
  }

  return <JobDetailClient job={job} />
}
