/**
 * ============================================
 * Supabase Configuration
 * ============================================
 * Replace these with your Supabase project credentials.
 * Find them at: Supabase Dashboard → Settings → API
 */

const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';   // ← Replace
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';                     // ← Replace

// Initialize Supabase client
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Site constants
const SITE_NAME = 'RentEase';

// Detect base path for relative links between pages
const IS_IN_PAGES = window.location.pathname.includes('/pages/');
const BASE = IS_IN_PAGES ? '..' : '.';
const PAGES = IS_IN_PAGES ? '.' : './pages';
