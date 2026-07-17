# Anomaly Detection Dashboard

A full-stack system monitoring dashboard that uses Machine Learning (Isolation Forest) to detect anomalies in system logs.

---

## Overview

This project monitors system metrics such as CPU usage, memory usage, and request load, and applies a Machine Learning model to detect abnormal behavior in logs.

It integrates a Next.js backend with a Python-based ML model to perform real-time anomaly detection.

---

## Features

- Real-time system monitoring (CPU, Memory, Requests)
- Machine Learning-based anomaly detection using Isolation Forest
- Automatic classification of logs as Normal or Anomaly
- Interactive dashboard UI
- Integration between Node.js and Python using child_process

---

## Tech Stack

Frontend:
- Next.js
- React
- Tailwind CSS

Backend:
- Next.js API Routes
- Node.js

Machine Learning:
- Python
- Scikit-learn (Isolation Forest)

---

## How It Works

1. System logs are collected and stored
2. Logs are sent to a Python ML model via API
3. The Isolation Forest model analyzes patterns
4. Each log is classified as:
   - Normal
   - Anomaly
5. Results are returned to the frontend and displayed on the dashboard

---

## API Endpoint

Example Response:

```json
[
  { "index": 0, "status": "Normal" },
  { "index": 1, "status": "Anomaly" }
]
