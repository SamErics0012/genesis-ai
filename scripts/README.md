# Subscription Management Tools

This directory contains tools for managing user subscriptions in the video generation app.

## Features

- **Automatic 30-day expiration** for all paid subscriptions (Premium & Ultra)
- **Manual upgrade/revoke** functionality
- **Real-time subscription checking** with auto-expiration
- **Multiple management interfaces** (TypeScript & Python)

## Subscription Plans

- **Free**: No access to image/video generation
- **Premium**: ₹799 ($9.99) - Unlimited image generation (30-day expiry)
- **Ultra**: ₹1299 ($15.99) - Unlimited image + video generation (30-day expiry)

## TypeScript Management (Node.js)

### Setup
```bash
# Already configured in package.json
npm install
```

### Commands
```bash
# List all subscriptions
npm run manage-subscription list

# Get user subscription details
npm run manage-subscription get <userId>

# Upgrade user to premium (auto-expires in 30 days)
npm run manage-subscription upgrade <userId> premium

# Upgrade user to ultra (auto-expires in 30 days)
npm run manage-subscription upgrade <userId> ultra

# Upgrade with custom expiration date
npm run manage-subscription upgrade <userId> premium "2024-12-31"

# Revoke user subscription (back to free)
npm run manage-subscription revoke <userId>
```

## Python Management

### Setup
```bash
# Install Python dependencies
cd scripts
pip install -r requirements.txt

# Or run the setup script on Windows
setup_python.bat
```

### Commands
```bash
# List all subscriptions
python manage_subscription.py list

# List only active subscriptions
python manage_subscription.py list --active-only

# Get active users only
python manage_subscription.py active

# Get user subscription details
python manage_subscription.py get <userId>

# Upgrade user to premium (auto-expires in 30 days)
python manage_subscription.py upgrade <userId> premium

# Upgrade user to ultra (auto-expires in 30 days)
python manage_subscription.py upgrade <userId> ultra

# Upgrade with custom expiration date
python manage_subscription.py upgrade <userId> premium --expires 2024-12-31

# Revoke user subscription (back to free)
python manage_subscription.py revoke <userId>
```

## Database Migration

### Run subscription table migration
```bash
npm run db:migrate-subscription
```

## Automatic Features

### 30-Day Auto-Expiration
- All Premium and Ultra subscriptions automatically expire after 30 days
- Free subscriptions never expire
- Expired subscriptions are automatically downgraded to Free when checked
- Users are redirected to pricing page when accessing paid features with expired subscriptions

### Real-time Checking
- Subscription status is checked every time a user accesses image/video generation
- Expired subscriptions are automatically updated in the database
- UI shows current subscription status with expiration dates

## Manual Purchase Flow

1. User clicks "Get Premium" or "Get Ultra" on pricing page
2. Popup shows Instagram contact (@samurai_apiog)
3. User contacts via Instagram with payment
4. Admin uses management script to upgrade user
5. User gets immediate access to paid features

## Example Workflow

```bash
# Check current subscriptions
npm run manage-subscription list

# User pays for Premium plan
npm run manage-subscription upgrade user123 premium

# Check user details
npm run manage-subscription get user123

# After 30 days, subscription auto-expires to free
# Or manually revoke if needed
npm run manage-subscription revoke user123
```

## Security Notes

- All subscription checks happen server-side
- RLS policies protect subscription data
- Access control enforced at application level
- Automatic expiration prevents unauthorized access

## Files

- `migrate.ts` - Main database migration script
- `run-subscription-migration.ts` - Subscription-specific migration
- `manage-subscription.ts` - TypeScript subscription management
- `manage_subscription.py` - Python subscription management
- `requirements.txt` - Python dependencies
- `setup_python.bat` - Windows setup script for Python
