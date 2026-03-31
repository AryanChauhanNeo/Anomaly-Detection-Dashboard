import { NextResponse } from "next/server"
import { spawn } from "child_process"
import { getLogs } from "@/lib/store"

export async function GET() {
  return new Promise((resolve) => {

    const logs = getLogs()

    // Start Python process
    const python = spawn("python", ["ml_model.py"])

    let result = ""

    // Send logs to Python via stdin
    python.stdin.write(JSON.stringify(logs))
    python.stdin.end()

    // Receive output
    python.stdout.on("data", (data) => {
      result += data.toString()
    })

    // Handle errors
    python.stderr.on("data", (data) => {
      console.error("ML Error:", data.toString())
    })

    // When process ends
    python.on("close", () => {
      let parsed = []

      try {
        parsed = JSON.parse(result)
      } catch (e) {
        console.error("JSON Parse Error:", e)
        parsed = []
      }

      resolve(
        NextResponse.json({
          result: parsed
        })
      )
    })
  })
}