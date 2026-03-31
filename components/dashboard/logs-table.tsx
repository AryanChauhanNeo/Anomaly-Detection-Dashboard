'use client'

import { useState } from 'react'
import { AlertTriangle, Info, Bug, AlertCircle, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { LogEntry } from '@/lib/store'

interface LogsTableProps {
  logs: LogEntry[]
  showFilters?: boolean
}

const typeIcons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  debug: Bug,
}

const typeColors = {
  info: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  debug: 'bg-muted text-muted-foreground border-muted',
}

export function LogsTable({ logs, showFilters = true }: LogsTableProps) {
  const [search, setSearch] = useState('')
  const [typeFilters, setTypeFilters] = useState<Set<string>>(new Set(['info', 'warning', 'error', 'debug']))
  const [showAnomaliesOnly, setShowAnomaliesOnly] = useState(false)

  const toggleTypeFilter = (type: string) => {
    const newFilters = new Set(typeFilters)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    setTypeFilters(newFilters)
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase())
    const matchesType = typeFilters.has(log.type)
    const matchesAnomaly = !showAnomaliesOnly || log.isAnomaly
    return matchesSearch && matchesType && matchesAnomaly
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>
              Showing {filteredLogs.length} of {logs.length} logs
            </CardDescription>
          </div>
          {showFilters && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 sm:w-[200px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(['info', 'warning', 'error', 'debug'] as const).map((type) => (
                    <DropdownMenuCheckboxItem
                      key={type}
                      checked={typeFilters.has(type)}
                      onCheckedChange={() => toggleTypeFilter(type)}
                    >
                      <span className="capitalize">{type}</span>
                    </DropdownMenuCheckboxItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={showAnomaliesOnly}
                    onCheckedChange={setShowAnomaliesOnly}
                  >
                    Anomalies Only
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Timestamp</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[120px]">Source</TableHead>
                <TableHead>Message</TableHead>
                <TableHead className="w-[100px] text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.slice(0, 50).map((log) => {
                const TypeIcon = typeIcons[log.type]
                return (
                  <TableRow
                    key={log.id}
                    className={log.isAnomaly ? 'bg-destructive/5' : ''}
                  >
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`gap-1 ${typeColors[log.type]}`}
                      >
                        <TypeIcon className="size-3" />
                        <span className="capitalize">{log.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">{log.source}</span>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      <span className={log.isAnomaly ? 'text-destructive font-medium' : ''}>
                        {log.message}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.isAnomaly ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="size-3" />
                          Anomaly
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success border-success/20"
                        >
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
