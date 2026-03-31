import { NextRequest, NextResponse } from 'next/server'
import { getLogs, addLogs, parseLogFile } from '@/lib/store'

export async function GET() {
  const logs = getLogs()
  return NextResponse.json({ logs })
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const content = await file.text()
    const parsedLogs = parseLogFile(content)
    addLogs(parsedLogs)

    return NextResponse.json({ 
      success: true, 
      logsAdded: parsedLogs.length,
      logs: getLogs()
    })
  } catch {
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
  }
}
