'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts'
import type { LogEntry } from '@/lib/store'

interface AnomalyChartProps {
  logs: LogEntry[]
}

export function AnomalyChart({ logs }: AnomalyChartProps) {
  // Group logs by hour and count anomalies
  const hourlyData: Record<string, { hour: string; anomalies: number; normal: number }> = {}
  
  logs.forEach((log) => {
    const hour = new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (!hourlyData[hour]) {
      hourlyData[hour] = { hour, anomalies: 0, normal: 0 }
    }
    if (log.isAnomaly) {
      hourlyData[hour].anomalies++
    } else {
      hourlyData[hour].normal++
    }
  })

  const chartData = Object.values(hourlyData).slice(-12)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Trend</CardTitle>
        <CardDescription>Detected anomalies distribution over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="hour"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
              />
              <Bar dataKey="anomalies" name="Anomalies" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.anomalies > 2 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-4))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
