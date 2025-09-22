'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/date'
import { Textarea } from '@/components/ui/textarea'
import * as React from 'react'
import { tailorResumeAndCoverLetter } from '@/ai/placeholders'
import { updateJobDescriptionAction } from '@/lib/actions/jobDescriptions'
import type { JsonResume } from '@/lib/types/json-resume'
import type { JobDescription } from '@/lib/db/schema'
import { toast } from '@/components/ui/sonner'

interface JobDetailClientProps {
  job: JobDescription
}

export default function JobDetailClient({ job }: JobDetailClientProps) {
  const [baseResumeJson, setBaseResumeJson] = React.useState('')
  const [generating, setGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Extract legacy data from metadata if it exists
  const legacyData = job.metadata as Record<string, unknown> | null
  const hasTailoredResume = (legacyData as { legacyTailoredResume?: unknown } | null)?.legacyTailoredResume
  const hasCoverLetter = (legacyData as { legacyCoverLetter?: string } | null)?.legacyCoverLetter

  return (
    <Card>
      <CardHeader>
        <CardTitle>{job.companyName}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {job.jobUrl ? (
            <a href={job.jobUrl} target="_blank" rel="noreferrer" title={job.jobUrl} className="hover:underline">
              Job posting
            </a>
          ) : (
            <span className="text-muted-foreground">No link</span>
          )}
          <Badge variant="secondary">Saved</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">Created: {formatDate(job.createdAt.toString())}</div>
        <div>
          <h2 className="mb-2 text-sm font-medium">Job Description</h2>
          <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">{job.description}</pre>
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
                  
                  // Create a legacy job object for the AI function
                  const legacyJob = {
                    id: job.id,
                    companyName: job.companyName,
                    jobLink: job.jobUrl ?? undefined,
                    jobText: job.description,
                    createdAt: job.createdAt.toString(),
                    updatedAt: job.updatedAt.toString(),
                    status: 'saved' as const,
                  }
                  
                  const result = await tailorResumeAndCoverLetter({ baseResume: parsed, job: legacyJob })
                  
                  // Update the job description with the results
                  await updateJobDescriptionAction(job.id, {
                    metadata: {
                      ...legacyData,
                      legacyTailoredResume: result.tailoredResume,
                      legacyCoverLetter: result.coverLetter,
                    }
                  })
                  
                  toast.success('Tailored resume and cover letter generated!')
                  
                  // Refresh the page to show the results
                  window.location.reload()
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
        {hasTailoredResume ? (
          <div className="space-y-3">
            <h2 className="text-sm font-medium">Results</h2>
            <div>
              <h3 className="mb-1 text-sm">Tailored JSON Resume</h3>
              <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-xs">{JSON.stringify(hasTailoredResume, null, 2)}</pre>
              <div className="mt-2 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(hasTailoredResume, null, 2)], { type: 'application/json' })
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
            {hasCoverLetter ? (
              <div>
                <h3 className="mb-1 text-sm">Cover Letter</h3>
                <pre className="whitespace-pre-wrap rounded-md border bg-muted/30 p-3 text-sm">{hasCoverLetter}</pre>
                <div className="mt-2 flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const blob = new Blob([hasCoverLetter], { type: 'text/plain' })
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
