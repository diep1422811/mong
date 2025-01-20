#!/bin/bash
set -e

# Wait for PostgreSQL
echo "Waiting for PostgreSQL..."
while ! nc -z db 5432; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
done
echo "PostgreSQL started"

# Run migrations
echo "Running migrations..."
alembic upgrade head

# Start application
echo "Starting application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000 --reload 