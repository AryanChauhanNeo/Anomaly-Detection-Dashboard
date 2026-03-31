import sys
import json
import numpy as np
from sklearn.ensemble import IsolationForest

# Read logs from stdin
logs_json = sys.stdin.read()

logs = json.loads(logs_json)

data = []
for log in logs:
    response_time = log.get("responseTime", 0)
    status = log.get("status", 200)

    data.append([response_time, status])

X = np.array(data)

model = IsolationForest(contamination=0.2)
model.fit(X)

predictions = model.predict(X)

# Convert result per log
results = []

for i, pred in enumerate(predictions):
    if pred == -1:
        results.append({
            "index": i,
            "status": "Anomaly"
        })
    else:
        results.append({
            "index": i,
            "status": "Normal"
        })

# Send JSON output
print(json.dumps(results))

