# Supabase Setup Guide

Follow these steps to set up Supabase as the backend for Joviter's Kitchen.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Sign up or log in with your preferred method

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in your project details:
   - Name: `joviters-kitchen` (or your preferred name)
   - Database Password: Make sure to save this!
   - Region: Choose the closest region to your users
3. Click "Create new project"
4. Wait for your project to be ready (this might take a few minutes)

## Step 3: Configure Environment Variables

1. In your Supabase project dashboard, go to `Project Settings` > `API`
2. Copy your:
   - Project URL
   - anon public key

3. Create a new file called `.env.local` in the root of your project:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual credentials from Supabase.

## Step 4: Set Up the Database

### Option 1: Use the SQL Editor (Recommended)

1. In your Supabase dashboard, go to `SQL Editor` > `New query`
2. Copy and paste the SQL from `database/schema.sql`
3. Click "Run" to execute the query

### Option 2: Use the Supabase Dashboard UI

You can also create the tables manually via the Table Editor, but using the SQL script is faster and more reliable.

## Step 5: Seed the Database

1. In the SQL Editor, create a new query
2. Copy and paste the SQL from `database/seed.sql`
3. Click "Run" to add the sample menu items

## Step 6: Verify the Setup

1. Start your development server: `npm run dev`
2. Open your browser and go to `http://localhost:3000`
3. You should see the app loading menu items from Supabase!

## Step 7: Next Steps (Optional)

### Add User Authentication

If you want to add user authentication:

1. Go to `Authentication` > `Providers` in your Supabase dashboard
2. Enable the providers you want (Email, Google, etc.)

### Set Up Storage for Images

1. Go to `Storage` in your Supabase dashboard
2. Create a new bucket called `menu-images`
3. Update the security policies to allow public access (for simplicity)

### Customize Security Policies

By default, the schema uses very permissive policies for demonstration purposes. For production:

1. Go to `Authentication` > `Policies`
2. Update the policies to be more restrictive
3. Consider adding Row Level Security (RLS) tailored to your needs

## Troubleshooting

### Menu items not loading?

- Check that your `.env.local` is correctly set up
- Verify that you ran the seed script
- Check the browser console for errors

### Orders not saving?

- Make sure the tables were created properly
- Check the SQL Editor to verify data is being written

### Images not showing?

- Verify that the image URLs in your menu items are valid
- Check the Supabase image host configuration in `next.config.ts`

## Project Structure for Supabase

```
joviters-kitchen/
├── lib/
│   ├── supabase.ts          # Supabase client configuration
│   └── services/
│       ├── menuService.ts    # Menu data operations
│       └── orderService.ts   # Order management
├── database/
│   ├── schema.sql            # Database schema
│   └── seed.sql              # Sample data
└── SUPABASE_SETUP.md         # This file
```
