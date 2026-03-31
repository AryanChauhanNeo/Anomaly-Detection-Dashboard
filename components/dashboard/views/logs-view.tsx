"use client"

import { useEffect, useState } from "react"

export function LogsView({ logs }: any) {
  const [mlResults, setMlResults] = useState<any[]>([])

  useEffect(() => {
    async function fetchML() {
      try {
        const res = await fetch("/api/analysis")
        const data = await res.json()
        setMlResults(data.result || [])
      } catch (err) {
        console.error("ML Fetch Error:", err)
      }
    }

    fetchML()
  }, [])

  return (
    <div className="space-y-2">
      <h2 className="text-xl font-bold mb-4">System Logs</h2>

      {logs.map((log: any, index: number) => {
        const isAnomaly =
          mlResults[index]?.status === "Anomaly"

        return (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              isAnomaly
                ? "bg-red-900 border-red-500"
                : "bg-black border-gray-800"
            }`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-300">
                {log.message || "Log entry"}
              </p>

              {isAnomaly && (
                <span className="text-xs bg-red-600 px-2 py-1 rounded">
                  🚨 Anomaly
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-1">
              Status: {log.status} | Time: {log.timestamp || "N/A"}
            </div>
          </div>
        )
      })}
    </div>
  )
}