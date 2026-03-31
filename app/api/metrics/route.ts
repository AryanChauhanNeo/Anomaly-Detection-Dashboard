import { exec } from "child_process"
import { NextResponse } from "next/server"
import { getMetricsHistory, getCurrentMetrics, getLogs } from "@/lib/store"

export async function GET() {
  return new Promise((resolve) => {
    const history = getMetricsHistory()
    const current = getCurrentMetrics()
    const logs = getLogs()

    const cpu = current.cpu
    const memory = current.memory
    const requests = current.requestCount

    exec(
      `python ml_model.py ${cpu} ${memory} ${requests}`,
      (error, stdout, stderr) => {

        // ✅ HANDLE ERROR SAFELY (no UI break)
        if (error) {
          console.error("ML Error:", stderr)

          resolve(
            NextResponse.json({
              current,
              history,
              stats: {
                totalLogs: logs.length,
                anomalyCount: 0,
                healthScore: 80,
              },
            })
          )
          return
        }

        const result = stdout.trim()
        console.log("ML Result:", result)

        const totalLogs = logs.length
        const anomalyCount = result === "Anomaly" ? 1 : 0
        const errorCount = logs.filter((log) => log.type === "error").length

        const healthScore =
          result === "Anomaly"
            ? 60
            : Math.round((1 - errorCount / Math.max(totalLogs, 1)) * 100)

        resolve(
          NextResponse.json({
            current,
            history,
            stats: {
              totalLogs,
              anomalyCount,
              healthScore,
            },
          })
        )
      }
    )
  })
}