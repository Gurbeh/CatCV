import { buttonClasses } from '@/components/ui/button'
import { JobsTable } from '@/components/JobsTable'
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Your Saved Applications</h1>
        <Link to="/jobs/new" className={buttonClasses({})}>New Job</Link>
      </div>
      <JobsTable />
    </div>
  )
}
