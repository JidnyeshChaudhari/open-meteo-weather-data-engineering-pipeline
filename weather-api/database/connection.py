import os

import psycopg
from psycopg.rows import tuple_row
from dotenv import load_dotenv


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "weather_db")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")


# ============================================================
# DATABASE CONNECTION
# ============================================================

def get_connection():
    """
    Create a PostgreSQL connection.

    tuple_row is important because the SQL queries use
    positional access such as row[0], row[1], etc.
    """

    return psycopg.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        row_factory=tuple_row,
    )