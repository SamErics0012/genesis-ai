# 🔐 Better Auth Setup Guide - Genesis AI

## ✅ What's Been Implemented

### 1. **Packages Installed**
- ✅ `better-auth` - Authentication library
- ✅ `pg` - PostgreSQL client
- ✅ `@types/pg` - TypeScript types for PostgreSQL
- ✅ `dotenv` - Environment variable loader
- ✅ `tsx` - TypeScript executor

### 2. **Files Created**

#### **lib/auth.ts**
- Server-side auth configuration
- PostgreSQL connection with Neon
- Email/password authentication enabled
- Session management (7-day expiry)

#### **lib/auth-client.ts**
- Client-side auth hooks
- Exports: `signIn`, `signUp`, `signOut`, `useSession`

#### **app/api/auth/[...all]/route.ts**
- API route handler for all auth endpoints
- Handles: `/api/auth/sign-in`, `/api/auth/sign-up`, etc.

#### **scripts/migrate.ts**
- Database migration script
- Creates all required tables

#### **Updated Files**
- ✅ `app/(auth)/login/page.tsx` - Login with Better Auth
- ✅ `app/(auth)/signup/page.tsx` - Signup with Better Auth
- ✅ `package.json` - Added `db:migrate` script

---

## 🚨 IMPORTANT: Fix Your .env File First!

Your current `.env` file has an **incorrect** DATABASE_URL format.

### ❌ Current (WRONG):
```env
DATABASE_URL=psql 'postgresql://neondb_owner:npg_5BWAUOe6oXiN@ep-empty-base-a106k808-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
```

### ✅ Correct Format:
```env
DATABASE_URL=postgresql://neondb_owner:npg_5BWAUOe6oXiN@ep-empty-base-a106k808-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=Tw4fUMXzhXtubwIJMzcPLOLyn5G5JKrj3LcFNt3zyR8=
BETTER_AUTH_URL=http://localhost:3000
```

**Changes needed:**
1. Remove `psql '` from the start
2. Remove `'` from the end
3. Remove `&channel_binding=require`

---

## 📋 Setup Steps

### Step 1: Fix .env File
Update your `.env` file in `c:\Users\GAUTAM\Desktop\CRUCIAL PROJECT\.env` with the correct format above.

### Step 2: Run Database Migration
This creates all required tables in your Neon database:

```bash
npm run db:migrate
```

**Expected output:**
```
🚀 Starting database migration...
✅ Users table created
✅ Accounts table created
✅ Sessions table created
✅ Verification table created
✅ Indexes created
🎉 Migration completed successfully!
```

### Step 3: Start Development Server
```bash
npm run dev
```

### Step 4: Test Authentication
1. Go to `http://localhost:3000/signup`
2. Create an account with email and password
3. You'll be redirected to home page
4. Try logging out and logging in again

---

## 📊 Database Schema

### Tables Created:

#### **user**
- `id` - Primary key
- `email` - Unique email address
- `emailVerified` - Email verification status
- `name` - User's name
- `image` - Profile image URL
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

#### **account**
- `id` - Primary key
- `userId` - Foreign key to user
- `accountId` - Provider account ID
- `providerId` - Auth provider (email, google, etc.)
- `password` - Hashed password (for email auth)
- `accessToken` - OAuth access token
- `refreshToken` - OAuth refresh token
- `expiresAt` - Token expiration

#### **session**
- `id` - Primary key
- `userId` - Foreign key to user
- `token` - Session token
- `expiresAt` - Session expiration (7 days)
- `ipAddress` - User's IP
- `userAgent` - Browser info

#### **verification**
- `id` - Primary key
- `identifier` - Email or phone
- `value` - Verification code
- `expiresAt` - Code expiration

---

## 🔌 API Endpoints

Better Auth automatically creates these endpoints:

### **POST /api/auth/sign-up**
Create new account
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "User Name"
}
```

### **POST /api/auth/sign-in**
Login to account
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### **POST /api/auth/sign-out**
Logout from account
```json
{}
```

### **GET /api/auth/session**
Get current session
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "..."
  },
  "session": {
    "token": "...",
    "expiresAt": "..."
  }
}
```

---

## 🎯 Usage in Components

### Check if User is Logged In
```tsx
import { useSession } from "@/lib/auth-client";

export default function MyComponent() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;
  
  if (!session) {
    return <div>Please log in</div>;
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

### Sign Out Button
```tsx
import { signOut } from "@/lib/auth-client";

export default function SignOutButton() {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

### Protected Route
```tsx
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  if (isPending) return <div>Loading...</div>;
  if (!session) return null;

  return <div>Protected content</div>;
}
```

---

## 🔒 Security Features

### ✅ Implemented:
- Password hashing (automatic)
- Secure session tokens
- CSRF protection
- SQL injection prevention
- XSS protection
- Secure cookies (httpOnly)
- SSL/TLS for database connection

### 🔜 To Add Later:
- Email verification
- Password reset
- Two-factor authentication (2FA)
- OAuth providers (Google, GitHub)
- Rate limiting
- Account lockout after failed attempts

---

## 🐛 Troubleshooting

### Error: "Connection refused"
**Fix:** Make sure your DATABASE_URL is correct and Neon database is accessible.

### Error: "relation 'user' does not exist"
**Fix:** Run the migration: `npm run db:migrate`

### Error: "Invalid credentials"
**Fix:** Make sure you're using the correct email and password. Passwords are case-sensitive.

### Error: "Session expired"
**Fix:** Sessions expire after 7 days. Just log in again.

### Error: "BETTER_AUTH_SECRET is not defined"
**Fix:** Make sure your `.env` file has all three variables set.

---

## 📝 Next Steps

### 1. **Add Email Verification**
```bash
# Install email service (e.g., Resend)
npm install resend
```

### 2. **Add OAuth Providers**
```typescript
// In lib/auth.ts
socialProviders: {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  },
}
```

### 3. **Add Password Reset**
Better Auth supports password reset out of the box.

### 4. **Add User Profile Page**
Create a page to view and edit user information.

### 5. **Add Admin Dashboard**
Create admin routes to manage users.

---

## 📚 Resources

- **Better Auth Docs**: https://www.better-auth.com/docs
- **Neon Docs**: https://neon.tech/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## ✨ Features

### Login Page (`/login`)
- ✅ Email/password login
- ✅ Error handling
- ✅ Loading states
- ✅ Password visibility toggle
- ✅ Link to signup page
- ✅ Genesis AI branding

### Signup Page (`/signup`)
- ✅ Email/password registration
- ✅ Error handling
- ✅ Loading states
- ✅ Password visibility toggle
- ✅ Link to login page
- ✅ Genesis AI branding

### Security
- ✅ Passwords hashed with bcrypt
- ✅ Secure session tokens
- ✅ SSL database connection
- ✅ CSRF protection
- ✅ XSS protection

---

## 🎉 You're All Set!

Your authentication system is now ready to use. Just:
1. Fix your `.env` file
2. Run `npm run db:migrate`
3. Start your dev server with `npm run dev`
4. Test signup and login!

Happy coding! 🚀
