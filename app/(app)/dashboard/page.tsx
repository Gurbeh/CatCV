import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { JobsTable } from '@/components/JobsTable'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Saved Applications</h1>
        <Button asChild>
          <Link href="/jobs/new">New Job</Link>
        </Button>
      </div>
      <JobsTable />
    </div>
  )
}
