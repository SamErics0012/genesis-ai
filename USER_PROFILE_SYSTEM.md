# User Profile System Documentation

## Overview
Complete user profile management system with database storage for usernames, profile pictures, and personal information.

## Database Schema

### User Table Additions
```sql
- first_name VARCHAR(100)
- last_name VARCHAR(100)
- display_name VARCHAR(200) -- Auto-generated from first + last name
- profile_picture_url TEXT
- bio TEXT
- updated_at TIMESTAMP
```

### Profile Pictures Table
```sql
CREATE TABLE profile_pictures (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255) REFERENCES "user"(id),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP,
  is_current BOOLEAN DEFAULT true
);
```

## Features

### 1. **Enhanced Signup Page**
- ✅ First Name field (required)
- ✅ Last Name field (required)
- ✅ Email field (required)
- ✅ Password field (required)
- ✅ Automatic display name generation
- ✅ Profile creation on signup

### 2. **API Routes**

#### GET `/api/user/profile?userId={userId}`
Fetch user profile data
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "display_name": "string",
    "profile_picture_url": "string",
    "bio": "string"
  }
}
```

#### PATCH `/api/user/profile`
Update user profile
```json
{
  "userId": "string",
  "firstName": "string",
  "lastName": "string",
  "displayName": "string",
  "profilePictureUrl": "string",
  "bio": "string"
}
```

#### POST `/api/user/upload-avatar`
Upload profile picture
- Accepts: multipart/form-data
- Fields: file (image), userId (string)
- Max size: 5MB
- Allowed types: JPEG, PNG, GIF, WebP
- Saves to: `/public/uploads/avatars/`

### 3. **Sidebar Integration**
- ✅ Displays actual user name from database
- ✅ Shows profile picture if uploaded
- ✅ Displays user email from database
- ✅ Fallback to localStorage for quick loading
- ✅ Subscription tags (Premium/Ultra)

### 4. **Automatic Features**
- ✅ Display name auto-generated from first + last name
- ✅ Trigger updates display_name on name changes
- ✅ Previous profile pictures marked as not current
- ✅ Profile data cached in localStorage
- ✅ Real-time profile updates

## Usage Examples

### Signup Flow
1. User enters first name, last name, email, password
2. Account created with better-auth
3. Profile automatically updated with names
4. Display name generated: "First Last"
5. User redirected to dashboard

### Profile Update Flow
```typescript
// Update profile
await fetch('/api/user/profile', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: session.user.id,
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Software Developer'
  })
});
```

### Avatar Upload Flow
```typescript
// Upload avatar
const formData = new FormData();
formData.append('file', imageFile);
formData.append('userId', session.user.id);

await fetch('/api/user/upload-avatar', {
  method: 'POST',
  body: formData
});
```

## Settings Page Integration

The settings page (`/dashboard/settings`) can now:
- Display current profile information
- Allow editing of first name, last name, display name
- Upload and change profile picture
- Update bio
- Show profile picture history

## Security Features

### RLS Policies
- ✅ Users can view all profile pictures (public read)
- ✅ Users can insert their own profile pictures
- ✅ Users can update their own profile pictures
- ✅ Users can delete their own profile pictures

### File Upload Security
- ✅ File type validation (images only)
- ✅ File size limit (5MB max)
- ✅ Unique filename generation
- ✅ Secure file storage in public/uploads/avatars/

### Database Triggers
- ✅ Auto-update display_name on name changes
- ✅ Auto-update updated_at timestamp
- ✅ Auto-mark previous profile pictures as not current

## Migration Status

✅ **004_add_user_profile_fields.sql** - Successfully applied
- Added profile fields to user table
- Created profile_pictures table
- Added indexes for performance
- Created triggers for automation
- Set up RLS policies

## Testing

### Test New User Signup
1. Go to `/signup`
2. Enter first name: "John"
3. Enter last name: "Doe"
4. Enter email and password
5. Submit form
6. Check sidebar shows "John Doe"

### Test Profile Fetch
```bash
curl "http://localhost:3001/api/user/profile?userId=USER_ID"
```

### Test Profile Update
```bash
curl -X PATCH http://localhost:3001/api/user/profile \
  -H "Content-Type: application/json" \
  -d '{"userId":"USER_ID","firstName":"Jane","lastName":"Smith"}'
```

## File Structure

```
app/
├── api/
│   └── user/
│       ├── profile/
│       │   └── route.ts          # Profile GET/PATCH
│       └── upload-avatar/
│           └── route.ts          # Avatar upload POST
├── (auth)/
│   └── signup/
│       └── page.tsx              # Enhanced signup form
components/
└── sidebar.tsx                   # Updated with profile fetch
supabase/
└── migrations/
    └── 004_add_user_profile_fields.sql
public/
└── uploads/
    └── avatars/                  # Profile pictures storage
```

## Next Steps

1. **Settings Page Enhancement**
   - Add profile picture upload UI
   - Add name editing form
   - Add bio editing
   - Show profile picture history

2. **Profile Completion**
   - Prompt users to complete profile
   - Show profile completion percentage
   - Reward for complete profiles

3. **Avatar Customization**
   - Crop/resize functionality
   - Filters and effects
   - Default avatar generator

4. **Social Features**
   - Public profile pages
   - User directory
   - Profile sharing

## Troubleshooting

### Profile not showing
- Check if user is logged in
- Verify API route is accessible
- Check browser console for errors
- Verify database migration ran successfully

### Avatar upload fails
- Check file size (max 5MB)
- Verify file type (images only)
- Ensure uploads directory exists
- Check file permissions

### Display name not updating
- Verify trigger is created
- Check database logs
- Manually update display_name if needed

## Support

For issues or questions:
1. Check console logs
2. Verify database connection
3. Test API routes directly
4. Check migration status
