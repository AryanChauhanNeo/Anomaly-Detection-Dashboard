'use client'

import { useState, useCallback, useEffect } from 'react'
import useSWR from 'swr'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import { Header } from '@/components/dashboard/header'
import { DashboardView } from '@/components/dashboard/views/dashboard-view'
import { LogsView } from '@/components/dashboard/views/logs-view'
import { MetricsView } from '@/components/dashboard/views/metrics-view'
import { AlertsView } from '@/components/dashboard/views/alerts-view'
import type { LogEntry, SystemMetrics, Alert } from '@/lib/store'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface MetricsResponse {
  current: SystemMetrics
  history: SystemMetrics[]
  stats: { totalLogs: number; anomalyCount: number; healthScore: number }
}

interface LogsResponse {
  logs: LogEntry[]
}

interface AlertsResponse {
  alerts: Alert[]
}

export default function DashboardPage() {
  const [activeView, setActiveView] = useState('dashboard')
  
  const { data: metricsData, mutate: mutateMetrics } = useSWR<MetricsResponse>(
    '/api/metrics',
    fetcher,
    { refreshInterval: 30000 }
  )

  const { data: logsData, mutate: mutateLogs } = useSWR<LogsResponse>(
    '/api/logs',
    fetcher,
    { refreshInterval: 30000 }
  )

  const { data: alertsData, mutate: mutateAlerts } = useSWR<AlertsResponse>(
    '/api/alerts',
    fetcher,
    { refreshInterval: 10000 }
  )

  const handleRefresh = useCallback(() => {
    mutateMetrics()
    mutateLogs()
    mutateAlerts()
  }, [mutateMetrics, mutateLogs, mutateAlerts])

  const handleAcknowledgeAlert = useCallback(async (id: string) => {
    await fetch('/api/alerts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    mutateAlerts()
  }, [mutateAlerts])

  // Debug logging
  useEffect(() => {
    console.log('[v0] Dashboard data loaded:', {
      hasMetrics: !!metricsData,
      hasLogs: !!logsData,
      hasAlerts: !!alertsData,
    })
  }, [metricsData, logsData, alertsData])

  const logs = logsData?.logs ?? []
  const metrics = metricsData ?? {
    current: { timestamp: new Date().toISOString(), cpu: 45, memory: 60, requestCount: 1500, errorRate: 1.2 },
    history: [],
    stats: { totalLogs: 0, anomalyCount: 0, healthScore: 100 },
  }
  const alerts = alertsData?.alerts ?? []
  const unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged).length

  const renderView = () => {
    switch (activeView) {
      case 'logs':
        return <LogsView logs={logs} onRefresh={handleRefresh} />
      case 'metrics':
        return (
          <MetricsView
            logs={logs}
            metricsHistory={metrics.history}
            currentMetrics={metrics.current}
            stats={metrics.stats}
          />
        )
      case 'alerts':
        return <AlertsView alerts={alerts} onAcknowledge={handleAcknowledgeAlert} />
      default:
        return (
          <DashboardView
            logs={logs}
            metricsHistory={metrics.history}
            currentMetrics={metrics.current}
            stats={metrics.stats}
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onRefresh={handleRefresh}
          />
        )
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onViewChange={setActiveView} />
      <SidebarInset>
        <Header
          activeView={activeView}
          healthScore={metrics.stats.healthScore}
          unacknowledgedAlerts={unacknowledgedAlerts}
        />
        <main className="flex-1 overflow-auto p-6">
          {renderView()}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
