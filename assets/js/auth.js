/**
 * ============================================
 * Auth Module — Supabase Auth Helpers
 * ============================================
 */

/** Get current session */
async function getSession() {
    const { data: { session } } = await sb.auth.getSession();
    return session;
}

/** Get current user or null */
async function getUser() {
    const session = await getSession();
    return session?.user || null;
}

/** Get user's profile (name, role, phone) from profiles table */
async function getProfile(userId) {
    if (!userId) {
        const user = await getUser();
        if (!user) return null;
        userId = user.id;
    }
    const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
    return data;
}

/** Sign up a new user */
async function signUp(email, password, name, phone, role) {
    const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
            data: { name, phone, role }
        }
    });
    if (error) throw error;
    return data;
}

/** Sign in with email/password */
async function signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
}

/** Sign out */
async function signOut() {
    await sb.auth.signOut();
    window.location.href = `${BASE}/index.html`;
}

/**
 * Auth Guards — call at top of page scripts
 */

/** Redirect logged-in users away from landing/login/register */
async function redirectIfLoggedIn() {
    const user = await getUser();
    if (user) {
        const profile = await getProfile(user.id);
        redirectByRole(profile?.role);
    }
}

/** Require login — redirect to landing if not authenticated */
async function requireAuth() {
    const user = await getUser();
    if (!user) {
        window.location.href = `${BASE}/index.html`;
        return null;
    }
    const profile = await getProfile(user.id);
    return { user, profile };
}

/** Require owner role */
async function requireOwner() {
    const result = await requireAuth();
    if (result && result.profile?.role !== 'owner' && result.profile?.role !== 'admin') {
        window.location.href = `${BASE}/index.html`;
        return null;
    }
    return result;
}

/** Require admin role */
async function requireAdmin() {
    const result = await requireAuth();
    if (result && result.profile?.role !== 'admin') {
        window.location.href = `${BASE}/index.html`;
        return null;
    }
    return result;
}

/** Redirect user to their role-specific dashboard */
function redirectByRole(role) {
    switch (role) {
        case 'owner':
            window.location.href = `${PAGES}/owner-dashboard.html`;
            break;
        case 'admin':
            window.location.href = `${PAGES}/admin-dashboard.html`;
            break;
        default:
            window.location.href = `${PAGES}/home.html`;
            break;
    }
}
