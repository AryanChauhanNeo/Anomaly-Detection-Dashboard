'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, X, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface LogUploadProps {
  onUploadComplete: () => void
}

export function LogUpload({ onUploadComplete }: LogUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && (file.type === 'text/plain' || file.name.endsWith('.log'))) {
      setSelectedFile(file)
    } else {
      toast.error('Please upload a .txt or .log file')
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/logs', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Successfully uploaded ${data.logsAdded} logs`)
        setSelectedFile(null)
        onUploadComplete()
      } else {
        toast.error(data.error || 'Failed to upload file')
      }
    } catch {
      toast.error('Failed to upload file')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Log File</CardTitle>
        <CardDescription>
          Upload a log file (.txt or .log) to analyze for anomalies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'}
          `}
        >
          <input
            type="file"
            accept=".txt,.log"
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
            disabled={isUploading}
          />
          
          {selectedFile ? (
            <div className="flex items-center gap-3">
              <FileText className="size-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="ml-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedFile(null)
                }}
                disabled={isUploading}
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <>
              <Upload className="size-10 text-muted-foreground" />
              <div className="text-center">
                <p className="font-medium">Drop your log file here</p>
                <p className="text-sm text-muted-foreground">
                  or click to browse
                </p>
              </div>
            </>
          )}
        </div>

        {selectedFile && (
          <Button
            className="mt-4 w-full"
            onClick={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 size-4" />
                Upload and Analyze
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
