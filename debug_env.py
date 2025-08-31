#!/usr/bin/env python3
"""
Simple script to debug environment variables and database connectivity
"""
import os
import sys
import django
from pathlib import Path

# Add the project directory to Python path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meapi.settings')
django.setup()

def check_environment():
    print("=== Environment Variables ===")
    db_vars = [
        'MYSQL_DATABASE', 'MYSQL_USER', 'MYSQL_PASSWORD', 
        'MYSQL_HOST', 'MYSQL_PORT', 'MYSQL_URL',
        'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT'
    ]
    
    for var in db_vars:
        value = os.getenv(var, 'NOT_SET')
        if 'PASSWORD' in var and value != 'NOT_SET':
            value = '*' * len(value)  # Hide password
        print(f"{var}: {value}")
    
    print(f"\nPORT: {os.getenv('PORT', 'NOT_SET')}")
    print(f"DJANGO_DEBUG: {os.getenv('DJANGO_DEBUG', 'NOT_SET')}")
    print(f"ALLOWED_HOSTS: {os.getenv('ALLOWED_HOSTS', 'NOT_SET')}")

def check_database():
    print("\n=== Database Connection Test ===")
    try:
        from django.db import connections
        db_conn = connections['default']
        with db_conn.cursor() as cursor:
            cursor.execute("SELECT 1")
            result = cursor.fetchone()
            print(f"✅ Database connection successful: {result}")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

def check_django_settings():
    print("\n=== Django Settings ===")
    from django.conf import settings
    print(f"DEBUG: {settings.DEBUG}")
    print(f"ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    print(f"DATABASE_ENGINE: {settings.DATABASES['default']['ENGINE']}")
    print(f"DATABASE_NAME: {settings.DATABASES['default']['NAME']}")
    print(f"DATABASE_HOST: {settings.DATABASES['default']['HOST']}")
    print(f"DATABASE_PORT: {settings.DATABASES['default']['PORT']}")

if __name__ == "__main__":
    check_environment()
    check_django_settings()
    check_database()
