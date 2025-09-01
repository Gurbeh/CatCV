import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Welcome to CatCV</CardTitle>
          <CardDescription>
            Paste a job description and save opportunities to revisit later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate('/')}>Continue</Button>
            <p className="text-center text-xs text-muted-foreground">Authentication will be added later.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
