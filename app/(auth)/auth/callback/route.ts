import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const returnTo = url.searchParams.get('returnTo') || '/dashboard'
  return NextResponse.redirect(new URL(returnTo, url.origin))
}

