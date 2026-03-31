"use client"

import { useEffect, useState } from "react"

export default function MetricsCards() {
  const [mlResult, setMlResult] = useState<"Anomaly" | "Normal" | "Loading" | "Error">("Loading")

  useEffect(() => {
    async function fetchML() {
  try {
    const res = await fetch("/api/analysis")

    if (!res.ok) {
      throw new Error("API failed")
    }

    const data = await res.json()

    if (data?.result === "Anomaly") {
      setMlResult("Anomaly")
    } else if (data?.result === "Normal") {
      setMlResult("Normal")
    } else {
      setMlResult("Loading")
    }

  } catch (err) {
    console.error("ML Fetch Error:", err)

    // ❗ IMPORTANT: don't break UI
    setMlResult((prev) => prev || "Error")
  }
}

    fetchML()

    const interval = setInterval(fetchML, 5000)
    return () => clearInterval(interval)
  }, [])

  const getColor = () => {
    switch (mlResult) {
      case "Anomaly":
        return "#ef4444" // red
      case "Normal":
        return "#22c55e" // green
      case "Error":
        return "#f59e0b" // yellow
      default:
        return "#3b82f6" // blue
    }
  }

  const getText = () => {
    switch (mlResult) {
      case "Anomaly":
        return "🚨 Anomaly Detected"
      case "Normal":
        return "✅ System Normal"
      case "Error":
        return "⚠️ Error in ML"
      default:
        return "⏳ Loading..."
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* 🔥 Anomaly Card */}
      <div className="bg-black text-white p-5 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-sm text-gray-400 mb-2">Anomalies Detected</h2>

        <h1 className="text-3xl font-bold mb-2">
          {mlResult === "Anomaly" ? 1 : 0}
        </h1>

        <p style={{ color: getColor() }} className="text-sm">
          {getText()}
        </p>
      </div>

      {/* 💻 CPU Status */}
      <div className="bg-black text-white p-5 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-sm text-gray-400 mb-2">CPU Status</h2>
        <h1 className="text-2xl font-bold">Live</h1>
        <p className="text-sm text-gray-400">Connected to system metrics</p>
      </div>

      {/* 📡 System Health */}
      <div className="bg-black text-white p-5 rounded-2xl shadow-lg border border-gray-800">
        <h2 className="text-sm text-gray-400 mb-2">System Health</h2>
        <h1 className="text-2xl font-bold">
          {mlResult === "Anomaly" ? "⚠️ Risk" : "✅ Good"}
        </h1>
        <p className="text-sm text-gray-400">AI-based evaluation</p>
      </div>

    </div>
  )
}