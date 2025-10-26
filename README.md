# ClickUp Client Portal

A professional client portal that syncs with ClickUp tasks, built with Next.js, Supabase, and TypeScript.

## Features

- 🔐 Secure authentication with Supabase
- 👥 Client management and user assignment  
- 📋 ClickUp task synchronization
- 🎨 Clean, professional UI with Tailwind CSS
- 🔒 Row-level security for data protection
- ⚡ Built with TypeScript for type safety

## Setup Instructions

### 1. Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CLICKUP_API_TOKEN=your_clickup_token