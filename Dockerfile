FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY config/ ./config/
COPY insert_weather.py .
COPY connect_db.py .


RUN mkdir -p data/raw

CMD ["python", "src/extraction/weather_extractor.py"]
