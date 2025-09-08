import { describe, it, expect } from 'vitest'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import { ResumePdf, CoverLetterPdf } from '../theme'

describe('PDF smoke', () => {
  it('renders resume pdf', async () => {
    const stream = await renderToStream(<ResumePdf json={{ basics: { name: 'Test' } }} />)
    expect(stream).toBeDefined()
  })

  it('renders cover letter pdf', async () => {
    const stream = await renderToStream(<CoverLetterPdf markdown={'Hello'} />)
    expect(stream).toBeDefined()
  })
})

