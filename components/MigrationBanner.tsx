'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/sonner'
import { migrateFromLocalStorage, checkForLegacyData, clearLegacyData } from '@/lib/migration/migrateLegacyData'

export function MigrationBanner() {
  const [hasLegacyData, setHasLegacyData] = React.useState(false)
  const [isMigrating, setIsMigrating] = React.useState(false)
  const [isDismissed, setIsDismissed] = React.useState(false)

  React.useEffect(() => {
    const legacyData = checkForLegacyData()
    setHasLegacyData(!!legacyData)
  }, [])

  const handleMigrate = async () => {
    const legacyData = checkForLegacyData()
    if (!legacyData) return

    setIsMigrating(true)
    try {
      const result = await migrateFromLocalStorage(legacyData)
      
      if (result.success) {
        clearLegacyData()
        toast.success(`Successfully migrated ${result.migratedCount} of ${result.totalCount} jobs!`)
        setHasLegacyData(false)
        setIsDismissed(true)
        // Refresh the page to show the migrated data
        window.location.reload()
      } else {
        toast.error(result.error || 'Migration failed')
      }
    } catch (error) {
      toast.error('Failed to migrate data')
    } finally {
      setIsMigrating(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  if (!hasLegacyData || isDismissed) {
    return null
  }

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
      <CardHeader>
        <CardTitle className="text-amber-800 dark:text-amber-200">
          Migrate Your Existing Data
        </CardTitle>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          We found job data stored locally on your device. Would you like to migrate it to your secure cloud account?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3">
          <Button 
            onClick={handleMigrate} 
            disabled={isMigrating}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isMigrating ? 'Migrating...' : 'Migrate Data'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDismiss}
            disabled={isMigrating}
          >
            Dismiss
          </Button>
        </div>
        <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
          Your data will be securely stored in your cloud account and accessible from any device.
        </p>
      </CardContent>
    </Card>
  )
}
