# Open-Meteo Weather Data Engineering Pipeline

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

Some Important requirements: 

- PostgreSQL
- dbt with the PostgreSQL adapter
- WSL2 with Ubuntu
- Apache Airflow

### 3. PostgreSQL Setup
Create the project database:
```
weather_db
```
### 4. Python Environment
Create the project virtual environment:
```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
Install Python dependencies:
```
pip install -r requirements.txt
```

### 5. WSL + Ubuntu Setup
Airflow is run inside WSL Ubuntu.
```
cd /mnt/c/Users/<your-windows-username>/Desktop/de
```
Create the Airflow virtual environment
```
python3 -m venv airflow_venv
```
Activate the environment
```
source ~/airflow_venv/bin/activate
```
Install Apache Airflow
```
pip install apache-airflow
```
Verify the installation:
```
airflow version
```

## Running the Pipeline

### 1. Extract Weather Data

From the project root:
```
python src/extraction/weather_extractor.py
```
The extractor retrieves weather data from the Open-Meteo API and stores the raw response for the next stage of the pipeline.

### 2. Load Data into PostgreSQL

Run:
```
python src/load/load_weather.py
```
The extracted data is loaded into:

### 3. Run dbt

Move into the dbt project
```
cd open_meteo_dbt
```
Run the dbt models
```
dbt run
```
Run the dbt tests:
```
dbt test
```
dbt builds the staging, intermediate, dimension, and fact models inside PostgreSQL.

### 4. Run the Pipeline with Airflow
For automated pipeline execution, use Apache Airflow.
Activate the Airflow environment:
```
cd /mnt/c/Users/<your-windows-username>/Desktop/de 
source ~/airflow_venv/bin/activate
```
Airflow 3 requires the following processes for this project.

#### 1. Terminal 1 — Airflow API Server
```
cd /mnt/c/Users/<your-windows-username>/Desktop/de 
source ~/airflow_venv/bin/activate
airflow api-server --port 8080
```
#### 2. Terminal 2 — Airflow Scheduler
Open another WSL terminal
```
cd /mnt/c/Users/<your-windows-username>/Desktop/de 
source ~/airflow_venv/bin/activate
airflow scheduler
```
#### 3.Terminal 3 — Airflow DAG Processor
Open another WSL terminal:
```
cd /mnt/c/Users/<your-windows-username>/Desktop/de 
source ~/airflow_venv/bin/activate 
airflow dag-processor
```
Keep all three Airflow processes running.

---

## Project Structure

```
de/
├── airflow/
│   └── dags/                  # Airflow DAGs and pipeline orchestration
├── config/                    # Weather location configuration
├── open_meteo_dbt/            # dbt transformations and data quality tests
│   ├── models/
│   └── tests/
├── src/
│   └── extraction/            # Weather data extraction and backfill
├── weather-api/               # FastAPI backend
│   ├── database/
│   ├── external/
│   ├── routes/
│   └── services/
├── weather-web/               # React + Vite dashboard
├── data/                      # Local raw and processed data
├── Dockerfile                 # Container configuration
├── insert_weather.py          # PostgreSQL loading
├── requirements.txt           # Python dependencies
└── README.md
```

---

## Environment Variables

| **Variable**         | **Description**          |
| -------------------- | ------------------------ |
| `POSTGRES_HOST`      | PostgreSQL host          |
| `POSTGRES_PORT`      | PostgreSQL port          |
| `POSTGRES_DB`        | PostgreSQL database name |
| `POSTGRES_USER`      | PostgreSQL username      |
| `POSTGRES_PASSWORD`  | PostgreSQL password      |
| `OPEN_METEO_API_URL` | Open-Meteo API base URL  |


---

## License

MIT
