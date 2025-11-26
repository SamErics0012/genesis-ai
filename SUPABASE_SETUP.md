# 🗄️ Supabase Storage Setup Guide - Genesis AI

## ✅ What's Been Created

### 1. **Packages Installed**
- ✅ `@supabase/supabase-js` - Supabase client library

### 2. **Files Created**

#### **lib/supabase.ts**
- Supabase client configuration
- TypeScript types for `GeneratedImage`

#### **hooks/use-image-generations.ts**
- Custom React hook for managing image generations
- Functions: `fetchImages`, `saveImage`, `deleteImage`
- Real-time subscriptions for live updates
- Automatic refetch on session changes

#### **supabase/migrations/001_create_generated_images.sql**
- SQL migration to create `generated_images` table
- Row Level Security (RLS) policies
- Indexes for performance

---

## 📋 Setup Steps

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project:
   - **Name**: Genesis AI
   - **Database Password**: (save this!)
   - **Region**: Choose closest to you
4. Wait for project to be created (~2 minutes)

### Step 2: Get Supabase Credentials

1. In your Supabase project dashboard
2. Go to **Settings** → **API**
3. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3: Add Environment Variables

Add to your `.env` file:

```env
# Existing variables
DATABASE_URL=postgresql://neondb_owner:npg_5BWAUOe6oXiN@ep-empty-base-a106k808-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=Tw4fUMXzhXtubwIJMzcPLOLyn5G5JKrj3LcFNt3zyR8=
BETTER_AUTH_URL=http://localhost:3000

# Add these NEW Supabase variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Important:** Replace with your actual values!

### Step 4: Run SQL Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy the contents of `supabase/migrations/001_create_generated_images.sql`
4. Paste into the editor
5. Click **Run**
6. You should see: "Success. No rows returned"

### Step 5: Verify Table Creation

1. Go to **Table Editor** in Supabase
2. You should see `generated_images` table
3. Columns:
   - `id` (uuid)
   - `user_id` (text)
   - `image_url` (text)
   - `prompt` (text)
   - `model` (text)
   - `aspect_ratio` (text)
   - `created_at` (timestamp)

---

## 🔄 Migration from localStorage to Supabase

### What Needs to Change in `image-generator.tsx`:

#### **1. Remove localStorage code:**

**Remove this useEffect:**
```typescript
// ❌ Remove
useEffect(() => {
  const loadMediaLibrary = () => {
    try {
      const storedMedia = localStorage.getItem('mediaLibrary');
      if (storedMedia) {
        setMediaLibrary(JSON.parse(storedMedia));
      }
    } catch (error) {
      console.error('Failed to load media library:', error);
    }
  };
  
  loadMediaLibrary();
  // ... window.addEventListener code
}, []);
```

#### **2. Remove saveToMediaLibrary function:**

```typescript
// ❌ Remove
const saveToMediaLibrary = (data: {
  url: string;
  prompt: string;
  model: string;
  aspectRatio: string;
  timestamp: string;
}) => {
  try {
    const existingMedia = localStorage.getItem('mediaLibrary');
    const mediaArray = existingMedia ? JSON.parse(existingMedia) : [];
    
    const newMedia = {
      id: Date.now().toString(),
      type: 'image',
      url: data.url,
      aspectRatio: data.aspectRatio,
    };
    
    mediaArray.unshift(newMedia);
    localStorage.setItem('mediaLibrary', JSON.stringify(mediaArray));
  } catch (error) {
    console.error('Failed to save to media library:', error);
  }
};
```

#### **3. Replace save logic in handleGenerate:**

**Change from:**
```typescript
// ❌ Old
saveToMediaLibrary({
  url: imageUrl,
  prompt: prompt,
  model: selectedModel.name,
  aspectRatio: aspectRatio,
  timestamp: new Date().toISOString()
});

