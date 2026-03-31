'use client'

import  MetricsCards  from '@/components/dashboard/metrics-cards'
import { CpuChart } from '@/components/dashboard/cpu-chart'
import { MemoryChart } from '@/components/dashboard/memory-chart'
import { AnomalyChart } from '@/components/dashboard/anomaly-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import type { LogEntry, SystemMetrics } from '@/lib/store'

interface MetricsViewProps {
  logs: LogEntry[]
  metricsHistory: SystemMetrics[]
  currentMetrics: SystemMetrics
  stats: { totalLogs: number; anomalyCount: number; healthScore: number }
}

export function MetricsView({ logs, metricsHistory, currentMetrics, stats }: MetricsViewProps) {
  const requestData = metricsHistory.map((item) => ({
    time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    requests: item.requestCount,
    errorRate: item.errorRate,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Metrics</h1>
        <p className="text-muted-foreground">
          Detailed system performance metrics and trends
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

      <Card>
        <CardHeader>
          <CardTitle>Request Throughput & Error Rate</CardTitle>
          <CardDescription>API requests per hour and error rate percentage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={requestData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="errorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 10]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="requests"
                  name="Requests/hr"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  fill="url(#requestGradient)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="errorRate"
                  name="Error Rate %"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  fill="url(#errorGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <AnomalyChart logs={logs} />
    </div>
  )
}
