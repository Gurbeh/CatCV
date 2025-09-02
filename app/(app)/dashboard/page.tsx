import Link from 'next/link'
import { buttonClasses } from '@/components/ui/button'
import { JobsTable } from '@/components/JobsTable'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Saved Applications</h1>
        <Link href="/jobs/new" className={buttonClasses({})}>New Job</Link>
      </div>
      <JobsTable />
    </div>
  )
}

