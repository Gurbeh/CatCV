'use client'
import * as React from 'react'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useJobs } from '@/lib/jobsContext'
import { toast } from '@/components/ui/sonner'
import { analyzeJob } from '@/ai/placeholders'
import { nanoid } from 'nanoid'
import type { Job } from '@/lib/types'

const FormSchema = z.object({
  companyName: z.string().min(1, 'Company is required'),
  jobLink: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().url('Enter a valid URL').optional(),
  ),
  jobText: z.string().min(1, 'Job description is required'),
})

type FormValues = z.infer<typeof FormSchema>

interface NewJobFormProps {
  onSuccess: () => void
}

export function NewJobForm({ onSuccess }: NewJobFormProps) {
  const { createJob } = useJobs()
  const [values, setValues] = React.useState<FormValues>({
    companyName: '',
    jobLink: '',
    jobText: '',
  })
  const [errors, setErrors] = React.useState<Partial<Record<keyof FormValues, string>>>({})
  const [submitting, setSubmitting] = React.useState(false)

  const validate = React.useCallback(
    (next: FormValues) => {
      const res = FormSchema.safeParse(next)
      if (!res.success) {
        const fieldErrors: Partial<Record<keyof FormValues, string>> = {}
        for (const issue of res.error.issues) {
          const path = issue.path[0] as keyof FormValues
          if (!fieldErrors[path]) fieldErrors[path] = issue.message
        }
        setErrors(fieldErrors)
        return false
      }
      setErrors({})
      return true
    },
    [setErrors],
  )

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    const next = { ...values, [name]: value } as FormValues
    setValues(next)
    validate(next)
  }

  const onPasteHere = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const next = { ...values, jobText: text }
      setValues(next)
      validate(next)
      toast.success('Pasted from clipboard')
    } catch {
      toast.error('Clipboard access denied')
    }
  }

  const isValid = React.useMemo(() => FormSchema.safeParse(values).success, [values])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setSubmitting(true)
    try {
      const now = new Date().toISOString()
      const previewJob: Job = {
        id: nanoid(),
        companyName: values.companyName,
        jobLink: values.jobLink,
        jobText: values.jobText,
        createdAt: now,
        updatedAt: now,
        status: 'saved',
      }
      await analyzeJob(previewJob)
      createJob(values)
      toast.success('Saved. Analysis will come in a future release.')
      onSuccess()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-describedby="new-job-form">
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          value={values.companyName}
          onChange={onChange}
          required
          aria-invalid={!!errors.companyName}
          aria-describedby={errors.companyName ? 'companyName-error' : undefined}
        />
        {errors.companyName ? (
          <p id="companyName-error" className="text-sm text-destructive">
            {errors.companyName}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor="jobLink">Job Link</Label>
        <Input
          id="jobLink"
          name="jobLink"
          type="url"
          value={values.jobLink}
          onChange={onChange}
          aria-invalid={!!errors.jobLink}
          aria-describedby={errors.jobLink ? 'jobLink-error' : undefined}
        />
        {errors.jobLink ? (
          <p id="jobLink-error" className="text-sm text-destructive">
            {errors.jobLink}
          </p>
        ) : null}
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="jobText">Job Description</Label>
          <Button type="button" variant="secondary" size="sm" onClick={onPasteHere} aria-label="Paste from clipboard">
            Paste here
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Paste the Job Description below.</p>
        <Textarea
          id="jobText"
          name="jobText"
          value={values.jobText}
          onChange={onChange}
          required
          rows={12}
          aria-invalid={!!errors.jobText}
          aria-describedby={errors.jobText ? 'jobText-error' : undefined}
        />
        {errors.jobText ? (
          <p id="jobText-error" className="text-sm text-destructive">
            {errors.jobText}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button type="submit" disabled={!isValid || submitting} aria-disabled={!isValid || submitting}>
          Analyze
        </Button>
      </div>
    </form>
  )
}
