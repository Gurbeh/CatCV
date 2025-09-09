'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useJobs } from '@/lib/jobsContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonClasses } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import * as React from 'react'
import { tailorResumeAndCoverLetter } from '@/ai/placeholders'
import type { JsonResume } from '@/lib/types/json-resume'

export default function JobDetailPage() {
  const params = useParams()
  const raw = (params as Record<string, string | string[] | undefined>).id
  const id = Array.isArray(raw) ? raw[0] : raw
  const { jobs, updateJob } = useJobs()
  const job = jobs.find((j) => j.id === id)

  const [baseResumeJson, setBaseResumeJson] = React.useState('')
  const [generating, setGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!job) {
    return (
      <div className="space-y-4">
        <p>Job not found.</p>
        <Link href="/" className={buttonClasses({ variant: 'outline' })}>Back</Link>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.companyName}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {job.jobLink ? (
            <a href={job.jobLink} target="_blank" rel="noreferrer" title={job.jobLink} className="hover:underline">
              Job posting
            </a>
          ) : (
            <span className="text-muted-foreground">No link</span>
          )}
          <Badge variant="secondary">{job.status}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">Created: {formatDate(job.createdAt)}</div>
        <div>
          <h2 className="mb-2 text-sm font-medium">Job Description</h2>
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">{job.jobText}</pre>
        </div>
        <div>
          <h2 className="mb-2 text-sm font-medium">Base JSON Resume</h2>
          <p className="text-sm text-muted-foreground mb-2">Paste your JSON Resume (v1) below. This is used for tailoring.</p>
          <Textarea
            value={baseResumeJson}
            onChange={(e) => setBaseResumeJson(e.target.value)}
            rows={10}
            placeholder={'{ "basics": { "name": "..." } }'}
          />
          <div className="mt-2 flex items-center justify-end">
            <Button
              onClick={async () => {
                setError(null)
                setGenerating(true)
                try {
                  const parsed = JSON.parse(baseResumeJson) as JsonResume
                  const result = await tailorResumeAndCoverLetter({ baseResume: parsed, job })
                  updateJob(job.id, {
                    status: 'analyzed',
                    tailoredResume: result.tailoredResume,
                    coverLetter: result.coverLetter,
                  })
                } catch (e) {
                  const message = e instanceof Error ? e.message : 'Failed to generate'
                  setError(message)
                } finally {
                  setGenerating(false)
                }
              }}
              disabled={generating || !baseResumeJson.trim()}
              aria-disabled={generating || !baseResumeJson.trim()}
            >
              {generating ? 'Generating…' : 'Generate tailored resume + cover letter'}
            </Button>
          </div>
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
        </div>
        {job.tailoredResume ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium">Results</h2>
            <div>
              <h3 className="mb-1 text-sm">Tailored JSON Resume</h3>
              <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-xs">{JSON.stringify(job.tailoredResume, null, 2)}</pre>
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(job.tailoredResume, null, 2)], { type: 'application/json' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `tailored-resume-${job.companyName}.json`
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                >
                  Download JSON
                </Button>
              </div>
            </div>
            {job.coverLetter ? (
              <div>
                <h3 className="mb-1 text-sm">Cover Letter</h3>
                <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">{job.coverLetter}</pre>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([job.coverLetter!], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `cover-letter-${job.companyName}.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Download .txt
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
