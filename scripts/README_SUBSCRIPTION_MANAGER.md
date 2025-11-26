# 🚀 Genesis AI - Interactive Subscription Manager

A beautiful, user-friendly interactive tool to manage user subscriptions for Genesis AI.

## ✨ Features

### 🎨 **Beautiful Interface**
- Colorful terminal interface with emojis
- Clear menu system with numbered options
- Visual feedback for all operations
- Professional styling with ANSI colors

### 🔍 **Smart User Search**
- Search users by email or name
- Interactive user selection from search results
- Direct user ID input option
- Real-time search with partial matching

### 📊 **Comprehensive Management**
- View individual user subscriptions
- Upgrade users to Premium (⭐) or Ultra (💎) plans
- Revoke subscriptions with confirmation
- List all subscriptions with statistics
- View only active users
- Expiration tracking with days remaining

### 🛡️ **Safety Features**
- Confirmation prompts for destructive actions
- Clear user information display before operations
- Error handling with helpful messages
- Input validation

## 🚀 Quick Start

### Method 1: Double-click the batch file (Easiest)
```
Double-click: run_subscription_manager.bat
```

### Method 2: Run directly with Python
```bash
cd scripts
python interactive_subscription_manager.py
```

## 📋 Menu Options

```
1. 🔍 Search & View User       - Find and view user subscription details
2. ⭐ Upgrade User to Premium  - Upgrade user to Premium plan (30 days)
3. 💎 Upgrade User to Ultra    - Upgrade user to Ultra plan (30 days)
4. ❌ Revoke User Subscription - Cancel user's paid subscription
5. 📊 View All Subscriptions   - List all users with statistics
6. ✅ View Active Users Only   - Show only active subscribers
7. 🔍 Search Users by Email/Name - Search and browse users
0. 🚪 Exit                     - Close the application
```

## 🎯 Usage Examples

### Finding a User
1. Select option `1` (Search & View User)
2. Choose to search by email/name or enter User ID directly
3. If searching, enter partial email or name
4. Select user from the results list
5. View detailed subscription information

### Upgrading a User
1. Select option `2` (Premium) or `3` (Ultra)
2. Find the user using search or direct ID
3. Review user details shown
4. Confirm the upgrade when prompted
5. See success confirmation with expiration date

### Viewing All Subscriptions
1. Select option `5` (View All) or `6` (Active Only)
2. See summary statistics at the top
3. Browse through all subscriptions with details
4. Expired subscriptions are clearly marked

## 🎨 Visual Features

- **Plan Types**: 🆓 Free, ⭐ Premium, 💎 Ultra
- **Status Indicators**: ✅ Active, ❌ Cancelled, ⚪ None
- **Expiration Warnings**: ⚠️ Expired subscriptions highlighted in red
- **Color Coding**: Green for success, Red for errors, Yellow for warnings
- **Progress Indicators**: 🔄 Processing, ✅ Success, ❌ Failed

## 🔧 Requirements

- Python 3.7+
- psycopg2 (for PostgreSQL connection)
- python-dotenv (for environment variables)
- DATABASE_URL environment variable set in .env file

## 🆚 Comparison: Old vs New

### Old Command-Line Tool ❌
```bash
# Complex commands to remember
python manage_subscription.py upgrade user123 premium
python manage_subscription.py get user123
python manage_subscription.py list --active-only
```

### New Interactive Tool ✅
```
🚀 GENESIS AI - SUBSCRIPTION MANAGER 🚀
📋 MAIN MENU
─────────────
1. 🔍 Search & View User
2. ⭐ Upgrade User to Premium
3. 💎 Upgrade User to Ultra
...
🎯 Select an option (0-7): 
```

## 🛠️ Technical Details

- **Database**: PostgreSQL with psycopg2
- **Environment**: Loads from .env file
- **Error Handling**: Comprehensive try-catch blocks
- **User Experience**: Interactive prompts with validation
- **Safety**: Confirmation dialogs for destructive operations
- **Performance**: Efficient database queries with proper connection handling

## 🎉 Benefits

1. **No More Command Memorization**: Simple numbered menu
2. **Visual Feedback**: Colors and emojis for better UX
3. **Error Prevention**: Confirmation prompts and validation
4. **Faster Workflow**: Search and select instead of typing IDs
5. **Better Overview**: Statistics and formatted lists
6. **Professional Look**: Clean, modern terminal interface

---

**Made with ❤️ for Genesis AI**
