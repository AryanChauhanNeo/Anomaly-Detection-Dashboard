'use client'

import MetricsCards from '@/components/dashboard/metrics-cards'
import { CpuChart } from '@/components/dashboard/cpu-chart'
import { MemoryChart } from '@/components/dashboard/memory-chart'
import { AnomalyChart } from '@/components/dashboard/anomaly-chart'
import { LogsTable } from '@/components/dashboard/logs-table'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { AnalysisPanel } from '@/components/dashboard/analysis-panel'
import type { LogEntry, SystemMetrics, Alert } from '@/lib/store'

interface DashboardViewProps {
  logs: LogEntry[]
  metricsHistory: SystemMetrics[]
  currentMetrics: SystemMetrics
  stats: { totalLogs: number; anomalyCount: number; healthScore: number }
  alerts: Alert[]
  onAcknowledgeAlert: (id: string) => void
  onRefresh: () => void
}

export function DashboardView({
  logs,
  metricsHistory,
  currentMetrics,
  stats,
  alerts,
  onAcknowledgeAlert,
  onRefresh,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor your AI system&apos;s health and performance
        </p>
      </div>

      <MetricsCards
        totalLogs={stats.totalLogs}
        anomalyCount={stats.anomalyCount}
        healthScore={stats.healthScore}
        cpu={currentMetrics.cpu}
        memory={currentMetrics.memory}
        requestCount={currentMetrics.requestCount}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <CpuChart data={metricsHistory} />
        <MemoryChart data={metricsHistory} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AnomalyChart logs={logs} />
        </div>
        <AnalysisPanel onAnalysisComplete={onRefresh} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LogsTable logs={logs.slice(0, 10)} showFilters={false} />
        </div>
        <AlertsPanel alerts={alerts} onAcknowledge={onAcknowledgeAlert} compact />
      </div>
    </div>
  )
}
