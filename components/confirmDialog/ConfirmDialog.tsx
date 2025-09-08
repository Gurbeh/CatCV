import { Button } from '@/components/ui/button'
import * as React from 'react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  title?: string
  description?: string
  confirmText?: string
  trigger: React.ReactNode
  onConfirm: () => void
}

export function ConfirmDialog({
  title = 'Are you sure?'
  , description = 'This action cannot be undone.',
  confirmText = 'Confirm',
  trigger,
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false)
  const overlayRef = React.useRef<HTMLDivElement | null>(null)
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  return (
    <div className="inline">
      <span onClick={() => setOpen(true)} className="inline-flex">{trigger}</span>
      {open ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-40 bg-black/50"
          onClick={(e) => {
            if (e.target === overlayRef.current) setOpen(false)
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className={cn(
              'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-background p-6 shadow-lg',
            )}
          >
            <div className="flex flex-col space-y-1.5">
              <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} aria-label="Cancel">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onConfirm()
                  setOpen(false)
                }}
                aria-label={confirmText}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
