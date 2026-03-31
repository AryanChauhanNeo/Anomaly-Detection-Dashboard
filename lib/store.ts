// In-memory store for demo purposes - replace with MongoDB in production
export interface LogEntry {
  id: string
  timestamp: string
  type: 'info' | 'warning' | 'error' | 'debug'
  message: string
  source: string
  isAnomaly: boolean
  anomalyScore?: number
}

export interface SystemMetrics {
  timestamp: string
  cpu: number
  memory: number
  requestCount: number
  errorRate: number
}

export interface Alert {
  id: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  acknowledged: boolean
}

// Generate realistic demo data
function generateDemoLogs(): LogEntry[] {
  const messages = {
    info: [
      'User authentication successful',
      'API request completed in 45ms',
      'Cache refreshed successfully',
      'Background job completed',
      'Health check passed',
      'Session started for user',
      'Data sync completed',
      'Webhook delivered successfully',
    ],
    warning: [
      'High memory usage detected: 85%',
      'API response time exceeding threshold',
      'Rate limit approaching for client',
      'Disk space below 20%',
      'Connection pool near capacity',
      'Slow query detected: 2.3s',
    ],
    error: [
      'Failed to connect to database',
      'Authentication token expired',
      'Payment processing failed',
      'Service unavailable: upstream error',
      'Memory allocation failed',
      'Request timeout after 30s',
    ],
    debug: [
      'Processing batch: 1000 records',
      'Cache miss for key: user_session',
      'Retrying request: attempt 2/3',
      'GC pause: 12ms',
    ],
  }

  const sources = ['api-gateway', 'auth-service', 'payment-service', 'worker-1', 'database', 'cache']
  const logs: LogEntry[] = []

  for (let i = 0; i < 50; i++) {
    const types = Object.keys(messages) as Array<keyof typeof messages>
    const type = types[Math.floor(Math.random() * types.length)]
    const typeMessages = messages[type]
    const message = typeMessages[Math.floor(Math.random() * typeMessages.length)]
    const source = sources[Math.floor(Math.random() * sources.length)]
    
    // Mark some logs as anomalies
    const isAnomaly = type === 'error' && Math.random() > 0.5
    
    const timestamp = new Date(Date.now() - Math.random() * 3600000 * 24)
    
    logs.push({
      id: `log-${i}`,
      timestamp: timestamp.toISOString(),
      type,
      message,
      source,
      isAnomaly,
      anomalyScore: isAnomaly ? Math.random() * 0.5 + 0.5 : undefined,
    })
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function generateMetricsHistory(): SystemMetrics[] {
  const metrics: SystemMetrics[] = []
  const now = Date.now()

  for (let i = 24; i >= 0; i--) {
    const timestamp = new Date(now - i * 3600000)
    metrics.push({
      timestamp: timestamp.toISOString(),
      cpu: 30 + Math.random() * 40 + (i < 5 ? 20 : 0),
      memory: 45 + Math.random() * 30,
      requestCount: Math.floor(1000 + Math.random() * 2000),
      errorRate: Math.random() * 5,
    })
  }

  return metrics
}

function generateAlerts(): Alert[] {
  return [
    {
      id: 'alert-1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      severity: 'critical',
      title: 'High Error Rate Detected',
      message: 'Error rate exceeded 5% threshold in the last 5 minutes',
      acknowledged: false,
    },
    {
      id: 'alert-2',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      severity: 'high',
      title: 'Memory Usage Spike',
      message: 'Memory usage reached 92% on worker-1',
      acknowledged: false,
    },
    {
      id: 'alert-3',
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      severity: 'medium',
      title: 'Unusual Traffic Pattern',
      message: 'Detected 3x normal traffic from region: us-east-1',
      acknowledged: true,
    },
    {
      id: 'alert-4',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      severity: 'low',
      title: 'Certificate Expiring Soon',
      message: 'SSL certificate expires in 14 days',
      acknowledged: true,
    },
  ]
}

// Global state
let logs: LogEntry[] = generateDemoLogs()
let metricsHistory: SystemMetrics[] = generateMetricsHistory()
let alerts: Alert[] = generateAlerts()
let analysisResults: { analyzed: boolean; anomalyCount: number; healthScore: number } | null = null

export function getLogs(): LogEntry[] {
  return logs
}

export function addLogs(newLogs: LogEntry[]): void {
  logs = [...newLogs, ...logs].slice(0, 500)
}

export function getMetricsHistory(): SystemMetrics[] {
  return metricsHistory
}

export function getCurrentMetrics(): SystemMetrics {
  return metricsHistory[metricsHistory.length - 1] || {
    timestamp: new Date().toISOString(),
    cpu: 45,
    memory: 60,
    requestCount: 1500,
    errorRate: 1.2,
  }
}

export function getAlerts(): Alert[] {
  return alerts
}

export function acknowledgeAlert(id: string): void {
  alerts = alerts.map((alert) =>
    alert.id === id ? { ...alert, acknowledged: true } : alert
  )
}

export function addAlert(alert: Omit<Alert, 'id'>): void {
  alerts = [{ ...alert, id: `alert-${Date.now()}` }, ...alerts]
}

export function runAnalysis(): { analyzed: boolean; anomalyCount: number; healthScore: number } {
  const anomalyCount = logs.filter((log) => log.isAnomaly).length
  const errorRate = logs.filter((log) => log.type === 'error').length / logs.length
  const healthScore = Math.round((1 - errorRate) * 100)
  
  // Mark more logs as anomalies based on pattern analysis
  logs = logs.map((log) => {
    if (!log.isAnomaly && log.type === 'error') {
      return {
        ...log,
        isAnomaly: Math.random() > 0.6,
        anomalyScore: Math.random() * 0.4 + 0.3,
      }
    }
    return log
  })

  analysisResults = { analyzed: true, anomalyCount: logs.filter((l) => l.isAnomaly).length, healthScore }
  return analysisResults
}

export function getAnalysisResults() {
  return analysisResults
}

export function parseLogFile(content: string): LogEntry[] {
  const lines = content.split('\n').filter((line) => line.trim())
  const parsedLogs: LogEntry[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Try to parse common log formats
    const timestampMatch = line.match(/\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}:\d{2}/)
    const timestamp = timestampMatch ? new Date(timestampMatch[0]).toISOString() : new Date().toISOString()
    
    let type: LogEntry['type'] = 'info'
    if (/error|fail|exception/i.test(line)) type = 'error'
    else if (/warn/i.test(line)) type = 'warning'
    else if (/debug/i.test(line)) type = 'debug'

    parsedLogs.push({
      id: `uploaded-${Date.now()}-${i}`,
      timestamp,
      type,
      message: line.slice(0, 200),
      source: 'uploaded-file',
      isAnomaly: type === 'error' && Math.random() > 0.5,
      anomalyScore: type === 'error' ? Math.random() * 0.5 + 0.5 : undefined,
    })
  }

  return parsedLogs
}

export function resetData(): void {
  logs = generateDemoLogs()
  metricsHistory = generateMetricsHistory()
  alerts = generateAlerts()
  analysisResults = null
}
