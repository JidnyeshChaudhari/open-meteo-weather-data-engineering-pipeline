from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator


with DAG(
    dag_id="weather_pipeline",
    start_date=datetime(2026, 8, 1),
    schedule="0 * * * *",
    catchup=False,
) as dag:

    extract_weather = BashOperator(
        task_id="extract_weather",
        bash_command=(
            "cd /mnt/c/Users/jidny/Desktop/de && "
            "/home/jidny/airflow_venv/bin/python "
            "src/extraction/weather_extractor.py"
        ),
        retries=2,
        retry_delay=timedelta(minutes=2),
    )

    load_postgres = BashOperator(
        task_id="load_postgres",
        bash_command=(
            "cd /mnt/c/Users/jidny/Desktop/de && "
            "/home/jidny/airflow_venv/bin/python "
            "insert_weather.py"
        ),
        retries=2,
        retry_delay=timedelta(minutes=2),
    )

    run_dbt = BashOperator(
        task_id="run_dbt",
        bash_command=(
            "cd /mnt/c/Users/jidny/Desktop/de/open_meteo_dbt && "
            "/home/jidny/airflow_venv/bin/dbt run"
        ),
        retries=2,
        retry_delay=timedelta(minutes=2),
    )

    extract_weather >> load_postgres >> run_dbt