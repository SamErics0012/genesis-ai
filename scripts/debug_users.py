#!/usr/bin/env python3
"""
Debug script to check user data
"""

import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def debug_users():
    connection_string = os.getenv('DATABASE_URL')
    if not connection_string:
        print("❌ DATABASE_URL not found")
        return
    
    try:
        with psycopg2.connect(connection_string) as conn:
            with conn.cursor() as cursor:
                # Check total users
                cursor.execute('SELECT COUNT(*) FROM "user"')
                total_users = cursor.fetchone()[0]
                print(f"📊 Total users in database: {total_users}")
                
                # Check users with subscriptions
                cursor.execute('SELECT COUNT(*) FROM subscriptions')
                total_subscriptions = cursor.fetchone()[0]
                print(f"📊 Total subscription records: {total_subscriptions}")
                
                # List all users with their subscription status
                cursor.execute("""
                    SELECT u.id, u.email, u.name,
                           s.plan_type, s.status
                    FROM "user" u
                    LEFT JOIN subscriptions s ON u.id = s.user_id
                    ORDER BY u.email
                """)
                
                results = cursor.fetchall()
                print(f"\n📋 All users ({len(results)}):")
                print("─" * 80)
                
                for i, (user_id, email, name, plan_type, status) in enumerate(results, 1):
                    plan_display = plan_type or "free"
                    status_display = status or "none"
                    print(f"{i:2d}. {email} ({name or 'No name'})")
                    print(f"    ID: {user_id}")
                    print(f"    Plan: {plan_display} | Status: {status_display}")
                    print("─" * 40)
                
    except Exception as e:
        print(f"💥 Error: {e}")

if __name__ == "__main__":
    debug_users()
