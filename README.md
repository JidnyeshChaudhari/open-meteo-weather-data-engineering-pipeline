# 🛒 E-Commerce Copilot

An end-to-end weather data engineering pipeline that extracts weather data from the Open-Meteo API, stores raw data in PostgreSQL, transforms it using dbt, orchestrates the workflow with Apache Airflow, and provides weather data through a FastAPI backend and React dashboard.

---

## Architecture

```
Open-Meteo API
      │
      ▼
Python Extraction
      │
      ▼
Raw JSON Data
      │
      ▼
PostgreSQL
(raw.raw_weather)
      │
      ▼
dbt Transformations
      │
      ├── Staging
      ├── Intermediate
      └── Marts
            │
            ├── dim_city
            ├── dim_datetime
            ├── fact_weather
            ├── fact_weather_daily
            └── fact_weather_monthly
      │
      ▼
FastAPI Backend
      │
      ├── Historical Weather
      ├── Current Weather
      └── City Data
      │
      ▼
React + Vite Dashboard
```

---

## Features

- Weather Data Extraction — extracts hourly weather data from the Open-Meteo API
- Multi-City Processing — processes weather data for configured cities
- PostgreSQL Storage — stores raw weather data in PostgreSQL
- dbt Transformations — transforms raw data into analytical warehouse models
- Analytical Models — provides city, datetime, fact, daily, and monthly models
- Airflow Orchestration — schedules and manages the data pipeline
- Data Quality Tests — validates uniqueness, data ranges, freshness, and referential integrity
- Live Weather Data — retrieves current weather directly from Open-Meteo
- FastAPI Backend — provides REST endpoints for weather data
- React Dashboard — displays current weather and historical trends

---

## Tech Stack

| Layer          | Technology     |
| -------------- | -------------- |
| Weather Source | Open-Meteo API |
| Extraction     | Python         |
| Database       | PostgreSQL     |
| Transformation | dbt            |
| Orchestration  | Apache Airflow |
| Data Quality   | dbt Tests      |
| Backend        | FastAPI        |
| Frontend       | React + Vite   |
| Charts         | Recharts       |


---

## Quickstart

### 1. Clone & configure

```bash
git clone clone https://github.com/JidnyeshChaudhari/de.git
cd cd de
```

### 2. Install Prerequisites

The project requires:

- PostgreSQL
- Python
- dbt with the PostgreSQL adapter
- WSL2 with Ubuntu
- Apache Airflow

```
id,name,description,price,category,stock
1,Widget Pro,A premium widget,29.99,Tools,150
```

### 3. Run with Docker

```bash
docker-compose up --build
```

### 4. Access

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs
- Kafka UI: http://localhost:8080

---

## Local Development (without Docker)

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn api.main:app --reload

# Worker (separate terminal)
python -m workers.inference_worker

# Frontend
cd frontend
npm install
npm run dev
```

---

## Project Structure

```
ecommerce-copilot/
├── backend/
│   ├── agents/         # LangChain ReAct agent + tools
│   ├── api/            # FastAPI app, routes, WebSocket
│   ├── core/           # Config, logging, dependencies
│   ├── kafka/          # Producer/consumer abstractions
│   ├── retrieval/      # LlamaIndex indexer + FAISS store
│   └── workers/        # Async inference worker
├── frontend/           # React + Vite app
├── data/               # Drop CSV/JSON product dumps here
├── docker/             # Dockerfiles
├── scripts/            # Seed data, index builder scripts
├── docker-compose.yml
└── .env.example
```

---

## Environment Variables

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `KAFKA_BOOTSTRAP_SERVERS` | Kafka broker address (default: `localhost:9092`) |
| `FAISS_INDEX_PATH` | Path to persist FAISS index |
| `PRODUCTS_DATA_PATH` | Path to CSV/JSON product file |
| `LOG_LEVEL` | `DEBUG` / `INFO` / `WARNING` |

---

## License

MIT
