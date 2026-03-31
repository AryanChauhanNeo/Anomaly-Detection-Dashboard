'use client'

import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import type { Alert } from '@/lib/store'

interface AlertsViewProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
}

export function AlertsView({ alerts, onAcknowledge }: AlertsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-muted-foreground">
          View and manage system alerts and notifications
        </p>
      </div>

      <AlertsPanel alerts={alerts} onAcknowledge={onAcknowledge} />
    </div>
  )
}
