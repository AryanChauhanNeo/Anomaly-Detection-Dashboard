'use client'

import { AlertCircle, AlertTriangle, Info, XCircle, Check, Bell } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Alert } from '@/lib/store'

interface AlertsPanelProps {
  alerts: Alert[]
  onAcknowledge: (id: string) => void
  compact?: boolean
}

const severityConfig = {
  critical: {
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    badgeVariant: 'destructive' as const,
  },
  high: {
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/20',
    badgeVariant: 'outline' as const,
  },
  medium: {
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    borderColor: 'border-warning/20',
    badgeVariant: 'outline' as const,
  },
  low: {
    icon: Info,
    color: 'text-chart-1',
    bgColor: 'bg-chart-1/10',
    borderColor: 'border-chart-1/20',
    badgeVariant: 'outline' as const,
  },
}

export function AlertsPanel({ alerts, onAcknowledge, compact = false }: AlertsPanelProps) {
  const unacknowledged = alerts.filter((a) => !a.acknowledged)
  const acknowledged = alerts.filter((a) => a.acknowledged)

  const AlertItem = ({ alert }: { alert: Alert }) => {
    const config = severityConfig[alert.severity]
    const Icon = config.icon

    return (
      <div
        className={`
          flex items-start gap-4 rounded-lg border p-4 transition-colors
          ${config.bgColor} ${config.borderColor}
          ${alert.acknowledged ? 'opacity-60' : ''}
        `}
      >
        <div className={`mt-0.5 rounded-full p-1.5 ${config.bgColor}`}>
          <Icon className={`size-4 ${config.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm">{alert.title}</h4>
            <Badge
              variant={config.badgeVariant}
              className={`capitalize ${config.badgeVariant === 'outline' ? `${config.color} ${config.borderColor}` : ''}`}
            >
              {alert.severity}
            </Badge>
            {alert.acknowledged && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Check className="size-3 mr-1" />
                Acknowledged
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
        {!alert.acknowledged && !compact && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAcknowledge(alert.id)}
            className="shrink-0"
          >
            <Check className="size-3 mr-1" />
            Acknowledge
          </Button>
        )}
      </div>
    )
  }

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              <CardTitle className="text-base">Recent Alerts</CardTitle>
            </div>
            {unacknowledged.length > 0 && (
              <Badge variant="destructive">{unacknowledged.length} Active</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
            {alerts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No alerts at this time
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              {unacknowledged.length} active alert{unacknowledged.length !== 1 ? 's' : ''} requiring attention
            </CardDescription>
          </div>
          {unacknowledged.length > 0 && (
            <Badge variant="destructive" className="gap-1">
              <AlertCircle className="size-3" />
              {unacknowledged.length} Active
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {unacknowledged.length > 0 && (
            <div className="space-y-3 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground">Active Alerts</h3>
              {unacknowledged.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          )}
          
          {acknowledged.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Acknowledged</h3>
              {acknowledged.map((alert) => (
                <AlertItem key={alert.id} alert={alert} />
              ))}
            </div>
          )}

          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-success/10 p-3 mb-3">
                <Check className="size-6 text-success" />
              </div>
              <p className="font-medium">All Clear</p>
              <p className="text-sm text-muted-foreground">
                No system alerts at this time
              </p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
