import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { JobsTable } from '@/components/JobsTable'
import { MigrationBanner } from '@/components/MigrationBanner'
import { getAllJobDescriptionsAction } from '@/lib/actions/jobDescriptions'

export default async function DashboardPage() {
  const jobs = await getAllJobDescriptionsAction()
  
  return (
    <div className="space-y-6">
      <MigrationBanner />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Saved Applications</h1>
        <Button asChild>
          <Link href="/jobs/new">New Job</Link>
        </Button>
      </div>
      <JobsTable initialJobs={jobs} />
    </div>
  )
}
