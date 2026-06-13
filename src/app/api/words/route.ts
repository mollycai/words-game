import { NextResponse } from 'next/server'

// POST /api/words - Parse uploaded Excel file (server-side fallback for future use)
export async function POST(request: Request) {
  // v1: Not implemented — parsing is done client-side.
  // v2: Move xlsx parsing here for server-side processing.
  return NextResponse.json({ message: 'Not implemented in v1' }, { status: 501 })
}

// GET /api/words - List available word sets (scaffold for future DB)
export async function GET() {
  // v1: Not implemented — words are cached in localStorage.
  // v2: Return word sets from database.
  return NextResponse.json({ message: 'Not implemented in v1' }, { status: 501 })
}
