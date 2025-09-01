import { Button, buttonClasses } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useJobs } from '@/lib/jobsContext'
import { formatDate } from '@/lib/date'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { ExternalLink, Link as LinkIcon, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import { Link } from 'react-router-dom'

export function JobsTable() {
  const { jobs, removeJob } = useJobs()

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <ExternalLink className="h-10 w-10 opacity-60" aria-hidden />
        <p className="text-lg font-medium">No applications yet.</p>
        <p className="text-sm text-muted-foreground">Click New Job to get started.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Job Link</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.companyName}</TableCell>
            <TableCell>
              {job.jobLink ? (
                <a
                  href={job.jobLink}
                  target="_blank"
                  rel="noreferrer"
                  title={job.jobLink}
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  Open <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>{formatDate(job.createdAt)}</TableCell>
            <TableCell>
              <Badge variant="secondary">{job.status}</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Link to={`/jobs/${job.id}`} aria-label="Open details" className={buttonClasses({ variant: 'outline', size: 'sm' })}>Open</Link>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Copy job link"
                  title={job.jobLink ? 'Copy job link' : 'No link'}
                  disabled={!job.jobLink}
                  onClick={async () => {
                    try {
                      if (!job.jobLink) return
                      await navigator.clipboard.writeText(job.jobLink)
                      toast.success('Link copied')
                    } catch {
                      toast.error('Failed to copy link')
                    }
                  }}
                >
                  <LinkIcon className="h-4 w-4" />
                </Button>
                <ConfirmDialog
                  title="Delete job?"
                  description="This will permanently remove the job."
                  confirmText="Delete"
                  onConfirm={() => {
                    removeJob(job.id)
                    toast.success('Deleted')
                  }}
                  trigger={
                    <Button variant="destructive" size="sm" aria-label="Delete job">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
