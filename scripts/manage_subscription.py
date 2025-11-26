#!/usr/bin/env python3
"""
Subscription Management Tool - Python Version
Manage user subscriptions for the video generation app
"""

import os
import sys
import psycopg2
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import argparse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class SubscriptionManager:
    def __init__(self):
        self.connection_string = os.getenv('DATABASE_URL')
        if not self.connection_string:
            raise ValueError("DATABASE_URL environment variable not found")
    
    def get_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.connection_string)
    
    def upgrade_user(self, user_id: str, plan_type: str, expires_at: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Upgrade user to premium or ultra plan
        
        Args:
            user_id: User ID to upgrade
            plan_type: 'premium' or 'ultra'
            expires_at: Optional expiration date (defaults to 30 days from now for paid plans)
        
        Returns:
            Dictionary with subscription details
        """
        if plan_type not in ['premium', 'ultra']:
            raise ValueError("Plan type must be 'premium' or 'ultra'")
        
        # Auto-set 30-day expiration for paid plans
        if not expires_at:
            expires_at = datetime.now() + timedelta(days=30)
        
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                print(f"🔄 Upgrading user {user_id} to {plan_type} plan...")
                
                # Check if user exists
                cursor.execute('SELECT id FROM "user" WHERE id = %s', (user_id,))
                if not cursor.fetchone():
                    raise ValueError(f"User with ID {user_id} not found")
                
                # Upsert subscription
                query = """
                    INSERT INTO subscriptions (user_id, plan_type, status, expires_at, updated_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (user_id) 
                    DO UPDATE SET 
                        plan_type = EXCLUDED.plan_type,
                        status = EXCLUDED.status,
                        expires_at = EXCLUDED.expires_at,
                        updated_at = NOW()
                    RETURNING *;
                """
                
                cursor.execute(query, (user_id, plan_type, 'active', expires_at))
                result = cursor.fetchone()
                
                if result:
                    columns = [desc[0] for desc in cursor.description]
                    subscription = dict(zip(columns, result))
                    
                    print(f"✅ Successfully upgraded user {user_id}:")
                    print(f"   Plan: {subscription['plan_type']}")
                    print(f"   Status: {subscription['status']}")
                    print(f"   Expires: {subscription['expires_at']}")
                    print(f"   📅 Auto-expires in 30 days: {expires_at.strftime('%Y-%m-%d')}")
                    
                    return subscription
                else:
                    raise Exception("Failed to upgrade user subscription")
    
    def revoke_user(self, user_id: str) -> Dict[str, Any]:
        """
        Revoke user subscription (set to free)
        
        Args:
            user_id: User ID to revoke
        
        Returns:
            Dictionary with updated subscription details
        """
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                print(f"🔄 Revoking subscription for user {user_id}...")
                
                query = """
                    UPDATE subscriptions 
                    SET plan_type = 'free', status = 'cancelled', updated_at = NOW()
                    WHERE user_id = %s
                    RETURNING *;
                """
                
                cursor.execute(query, (user_id,))
                result = cursor.fetchone()
                
                if not result:
                    raise ValueError(f"No subscription found for user {user_id}")
                
                columns = [desc[0] for desc in cursor.description]
                subscription = dict(zip(columns, result))
                
                print(f"✅ Successfully revoked subscription for user {user_id}")
                print(f"   Plan: {subscription['plan_type']}")
                print(f"   Status: {subscription['status']}")
                
                return subscription
    
    def get_user_subscription(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Get user subscription details
        
        Args:
            user_id: User ID to lookup
        
        Returns:
            Dictionary with subscription details or None if not found
        """
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                query = """
                    SELECT s.*, u.email, u.name 
                    FROM subscriptions s
                    JOIN "user" u ON s.user_id = u.id
                    WHERE s.user_id = %s;
                """
                
                cursor.execute(query, (user_id,))
                result = cursor.fetchone()
                
                if not result:
                    print(f"❌ No subscription found for user {user_id}")
                    return None
                
                columns = [desc[0] for desc in cursor.description]
                subscription = dict(zip(columns, result))
                
                print(f"📋 Subscription details for user {user_id}:")
                print(f"   Email: {subscription['email']}")
                print(f"   Name: {subscription['name'] or 'N/A'}")
                print(f"   Plan: {subscription['plan_type']}")
                print(f"   Status: {subscription['status']}")
                print(f"   Created: {subscription['created_at']}")
                print(f"   Updated: {subscription['updated_at']}")
                print(f"   Expires: {subscription['expires_at'] or 'Never'}")
                
                # Check if expired
                if subscription['plan_type'] != 'free' and subscription['expires_at']:
                    now = datetime.now()
                    expires_at = subscription['expires_at']
                    if isinstance(expires_at, str):
                        expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                    
                    if now > expires_at.replace(tzinfo=None):
                        print(f"   ⚠️  EXPIRED: This subscription has expired!")
                
                return subscription
    
    def list_all_subscriptions(self, active_only: bool = False) -> List[Dict[str, Any]]:
        """
        List all subscriptions
        
        Args:
            active_only: If True, only show active subscriptions
        
        Returns:
            List of subscription dictionaries
        """
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                query = """
                    SELECT s.*, u.email, u.name 
                    FROM subscriptions s
                    JOIN "user" u ON s.user_id = u.id
                """
                
                if active_only:
                    query += " WHERE s.status = 'active'"
                
                query += " ORDER BY s.updated_at DESC;"
                
                cursor.execute(query)
                results = cursor.fetchall()
                
                if not results:
                    print("📊 No subscriptions found")
                    return []
                
                columns = [desc[0] for desc in cursor.description]
                subscriptions = [dict(zip(columns, row)) for row in results]
                
                print(f"📊 Found {len(subscriptions)} subscriptions:")
                print("─" * 80)
                
                for i, sub in enumerate(subscriptions, 1):
                    status_emoji = "✅" if sub['status'] == 'active' else "❌"
                    plan_emoji = {"free": "🆓", "premium": "⭐", "ultra": "💎"}.get(sub['plan_type'], "❓")
                    
                    print(f"{i}. {status_emoji} {sub['email']} ({sub['name'] or 'No name'})")
                    print(f"   {plan_emoji} Plan: {sub['plan_type']} | Status: {sub['status']}")
                    print(f"   User ID: {sub['user_id']}")
                    
                    # Check expiration
                    if sub['plan_type'] != 'free' and sub['expires_at']:
                        expires_at = sub['expires_at']
                        if isinstance(expires_at, str):
                            expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                        
                        now = datetime.now()
                        if now > expires_at.replace(tzinfo=None):
                            print(f"   ⚠️  EXPIRED: {expires_at.strftime('%Y-%m-%d')}")
                        else:
                            days_left = (expires_at.replace(tzinfo=None) - now).days
                            print(f"   📅 Expires: {expires_at.strftime('%Y-%m-%d')} ({days_left} days left)")
                    else:
                        print(f"   📅 Expires: Never")
                    
                    print("─" * 40)
                
                return subscriptions
    
    def get_active_users(self) -> List[Dict[str, Any]]:
        """Get all active users with their subscription status"""
        return self.list_all_subscriptions(active_only=True)


def main():
    parser = argparse.ArgumentParser(description="Subscription Management Tool")
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Upgrade command
    upgrade_parser = subparsers.add_parser('upgrade', help='Upgrade user to premium/ultra')
    upgrade_parser.add_argument('user_id', help='User ID to upgrade')
    upgrade_parser.add_argument('plan', choices=['premium', 'ultra'], help='Plan type')
    upgrade_parser.add_argument('--expires', help='Expiration date (YYYY-MM-DD), defaults to 30 days from now')
    
    # Revoke command
    revoke_parser = subparsers.add_parser('revoke', help='Revoke user subscription')
    revoke_parser.add_argument('user_id', help='User ID to revoke')
    
    # Get command
    get_parser = subparsers.add_parser('get', help='Get user subscription details')
    get_parser.add_argument('user_id', help='User ID to lookup')
    
    # List command
    list_parser = subparsers.add_parser('list', help='List all subscriptions')
    list_parser.add_argument('--active-only', action='store_true', help='Show only active subscriptions')
    
    # Active command
    active_parser = subparsers.add_parser('active', help='List active users only')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        print("\nExamples:")
        print("  python manage_subscription.py upgrade user123 premium")
        print("  python manage_subscription.py upgrade user123 ultra --expires 2024-12-31")
        print("  python manage_subscription.py revoke user123")
        print("  python manage_subscription.py get user123")
        print("  python manage_subscription.py list")
        print("  python manage_subscription.py list --active-only")
        print("  python manage_subscription.py active")
        return
    
    try:
        manager = SubscriptionManager()
        
        if args.command == 'upgrade':
            expires_at = None
            if args.expires:
                expires_at = datetime.strptime(args.expires, '%Y-%m-%d')
            manager.upgrade_user(args.user_id, args.plan, expires_at)
        
        elif args.command == 'revoke':
            manager.revoke_user(args.user_id)
        
        elif args.command == 'get':
            manager.get_user_subscription(args.user_id)
        
        elif args.command == 'list':
            manager.list_all_subscriptions(active_only=args.active_only)
        
        elif args.command == 'active':
            manager.get_active_users()
    
    except Exception as e:
        print(f"💥 Error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