const storedMedia = localStorage.getItem('mediaLibrary');
if (storedMedia) {
  setMediaLibrary(JSON.parse(storedMedia));
}
```

**To:**
```typescript
// ✅ New
await saveImage({
  image_url: imageUrl,
  prompt: prompt,
  model: selectedModel.name,
  aspect_ratio: aspectRatio,
});
```

#### **4. Update history display:**

**Change from:**
```typescript
// ❌ Old
{mediaLibrary.length > 0 && (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-medium text-muted-foreground">Recent</span>
      <button className="text-xs text-primary hover:underline">View all</button>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {mediaLibrary.slice(0, 20).map((item, index) => (
        <div 
          key={item.id}
          className="relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-colors"
          onClick={() => {
            setGeneratedImage(item.url);
            setGeneratedImageAspectRatio(item.aspectRatio);
          }}
        >
          <img src={item.url} alt={`Generated ${index + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  </div>
)}
```

**To:**
```typescript
// ✅ New
{images.length > 0 && (
  <div className="mb-4">
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-medium text-muted-foreground">Recent</span>
      <button className="text-xs text-primary hover:underline">View all</button>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {images.slice(0, 20).map((item, index) => (
        <div 
          key={item.id}
          className="relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent hover:border-primary transition-colors"
          onClick={() => {
            setGeneratedImage(item.image_url);
            setGeneratedImageAspectRatio(item.aspect_ratio);
          }}
        >
          <img src={item.image_url} alt={`Generated ${index + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  </div>
)}
```

---

## 🎯 Benefits of Supabase

### **vs localStorage:**

| Feature | localStorage | Supabase |
|---------|-------------|----------|
| **Storage** | 5-10MB limit | Unlimited |
| **Persistence** | Browser only | Cloud storage |
| **Multi-device** | ❌ No | ✅ Yes |
| **User-specific** | ❌ No | ✅ Yes |
| **Real-time** | ❌ No | ✅ Yes |
| **Backup** | ❌ No | ✅ Yes |
| **Search** | ❌ Limited | ✅ Full SQL |
| **Security** | ❌ Client-side | ✅ RLS policies |

### **Features:**

**User-Specific Storage:**
- Each user only sees their own images
- Automatic filtering by `user_id`
- Row Level Security enforced

**Real-Time Updates:**
- Live sync across tabs/devices
- Instant updates when images are generated
- No manual refresh needed

**Scalability:**
- Store thousands of images per user
- Fast queries with indexes
- Cloud storage for image URLs

**Security:**
- RLS policies prevent unauthorized access
- Users can only CRUD their own data
- SQL injection protection

---

## 📊 Database Schema

### **generated_images Table:**

```sql
CREATE TABLE generated_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  image_url TEXT NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Indexes:**

```sql
-- Fast user queries
CREATE INDEX idx_generated_images_user_id 
  ON generated_images(user_id);

-- Fast sorting by date
CREATE INDEX idx_generated_images_created_at 
  ON generated_images(created_at DESC);
```

### **RLS Policies:**

```sql
-- Users can only view their own images
CREATE POLICY "Users can view own images"
  ON generated_images FOR SELECT
  USING (user_id = current_user_id);

-- Users can only insert their own images
CREATE POLICY "Users can insert own images"
  ON generated_images FOR INSERT
  WITH CHECK (user_id = current_user_id);

-- Users can only delete their own images
CREATE POLICY "Users can delete own images"
  ON generated_images FOR DELETE
  USING (user_id = current_user_id);
```

---

## 🧪 Testing

### **1. Generate an Image:**
```typescript
// In image-generator.tsx
const imageUrl = "https://example.com/image.png";
await saveImage({
  image_url: imageUrl,
  prompt: "A beautiful sunset",
  model: "Flux Ultra Raw 1.1",
  aspect_ratio: "16:9",
});
```

### **2. Check Supabase:**
1. Go to **Table Editor**
2. Select `generated_images`
3. You should see your new row

### **3. Verify Real-Time:**
1. Open app in two browser tabs
2. Generate image in tab 1
3. Tab 2 should update automatically

---

## 🚀 Next Steps

1. **Add Supabase credentials to `.env`**
2. **Run SQL migration in Supabase dashboard**
3. **Update `image-generator.tsx` with new code**
4. **Test image generation**
5. **Verify images appear in history**

---

## 📝 Quick Checklist

- [ ] Created Supabase project
- [ ] Copied URL and anon key
- [ ] Added to `.env` file
- [ ] Ran SQL migration
- [ ] Verified table created
- [ ] Updated image-generator.tsx
- [ ] Tested image generation
- [ ] Verified real-time updates

---

**Your images will now be stored in Supabase with user-specific access!** 🎉💜
