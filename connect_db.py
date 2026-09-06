import os

import psycopg
from dotenv import load_dotenv


load_dotenv()

connection = psycopg.connect(
    host=os.getenv("DB_HOST"),
    port=os.getenv("DB_PORT"),
    dbname=os.getenv("DB_NAME"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD")
)

cursor = connection.cursor()

cursor.execute("SELECT current_database();")

database_name = cursor.fetchone()[0]

print("Connected database:", database_name)

cursor.close()
connection.close()