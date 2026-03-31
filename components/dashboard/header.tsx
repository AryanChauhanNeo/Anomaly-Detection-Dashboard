'use client'

import { Activity, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface HeaderProps {
  activeView: string
  healthScore: number
  unacknowledgedAlerts: number
}

const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  logs: 'Logs',
  metrics: 'Metrics',
  alerts: 'Alerts',
}

export function Header({ activeView, healthScore, unacknowledgedAlerts }: HeaderProps) {
  const getHealthStatus = () => {
    if (healthScore >= 90) return { icon: CheckCircle, color: 'text-success', label: 'Healthy' }
    if (healthScore >= 70) return { icon: AlertTriangle, color: 'text-warning', label: 'Warning' }
    return { icon: XCircle, color: 'text-destructive', label: 'Critical' }
  }

  const status = getHealthStatus()
  const StatusIcon = status.icon

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">AI Monitor</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{viewTitles[activeView] || 'Dashboard'}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="size-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground hidden sm:inline">System Status:</span>
          <div className="flex items-center gap-1.5">
            <StatusIcon className={`size-4 ${status.color}`} />
            <span className={`text-sm font-medium ${status.color}`}>{status.label}</span>
          </div>
        </div>
        {unacknowledgedAlerts > 0 && (
          <Badge variant="destructive" className="gap-1">
            {unacknowledgedAlerts} Active Alert{unacknowledgedAlerts > 1 ? 's' : ''}
          </Badge>
        )}
      </div>
    </header>
  )
}
