import { useParams, Link } from 'react-router-dom'
import { useJobs } from '@/lib/jobsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { jobs } = useJobs()
  const job = jobs.find((j) => j.id === id)

  if (!job) {
    return (
      <div className="space-y-4">
        <p>Job not found.</p>
        <Button asChild variant="outline">
          <Link to="/">Back</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.companyName}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {job.jobLink ? (
            <a href={job.jobLink} target="_blank" rel="noreferrer" className="hover:underline">
              Job posting
            </a>
          ) : (
            <span className="text-muted-foreground">No link</span>
          )}
          <Badge variant="secondary">{job.status}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Created: {formatDate(job.createdAt)}
        </div>
        <div>
          <h2 className="mb-2 text-sm font-medium">Job Description</h2>
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">{job.jobText}</pre>
        </div>
        <Button asChild variant="outline">
          <Link to="/">Back</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
