import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import * as React from 'react'

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
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  )
}

