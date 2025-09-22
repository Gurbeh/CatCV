"use client"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate } from '@/lib/date'
import { ExternalLink, Link as LinkIcon, Trash2 } from 'lucide-react'
import { toast } from '@/components/ui/sonner'
import Link from 'next/link'
import { ConfirmDialog } from '@/components/confirmDialog/ConfirmDialog'
import { deleteJobDescriptionAction } from '@/lib/actions/jobDescriptions'
import type { JobDescription } from '@/lib/db/schema'

interface JobsTableProps {
  initialJobs: JobDescription[]
}

export function JobsTable({ initialJobs }: JobsTableProps) {
  if (initialJobs.length === 0) {
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
        {initialJobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.companyName}</TableCell>
            <TableCell>
              {job.jobUrl ? (
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  title={job.jobUrl}
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  Open <ExternalLink className="h-4 w-4" />
                </a>
              ) : (
                <span className="text-muted-foreground">—</span>
              )}
            </TableCell>
            <TableCell>{formatDate(job.createdAt.toString())}</TableCell>
            <TableCell>
              <Badge variant="secondary">Saved</Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/jobs/${job.id}`} aria-label="Open details">Open</Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  aria-label="Copy job link"
                  title={job.jobUrl ? 'Copy job link' : 'No link'}
                  disabled={!job.jobUrl}
                  onClick={async () => {
                    try {
                      if (!job.jobUrl) return
                      await navigator.clipboard.writeText(job.jobUrl)
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
                  onConfirm={async () => {
                    const result = await deleteJobDescriptionAction(job.id)
                    if (result.success) {
                      toast.success('Deleted')
                      // Refresh the page to update the list
                      window.location.reload()
                    } else {
                      toast.error(result.error || 'Failed to delete')
                    }
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
