#!/usr/bin/env python3
"""
Interactive Subscription Management Tool
A user-friendly, interactive tool to manage user subscriptions
"""

import os
import sys
import psycopg2
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
import re

# Load environment variables
load_dotenv()

class Colors:
    """ANSI color codes for terminal styling"""
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'
    
    # Background colors
    BG_GREEN = '\033[42m'
    BG_RED = '\033[41m'
    BG_YELLOW = '\033[43m'
    BG_BLUE = '\033[44m'

class InteractiveSubscriptionManager:
    def __init__(self):
        self.connection_string = os.getenv('DATABASE_URL')
        if not self.connection_string:
            raise ValueError("DATABASE_URL environment variable not found")
    
    def get_connection(self):
        """Get database connection"""
        return psycopg2.connect(self.connection_string)
    
    def print_header(self):
        """Print a beautiful header"""
        print(f"\n{Colors.CYAN}{'='*60}{Colors.END}")
        print(f"{Colors.BOLD}{Colors.HEADER}🚀 GENESIS AI - SUBSCRIPTION MANAGER 🚀{Colors.END}")
        print(f"{Colors.CYAN}{'='*60}{Colors.END}")
        print(f"{Colors.YELLOW}💎 Manage user subscriptions with ease!{Colors.END}\n")
    
    def print_menu(self):
        """Print the main menu"""
        print(f"{Colors.BOLD}{Colors.BLUE}📋 MAIN MENU{Colors.END}")
        print(f"{Colors.CYAN}─────────────{Colors.END}")
        print(f"{Colors.GREEN}1.{Colors.END} 🔍 Search & View User")
        print(f"{Colors.GREEN}2.{Colors.END} ⭐ Upgrade User to Premium")
        print(f"{Colors.GREEN}3.{Colors.END} 💎 Upgrade User to Ultra")
        print(f"{Colors.GREEN}4.{Colors.END} ❌ Revoke User Subscription")
        print(f"{Colors.GREEN}5.{Colors.END} 📊 View All Subscriptions")
        print(f"{Colors.GREEN}6.{Colors.END} ✅ View Active Users Only")
        print(f"{Colors.GREEN}7.{Colors.END} 🔍 Search Users by Email/Name")
        print(f"{Colors.RED}0.{Colors.END} 🚪 Exit")
        print(f"{Colors.CYAN}─────────────{Colors.END}")
    
    def get_user_input(self, prompt: str, color: str = Colors.CYAN) -> str:
        """Get user input with colored prompt"""
        return input(f"{color}{prompt}{Colors.END}").strip()
    
    def confirm_action(self, message: str) -> bool:
        """Ask for confirmation before destructive actions"""
        response = self.get_user_input(f"⚠️  {message} (y/N): ", Colors.YELLOW).lower()
        return response in ['y', 'yes']
    
    def search_users(self, search_term: str) -> List[Dict[str, Any]]:
        """Search users by email or name (includes all users, even free ones)"""
        with self.get_connection() as conn:
            with conn.cursor() as cursor:
                query = """
                    SELECT u.id, u.email, u.name,
                           COALESCE(s.plan_type, 'free') as plan_type,
                           COALESCE(s.status, 'none') as status,
                           s.expires_at
                    FROM "user" u
                    LEFT JOIN subscriptions s ON u.id = s.user_id
                    WHERE LOWER(u.email) LIKE LOWER(%s) 
                       OR LOWER(COALESCE(u.name, '')) LIKE LOWER(%s)
                    ORDER BY u.email;
                """
                
                search_pattern = f"%{search_term}%"
                cursor.execute(query, (search_pattern, search_pattern))
                results = cursor.fetchall()
                
                if not results:
                    return []
                
                columns = [desc[0] for desc in cursor.description]
                return [dict(zip(columns, row)) for row in results]
    
    def display_user_list(self, users: List[Dict[str, Any]], title: str = "Users Found"):
        """Display a formatted list of users"""
        if not users:
            print(f"{Colors.RED}❌ No users found{Colors.END}")
            return
        
        print(f"\n{Colors.BOLD}{Colors.BLUE}📋 {title} ({len(users)} found){Colors.END}")
        print(f"{Colors.CYAN}{'─'*80}{Colors.END}")
        
        for i, user in enumerate(users, 1):
            # Plan emoji and color
            plan_info = {
                'free': ('🆓', Colors.YELLOW),
                'premium': ('⭐', Colors.GREEN),
                'ultra': ('💎', Colors.HEADER)
            }
            plan_emoji, plan_color = plan_info.get(user['plan_type'], ('❓', Colors.RED))
            
            # Status emoji - free users show as active since they have access to free features
            if user['plan_type'] == 'free':
                status_emoji = "🆓"  # Free users get free emoji
            else:
                status_emoji = "✅" if user['status'] == 'active' else "❌" if user['status'] == 'cancelled' else "⚪"
            
            print(f"{Colors.BOLD}{i:2d}.{Colors.END} {status_emoji} {Colors.CYAN}{user['email']}{Colors.END}")
            print(f"     👤 Name: {user['name'] or 'Not set'}")
            print(f"     🆔 ID: {user['id']}")
            print(f"     {plan_emoji} Plan: {plan_color}{user['plan_type'].upper()}{Colors.END}")
            
            # Expiration info
            if user['expires_at'] and user['plan_type'] != 'free':
                expires_at = user['expires_at']
                if isinstance(expires_at, str):
                    expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                
                now = datetime.now()
                if now > expires_at.replace(tzinfo=None):
                    print(f"     ⚠️  {Colors.RED}EXPIRED: {expires_at.strftime('%Y-%m-%d')}{Colors.END}")
                else:
                    days_left = (expires_at.replace(tzinfo=None) - now).days
                    print(f"     📅 Expires: {expires_at.strftime('%Y-%m-%d')} ({days_left} days left)")
            
            print(f"{Colors.CYAN}{'─'*40}{Colors.END}")
    
    def get_user_by_id_or_search(self) -> Optional[str]:
        """Get user ID either directly or through search"""
        print(f"\n{Colors.BOLD}🔍 Find User{Colors.END}")
        choice = self.get_user_input("Enter (1) User ID directly or (2) Search by email/name: ")
        
        if choice == "1":
            return self.get_user_input("Enter User ID: ")
        elif choice == "2":
            search_term = self.get_user_input("Enter email or name to search: ")
            users = self.search_users(search_term)
            
            if not users:
                print(f"{Colors.RED}❌ No users found matching '{search_term}'{Colors.END}")
                return None
            
            self.display_user_list(users, f"Search Results for '{search_term}'")
            
            try:
                selection = int(self.get_user_input(f"Select user (1-{len(users)}): ")) - 1
                if 0 <= selection < len(users):
                    return users[selection]['id']
                else:
                    print(f"{Colors.RED}❌ Invalid selection{Colors.END}")
                    return None
            except ValueError:
                print(f"{Colors.RED}❌ Please enter a valid number{Colors.END}")
                return None
        else:
            print(f"{Colors.RED}❌ Invalid choice{Colors.END}")
            return None
    
    def upgrade_user(self, user_id: str, plan_type: str, expires_at: Optional[datetime] = None) -> bool:
        """Upgrade user to premium or ultra plan"""
        try:
            # Auto-set 30-day expiration for paid plans
            if not expires_at:
                expires_at = datetime.now() + timedelta(days=30)
            
            with self.get_connection() as conn:
                with conn.cursor() as cursor:
                    # Check if user exists and get their info
                    cursor.execute('SELECT id, email, name FROM "user" WHERE id = %s', (user_id,))
                    user = cursor.fetchone()
                    if not user:
                        print(f"{Colors.RED}❌ User with ID {user_id} not found{Colors.END}")
                        return False
                    
                    user_email = user[1]
                    user_name = user[2] or "Unknown"
                    
                    print(f"\n{Colors.YELLOW}📋 User Details:{Colors.END}")
                    print(f"   👤 Name: {user_name}")
                    print(f"   📧 Email: {user_email}")
                    print(f"   🆔 ID: {user_id}")
                    
                    if not self.confirm_action(f"Upgrade {user_email} to {plan_type.upper()} plan?"):
                        print(f"{Colors.YELLOW}⏹️  Operation cancelled{Colors.END}")
                        return False
                    
                    print(f"\n{Colors.BLUE}🔄 Upgrading user to {plan_type} plan...{Colors.END}")
                    
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
                        plan_emoji = "⭐" if plan_type == "premium" else "💎"
                        print(f"\n{Colors.BG_GREEN}{Colors.BOLD} ✅ SUCCESS! {Colors.END}")
                        print(f"{Colors.GREEN}🎉 Successfully upgraded {user_email}:{Colors.END}")
                        print(f"   {plan_emoji} Plan: {Colors.BOLD}{plan_type.upper()}{Colors.END}")
                        print(f"   ✅ Status: ACTIVE")
                        print(f"   📅 Expires: {expires_at.strftime('%Y-%m-%d %H:%M:%S')}")
                        print(f"   ⏰ Duration: 30 days from now")
                        return True
                    else:
                        print(f"{Colors.RED}❌ Failed to upgrade user subscription{Colors.END}")
                        return False
        
        except Exception as e:
            print(f"{Colors.RED}💥 Error: {e}{Colors.END}")
            return False
    
    def revoke_user(self, user_id: str) -> bool:
        """Revoke user subscription"""
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cursor:
                    # Get user info first
                    cursor.execute("""
                        SELECT u.email, u.name, s.plan_type, s.status 
                        FROM "user" u 
                        LEFT JOIN subscriptions s ON u.id = s.user_id 
                        WHERE u.id = %s
                    """, (user_id,))
                    
                    result = cursor.fetchone()
                    if not result:
                        print(f"{Colors.RED}❌ User with ID {user_id} not found{Colors.END}")
                        return False
                    
                    user_email, user_name, current_plan, current_status = result
                    
                    print(f"\n{Colors.YELLOW}📋 Current Subscription:{Colors.END}")
                    print(f"   👤 User: {user_name or 'Unknown'} ({user_email})")
                    print(f"   📦 Plan: {current_plan or 'free'}")
                    print(f"   📊 Status: {current_status or 'none'}")
                    
                    if current_plan == 'free' or not current_plan:
                        print(f"{Colors.YELLOW}⚠️  User is already on free plan{Colors.END}")
                        return True
                    
                    if not self.confirm_action(f"Revoke subscription for {user_email}?"):
                        print(f"{Colors.YELLOW}⏹️  Operation cancelled{Colors.END}")
                        return False
                    
                    print(f"\n{Colors.BLUE}🔄 Revoking subscription...{Colors.END}")
                    
                    query = """
                        UPDATE subscriptions 
                        SET plan_type = 'free', status = 'cancelled', updated_at = NOW()
                        WHERE user_id = %s
                        RETURNING *;
                    """
                    
                    cursor.execute(query, (user_id,))
                    result = cursor.fetchone()
                    
                    if result:
                        print(f"\n{Colors.BG_YELLOW}{Colors.BOLD} ✅ REVOKED! {Colors.END}")
                        print(f"{Colors.YELLOW}🔄 Successfully revoked subscription for {user_email}:{Colors.END}")
                        print(f"   🆓 Plan: FREE")
                        print(f"   ❌ Status: CANCELLED")
                        return True
                    else:
                        print(f"{Colors.RED}❌ No active subscription found for user{Colors.END}")
                        return False
        
        except Exception as e:
            print(f"{Colors.RED}💥 Error: {e}{Colors.END}")
            return False
    
    def get_user_subscription(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get and display user subscription details"""
        try:
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
                        # Check if user exists
                        cursor.execute('SELECT email, name FROM "user" WHERE id = %s', (user_id,))
                        user = cursor.fetchone()
                        if user:
                            print(f"\n{Colors.YELLOW}📋 User Details:{Colors.END}")
                            print(f"   👤 Name: {user[1] or 'Unknown'}")
                            print(f"   📧 Email: {user[0]}")
                            print(f"   🆓 Plan: FREE (No subscription record)")
                        else:
                            print(f"{Colors.RED}❌ User with ID {user_id} not found{Colors.END}")
                        return None
                    
                    columns = [desc[0] for desc in cursor.description]
                    subscription = dict(zip(columns, result))
                    
                    # Display subscription details with colors
                    plan_colors = {
                        'free': Colors.YELLOW,
                        'premium': Colors.GREEN,
                        'ultra': Colors.HEADER
                    }
                    plan_emojis = {
                        'free': '🆓',
                        'premium': '⭐',
                        'ultra': '💎'
                    }
                    
                    plan_color = plan_colors.get(subscription['plan_type'], Colors.RED)
                    plan_emoji = plan_emojis.get(subscription['plan_type'], '❓')
                    status_emoji = "✅" if subscription['status'] == 'active' else "❌"
                    
                    print(f"\n{Colors.BOLD}{Colors.BLUE}📋 SUBSCRIPTION DETAILS{Colors.END}")
                    print(f"{Colors.CYAN}{'─'*50}{Colors.END}")
                    print(f"👤 {Colors.BOLD}Name:{Colors.END} {subscription['name'] or 'Not set'}")
                    print(f"📧 {Colors.BOLD}Email:{Colors.END} {subscription['email']}")
                    print(f"🆔 {Colors.BOLD}User ID:{Colors.END} {user_id}")
                    print(f"{plan_emoji} {Colors.BOLD}Plan:{Colors.END} {plan_color}{subscription['plan_type'].upper()}{Colors.END}")
                    print(f"{status_emoji} {Colors.BOLD}Status:{Colors.END} {subscription['status'].upper()}")
                    print(f"📅 {Colors.BOLD}Created:{Colors.END} {subscription['created_at']}")
                    print(f"🔄 {Colors.BOLD}Updated:{Colors.END} {subscription['updated_at']}")
                    
                    # Expiration info
                    if subscription['expires_at']:
                        expires_at = subscription['expires_at']
                        if isinstance(expires_at, str):
                            expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                        
                        now = datetime.now()
                        if now > expires_at.replace(tzinfo=None):
                            print(f"⚠️  {Colors.RED}{Colors.BOLD}EXPIRED:{Colors.END} {Colors.RED}{expires_at.strftime('%Y-%m-%d %H:%M:%S')}{Colors.END}")
                        else:
                            days_left = (expires_at.replace(tzinfo=None) - now).days
                            print(f"⏰ {Colors.BOLD}Expires:{Colors.END} {expires_at.strftime('%Y-%m-%d %H:%M:%S')} ({Colors.GREEN}{days_left} days left{Colors.END})")
                    else:
                        print(f"⏰ {Colors.BOLD}Expires:{Colors.END} Never")
                    
                    print(f"{Colors.CYAN}{'─'*50}{Colors.END}")
                    return subscription
        
        except Exception as e:
            print(f"{Colors.RED}💥 Error: {e}{Colors.END}")
            return None
    
    def list_all_subscriptions(self, active_only: bool = False):
        """List all users with their subscription status (including free users)"""
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cursor:
                    # Modified query to include ALL users, even those without subscription records
                    query = """
                        SELECT u.id as user_id, u.email, u.name,
                               COALESCE(s.plan_type, 'free') as plan_type,
                               COALESCE(s.status, 'none') as status,
                               s.expires_at, s.created_at as subscription_created_at, s.updated_at
                        FROM "user" u
                        LEFT JOIN subscriptions s ON u.id = s.user_id
                    """
                    
                    if active_only:
                        query += " WHERE (s.status = 'active' OR s.status IS NULL)"
                    
                    query += " ORDER BY COALESCE(s.updated_at, s.created_at) DESC, u.email;"
                    
                    cursor.execute(query)
                    results = cursor.fetchall()
                    
                    if not results:
                        print(f"{Colors.RED}📊 No users found{Colors.END}")
                        return
                    
                    columns = [desc[0] for desc in cursor.description]
                    subscriptions = [dict(zip(columns, row)) for row in results]
                    
                    title = "ACTIVE SUBSCRIPTIONS" if active_only else "ALL SUBSCRIPTIONS"
                    print(f"\n{Colors.BOLD}{Colors.BLUE}📊 {title} ({len(subscriptions)} found){Colors.END}")
                    print(f"{Colors.CYAN}{'='*80}{Colors.END}")
                    
                    # Count by plan type
                    plan_counts = {'free': 0, 'premium': 0, 'ultra': 0}
                    active_count = 0
                    expired_count = 0
                    
                    for sub in subscriptions:
                        plan_type = sub['plan_type']
                        status = sub['status']
                        
                        plan_counts[plan_type] += 1
                        # Count free users and active paid users as "active"
                        if plan_type == 'free' or status == 'active':
                            active_count += 1
                        
                        # Check if expired
                        if sub['plan_type'] != 'free' and sub['expires_at']:
                            expires_at = sub['expires_at']
                            if isinstance(expires_at, str):
                                expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                            
                            if datetime.now() > expires_at.replace(tzinfo=None):
                                expired_count += 1
                    
                    # Display summary
                    print(f"{Colors.BOLD}📈 SUMMARY:{Colors.END}")
                    print(f"   🆓 Free: {Colors.YELLOW}{plan_counts['free']}{Colors.END}")
                    print(f"   ⭐ Premium: {Colors.GREEN}{plan_counts['premium']}{Colors.END}")
                    print(f"   💎 Ultra: {Colors.HEADER}{plan_counts['ultra']}{Colors.END}")
                    print(f"   ✅ Active: {Colors.GREEN}{active_count}{Colors.END}")
                    print(f"   ⚠️  Expired: {Colors.RED}{expired_count}{Colors.END}")
                    print(f"{Colors.CYAN}{'─'*80}{Colors.END}")
                    
                    # Display each subscription
                    for i, sub in enumerate(subscriptions, 1):
                        # Better status emoji handling
                        if sub['plan_type'] == 'free':
                            status_emoji = "🆓"  # Free users
                        else:
                            status_emoji = "✅" if sub['status'] == 'active' else "❌"
                        
                        plan_emojis = {"free": "🆓", "premium": "⭐", "ultra": "💎"}
                        plan_colors = {"free": Colors.YELLOW, "premium": Colors.GREEN, "ultra": Colors.HEADER}
                        
                        plan_emoji = plan_emojis.get(sub['plan_type'], "❓")
                        plan_color = plan_colors.get(sub['plan_type'], Colors.RED)
                        
                        print(f"{Colors.BOLD}{i:3d}.{Colors.END} {status_emoji} {Colors.CYAN}{sub['email']}{Colors.END} ({sub['name'] or 'No name'})")
                        print(f"      🆔 ID: {sub['user_id']}")
                        
                        # Better status display for free users
                        status_display = "FREE" if sub['plan_type'] == 'free' else sub['status'].upper()
                        print(f"      {plan_emoji} Plan: {plan_color}{sub['plan_type'].upper()}{Colors.END} | Status: {status_display}")
                        
                        # Expiration info
                        if sub['plan_type'] != 'free' and sub['expires_at']:
                            expires_at = sub['expires_at']
                            if isinstance(expires_at, str):
                                expires_at = datetime.fromisoformat(expires_at.replace('Z', '+00:00'))
                            
                            now = datetime.now()
                            if now > expires_at.replace(tzinfo=None):
                                print(f"      ⚠️  {Colors.RED}EXPIRED: {expires_at.strftime('%Y-%m-%d')}{Colors.END}")
                            else:
                                days_left = (expires_at.replace(tzinfo=None) - now).days
                                print(f"      📅 Expires: {expires_at.strftime('%Y-%m-%d')} ({Colors.GREEN}{days_left} days left{Colors.END})")
                        else:
                            print(f"      📅 Expires: Never")
                        
                        print(f"{Colors.CYAN}{'─'*40}{Colors.END}")
        
        except Exception as e:
            print(f"{Colors.RED}💥 Error: {e}{Colors.END}")
    
    def search_users_interactive(self):
        """Interactive user search"""
        search_term = self.get_user_input("🔍 Enter email or name to search: ")
        if not search_term:
            print(f"{Colors.RED}❌ Please enter a search term{Colors.END}")
            return
        
        users = self.search_users(search_term)
        self.display_user_list(users, f"Search Results for '{search_term}'")
    
    def run(self):
        """Main interactive loop"""
        try:
            while True:
                self.print_header()
                self.print_menu()
                
                choice = self.get_user_input("\n🎯 Select an option (0-7): ")
                
                if choice == "0":
                    print(f"\n{Colors.GREEN}👋 Thanks for using Genesis AI Subscription Manager!{Colors.END}")
                    print(f"{Colors.CYAN}🚀 Have a great day!{Colors.END}\n")
                    break
                
                elif choice == "1":
                    # Search & View User
                    user_id = self.get_user_by_id_or_search()
                    if user_id:
                        self.get_user_subscription(user_id)
                
                elif choice == "2":
                    # Upgrade to Premium
                    user_id = self.get_user_by_id_or_search()
                    if user_id:
                        self.upgrade_user(user_id, "premium")
                
                elif choice == "3":
                    # Upgrade to Ultra
                    user_id = self.get_user_by_id_or_search()
                    if user_id:
                        self.upgrade_user(user_id, "ultra")
                
                elif choice == "4":
                    # Revoke Subscription
                    user_id = self.get_user_by_id_or_search()
                    if user_id:
                        self.revoke_user(user_id)
                
                elif choice == "5":
                    # View All Subscriptions
                    self.list_all_subscriptions()
                
                elif choice == "6":
                    # View Active Users Only
                    self.list_all_subscriptions(active_only=True)
                
                elif choice == "7":
                    # Search Users
                    self.search_users_interactive()
                
                else:
                    print(f"{Colors.RED}❌ Invalid choice. Please select 0-7.{Colors.END}")
                
                # Wait for user to continue
                if choice != "0":
                    input(f"\n{Colors.CYAN}Press Enter to continue...{Colors.END}")
        
        except KeyboardInterrupt:
            print(f"\n\n{Colors.YELLOW}⏹️  Operation cancelled by user{Colors.END}")
            print(f"{Colors.GREEN}👋 Goodbye!{Colors.END}\n")
        except Exception as e:
            print(f"\n{Colors.RED}💥 Unexpected error: {e}{Colors.END}")


def main():
    """Main entry point"""
    try:
        manager = InteractiveSubscriptionManager()
        manager.run()
    except ValueError as e:
        print(f"{Colors.RED}💥 Configuration Error: {e}{Colors.END}")
        print(f"{Colors.YELLOW}💡 Make sure your .env file contains DATABASE_URL{Colors.END}")
        sys.exit(1)
    except Exception as e:
        print(f"{Colors.RED}💥 Fatal Error: {e}{Colors.END}")
        sys.exit(1)


if __name__ == "__main__":
    main()
