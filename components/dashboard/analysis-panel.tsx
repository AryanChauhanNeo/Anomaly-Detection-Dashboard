'use client'

import { useState } from 'react'
import { Brain, Loader2, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface AnalysisPanelProps {
  onAnalysisComplete: () => void
}

export function AnalysisPanel({ onAnalysisComplete }: AnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<{
    anomalyCount: number
    healthScore: number
  } | null>(null)
  const [progress, setProgress] = useState(0)

  const runAnalysis = async () => {
    setIsAnalyzing(true)
    setProgress(0)
    setResults(null)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 15, 90))
    }, 200)

    try {
      const response = await fetch('/api/analysis', {
        method: 'POST',
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await response.json()

      if (response.ok) {
        setResults({
          anomalyCount: data.results.anomalyCount,
          healthScore: data.results.healthScore,
        })
        toast.success('Analysis complete')
        onAnalysisComplete()
      } else {
        toast.error('Analysis failed')
      }
    } catch {
      clearInterval(progressInterval)
      toast.error('Failed to run analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="size-5 text-primary" />
          <div>
            <CardTitle>AI Analysis</CardTitle>
            <CardDescription>
              Run AI-powered analysis to detect anomalies
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full"
          size="lg"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 size-4" />
              Run Analysis
            </>
          )}
        </Button>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing logs...</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {results && !isAnalyzing && (
          <div className="rounded-lg border bg-card p-4 space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-success">
              <CheckCircle className="size-4" />
              Analysis Complete
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="size-4 text-warning" />
                  Anomalies Found
                </div>
                <p className="text-2xl font-bold mt-1">{results.anomalyCount}</p>
              </div>
              
              <div className="rounded-md bg-muted/50 p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="size-4 text-success" />
                  Health Score
                </div>
                <p className="text-2xl font-bold mt-1">{results.healthScore}%</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              {results.anomalyCount > 0
                ? `Detected ${results.anomalyCount} potential anomalies in your logs. Review the logs table for details.`
                : 'No significant anomalies detected. Your system appears to be operating normally.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
