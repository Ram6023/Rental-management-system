# 🏠 RentEase — House Rental Management System

A modern, serverless house rental management platform built with **pure HTML/CSS/JavaScript** and **Supabase** as the backend. No server, no PHP, no XAMPP — runs entirely in the browser.

![RentEase Landing Page](https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop)

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Email/password sign up & sign in via Supabase Auth |
| 👥 **Role-Based Access** | Separate flows for Tenant, Owner, and Admin |
| 🔍 **Smart Search** | Filter by location, budget, and BHK type |
| 🏡 **Property CRUD** | Add, edit, delete properties with image upload |
| 💬 **Messaging** | In-app chat between tenants and owners |
| 💳 **Payment Tracking** | View and manage payment history |
| ❤️ **Wishlist** | Save and compare favorite properties |
| 📊 **Dashboards** | Owner & Admin dashboards with Chart.js analytics |
| 📱 **WhatsApp Integration** | Contact owners directly via WhatsApp |
| 🌙 **Dark Mode** | Toggle between light and dark themes |
| 📱 **Fully Responsive** | Works on desktop, tablet, and mobile |

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Bootstrap 5, Vanilla JavaScript |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Charts** | Chart.js |
| **Icons** | Bootstrap Icons |
| **Fonts** | Inter, Plus Jakarta Sans (Google Fonts) |
| **Hosting** | Vercel (static deployment) |
| **Server Required** | ❌ None |

## 📁 Project Structure

```
Rental-management/
├── index.html                    # Landing page
├── database.sql                  # Supabase PostgreSQL schema
├── vercel.json                   # Vercel deployment config
├── assets/
│   ├── css/style.css             # Complete design system (900+ lines)
│   └── js/
│       ├── config.js             # Supabase URL + anon key
│       ├── auth.js               # Auth helpers & route guards
│       └── app.js                # Shared UI, search, messaging, uploads
└── pages/
    ├── login.html                # Sign in
    ├── register.html             # Sign up with role selection
    ├── home.html                 # Tenant homepage (search + browse)
    ├── properties.html           # Public property listing
    ├── property-detail.html      # Single property view
    ├── owner-dashboard.html      # Owner stats & management
    ├── admin-dashboard.html      # Admin overview
    ├── add-property.html         # Add new property
    ├── edit-property.html        # Edit property
    ├── my-properties.html        # Owner's property grid
    ├── messages.html             # Chat system
    ├── payments.html             # Payment history
    ├── wishlist.html             # Saved properties
    └── profile.html              # User profile & password change
```

## 🚀 Quick Start

### Prerequisites
- A [Supabase](https://supabase.com) account (free tier works)
- Any static file server (VS Code Live Server, `npx serve`, Python HTTP server, etc.)

### Setup (5 minutes)

**1. Clone the repo**
```bash
git clone https://github.com/Ram6023/Rental-management-system.git
cd Rental-management-system
```

**2. Create Supabase project**
- Go to [supabase.com](https://supabase.com) → New Project
- Copy your **Project URL** and **anon public key** from Settings → API

**3. Run database schema**
- Go to SQL Editor in Supabase Dashboard
- Paste the entire `database.sql` and click **Run**

**4. Configure credentials**
Edit `assets/js/config.js`:
```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
```

**5. Create storage bucket**
- Supabase Dashboard → Storage → New Bucket
- Name: `property-images` → Check "Public bucket" → Create

**6. Disable email confirmation (for development)**
- Authentication → Providers → Email → Turn OFF "Confirm email" → Save

**7. Run locally**
```bash
npx -y serve . -l 3000
```
Open `http://localhost:3000`

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Owner | `owner@demo.com` | `Demo@1234` |
| Tenant | `tenant@demo.com` | `Demo@1234` |

> Register these accounts via the app's registration page after setup.

## 🔄 User Flow

```
Landing Page → Register/Login
    ├── Tenant → Home (Browse) → Search → Property Detail → Wishlist/Message/WhatsApp
    ├── Owner  → Dashboard → Add/Edit/Delete Properties → View Messages
    └── Admin  → Admin Dashboard → Manage Users & Properties
```

## 🛡️ Security

- **Supabase Auth** — JWT-based session management
- **Row Level Security (RLS)** — Every table has RLS policies
- **Client-side guards** — `requireAuth()`, `requireOwner()`, `requireAdmin()`
- **Auto-redirect** — Logged-in users skip landing/login pages
- **No service_role key** — Only the safe `anon` key is used client-side

## 🌍 Deployment

Deployed on **Vercel** as a static site:

1. Push code to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Set Framework Preset to `Other`
4. Leave Build Command empty, Output Directory as `.`
5. Click Deploy ✅

## 🎨 Design Theme

**Deep Amethyst & Obsidian** — A premium dark theme with:
- Indigo/violet primary colors (`#6366f1`)
- Dark gradient backgrounds
- Glassmorphism effects
- Smooth micro-animations
- Inter + Plus Jakarta Sans typography

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) — Backend as a Service
- [Bootstrap 5](https://getbootstrap.com) — CSS Framework
- [Chart.js](https://chartjs.org) — Charts & Analytics
- [Unsplash](https://unsplash.com) — Property Images
- [Vercel](https://vercel.com) — Hosting

---

Made with ❤️ by [Ram6023](https://github.com/Ram6023)
