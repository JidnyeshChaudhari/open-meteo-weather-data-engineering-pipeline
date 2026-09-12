# Open-Meteo Weather Data Engineering Pipeline

An end-to-end weather data engineering pipeline that extracts weather data from the Open-Meteo API, stores raw data in PostgreSQL, transforms it using dbt, orchestrates the workflow with Apache Airflow, and provides weather data through a FastAPI backend and React dashboard.

---

## Architecture

```text
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

Apache Airflow
orchestrates:
Extraction → PostgreSQL → dbt

Features
🌦️ Weather Data Extraction — extracts hourly weather data from the Open-Meteo API
🏙️ Multi-City Processing — processes weather data for configured cities
🗄️ PostgreSQL Storage — stores raw weather data in PostgreSQL
🔄 dbt Transformations — transforms raw data into analytical warehouse models
📊 Analytical Models — provides city, datetime, fact, daily, and monthly models
⏱️ Airflow Orchestration — schedules and manages the data pipeline
🧪 Data Quality Tests — validates uniqueness, data ranges, freshness, and referential integrity
⚡ Live Weather Data — retrieves current weather directly from Open-Meteo
🔌 FastAPI Backend — provides REST endpoints for weather data
💻 React Dashboard — displays current weather and historical trends
Tech Stack
Layer	Technology
Weather Source	Open-Meteo API
Extraction	Python
Database	PostgreSQL
Transformation	dbt
Orchestration	Apache Airflow
Data Quality	dbt Tests
Backend	FastAPI
Frontend	React + Vite
Charts	Recharts
Quickstart
1. Clone the Repository
git clone https://github.com/JidnyeshChaudhari/de.git
cd de
2. Install Prerequisites

The project requires:

PostgreSQL
Python
dbt with the PostgreSQL adapter
WSL2 with Ubuntu
Apache Airflow
PostgreSQL

Install PostgreSQL with pgAdmin.

Create the project database:

weather_db

PostgreSQL is used to store the raw weather data and transformed dbt models.

Python Environment

Create the project virtual environment:

python -m venv .venv
.\.venv\Scripts\Activate.ps1

Install Python dependencies:

pip install -r requirements.txt
dbt

Install dbt with the PostgreSQL adapter:

pip install dbt-core dbt-postgres

The dbt project is located at:

open_meteo_dbt/
WSL2 + Ubuntu

Install WSL2 and Ubuntu from an Administrator PowerShell:

wsl --install

Restart Windows if prompted.

Apache Airflow

Airflow is installed inside WSL2 Ubuntu.

Create the Airflow virtual environment:

python3 -m venv ~/airflow_venv
source ~/airflow_venv/bin/activate

Install Airflow:

pip install apache-airflow
Configuration
Weather Locations

Weather locations are configured in:

config/locations.json

Update this file when adding or changing cities processed by the extraction pipeline.

PostgreSQL

Create the project database:

weather_db

The PostgreSQL connection is used by the ingestion, dbt, and FastAPI components.

Database credentials should remain local and must not be committed to GitHub.

dbt

The dbt project is located at:

open_meteo_dbt/

Configure the PostgreSQL connection so that dbt points to:

weather_db
Running the Pipeline
1. Extract Weather Data

From the project root:

python src/extraction/weather_extractor.py

The extractor retrieves weather data from Open-Meteo and stores the raw response under:

data/raw/
2. Load Data into PostgreSQL

Run:

python insert_weather.py

The extracted data is loaded into:

raw.raw_weather
3. Run dbt

Move into the dbt project:

cd open_meteo_dbt

Run the transformations:

dbt run

This builds the staging, intermediate, and mart models.

Airflow

Apache Airflow orchestrates the complete data pipeline.

The DAG is located at:

airflow/dags/weather_pipeline.py

The pipeline contains three main tasks:

extract_weather
      │
      ▼
load_postgres
      │
      ▼
run_dbt

The DAG is scheduled to run hourly:

0 * * * *

Airflow manages task execution, dependencies, retries, and scheduling.

Start Airflow

Activate the Airflow environment inside WSL2:

source ~/airflow_venv/bin/activate

Start Airflow:

airflow standalone

The Airflow environment used by the project is:

/home/jidny/airflow_venv/
Backend

The FastAPI backend is located at:

weather-api/

The backend provides weather data through REST endpoints, including:

Current weather
Historical weather
City information

Current weather is retrieved directly from Open-Meteo, while historical weather data is served from the PostgreSQL-backed data pipeline.

Frontend

The React + Vite dashboard is located at:

weather-web/

The dashboard provides:

Current weather cards
City selection
Temperature trends
Historical weather analysis
Multiple time-range views
City comparison

Install frontend dependencies:

cd weather-web
npm install

Start the development server:

npm run dev
Project Structure
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


Environment Variables
Variable	Description
POSTGRES_HOST	PostgreSQL host
POSTGRES_PORT	PostgreSQL port
POSTGRES_DB	PostgreSQL database name
POSTGRES_USER	PostgreSQL username
POSTGRES_PASSWORD	PostgreSQL password
OPEN_METEO_API_URL	Open-Meteo API base URL

Keep database credentials and other environment-specific values local. Do not commit secrets to GitHub.