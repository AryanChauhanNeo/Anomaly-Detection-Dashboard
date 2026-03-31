import { NextRequest, NextResponse } from 'next/server'
import { getAlerts, acknowledgeAlert } from '@/lib/store'

export async function GET() {
  const alerts = getAlerts()
  return NextResponse.json({ alerts })
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Alert ID required' }, { status: 400 })
    }

    acknowledgeAlert(id)
    return NextResponse.json({ success: true, alerts: getAlerts() })
  } catch {
    return NextResponse.json({ error: 'Failed to update alert' }, { status: 500 })
  }
}
