import React from 'react'
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({ page: { padding: 28 }, h1: { fontSize: 20, marginBottom: 8 }, p: { fontSize: 12, marginBottom: 6 } })

export function ResumePdf({ json }: { json: unknown }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Resume</Text>
        <View>
          <Text style={styles.p}>{typeof json === 'string' ? json : JSON.stringify(json, null, 2)}</Text>
        </View>
      </Page>
    </Document>
  )
}

export function CoverLetterPdf({ markdown }: { markdown: string }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Cover Letter</Text>
        <View>
          <Text style={styles.p}>{markdown}</Text>
        </View>
      </Page>
    </Document>
  )
}

