# pen-Meteo Weather Data Engineering Pipeline

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

Some Importatn requirements: 

- PostgreSQL
- dbt with the PostgreSQL adapter
- WSL2 with Ubuntu
- Apache Airflow

#### 1. PostgreSQL
Create the project database:
```
weather_db
```
#### 2. Python Environment
Create the project virtual environment:
```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
Install Python dependencies:
```
pip install -r requirements.txt
```

#### 4. dbt
pip install -r requirements.txt
```
pip install dbt-core dbt-postgres
```
#### 5. WSL2 + Ubuntu
Install WSL2 and Ubuntu from an Administrator PowerShell:
```
wsl --install
```
#### 5. Apache Airflow
Airflow is installed inside WSL2 Ubuntu
Create the Airflow virtual environment:
```
python3 -m venv ~/airflow_venv
source ~/airflow_venv/bin/activate
```
Install Airflow:
```
pip install apache-airflow
```

### 3.Running the Pipeline

#### 1. Extract Weather Data

From the project root:
```
python src/extraction/weather_extractor.py
```
The extractor retrieves weather data from Open-Meteo and stores the raw response under:

```
data/raw/
```
#### 2. Load Data into PostgreSQL

Run:
```
python insert_weather.py
```

The extracted data is loaded into:
```
raw.raw_weather
```
#### 3. Run dbt

Move into the dbt project:
```
cd open_meteo_dbt
```

Run the transformations:
```
dbt run
```
This builds the staging, intermediate, and mart models.


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
