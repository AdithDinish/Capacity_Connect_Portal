/**
 * CAPACITY CONNECT - SUPABASE AUTH & DATABASE INTEGRATION
 * Official Supabase Client setup, reactive authentication listeners,
 * role-based profile synchronization, and graceful demo/mock fallback.
 */

const SupabaseConfig = {
  // Key names in LocalStorage
  STORAGE_URL_KEY: 'capacity_connect_supabase_url',
  STORAGE_KEY_KEY: 'capacity_connect_supabase_anon_key',

  // Default / environment credentials (if provided by host environment)
  defaultUrl: window.ENV_SUPABASE_URL || '',
  defaultAnonKey: window.ENV_SUPABASE_ANON_KEY || '',

  client: null,
  isInitialized: false,

  init() {
    const url = localStorage.getItem(this.STORAGE_URL_KEY) || this.defaultUrl;
    const key = localStorage.getItem(this.STORAGE_KEY_KEY) || this.defaultAnonKey;

    if (url && key && window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        this.client = window.supabase.createClient(url, key, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        this.isInitialized = true;
        console.log("⚡ Supabase Client initialized successfully with URL:", url);
        this.setupAuthListener();
        this.checkExistingSession();
      } catch (err) {
        console.warn("⚠️ Failed to initialize Supabase client:", err);
        this.client = null;
        this.isInitialized = false;
      }
    } else {
      this.client = null;
      this.isInitialized = false;
    }
  },

  isConfigured() {
    return this.isInitialized && this.client !== null;
  },

  getCredentials() {
    return {
      url: localStorage.getItem(this.STORAGE_URL_KEY) || this.defaultUrl || '',
      anonKey: localStorage.getItem(this.STORAGE_KEY_KEY) || this.defaultAnonKey || ''
    };
  },

  saveCredentials(url, anonKey) {
    if (url) localStorage.setItem(this.STORAGE_URL_KEY, url.trim());
    else localStorage.removeItem(this.STORAGE_URL_KEY);

    if (anonKey) localStorage.setItem(this.STORAGE_KEY_KEY, anonKey.trim());
    else localStorage.removeItem(this.STORAGE_KEY_KEY);

    this.init();
    return this.isConfigured();
  },

  async checkExistingSession() {
    if (!this.isConfigured()) return null;
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      if (error) {
        console.warn("Supabase session check error:", error);
        return null;
      }
      if (session && session.user) {
        this.syncSupabaseUserToStore(session.user);
        return session.user;
      }
    } catch (e) {
      console.warn("Session check exception:", e);
    }
    return null;
  },

  setupAuthListener() {
    if (!this.isConfigured()) return;
    try {
      this.client.auth.onAuthStateChange(async (event, session) => {
        console.log("Supabase Auth Event:", event);
        if (event === 'SIGNED_IN' && session && session.user) {
          this.syncSupabaseUserToStore(session.user);
          if (window.Auth && typeof window.Auth.updateUserUI === 'function') {
            window.Auth.updateUserUI();
          }
        } else if (event === 'SIGNED_OUT') {
          if (window.store) {
            window.store.setCurrentUser(null);
          }
          if (window.Auth && typeof window.Auth.updateUserUI === 'function') {
            window.Auth.updateUserUI();
          }
        }
      });
    } catch (e) {
      console.warn("Error setting up Supabase auth listener:", e);
    }
  },

  syncSupabaseUserToStore(sbUser) {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    const role = meta.role || 'trainee';
    const name = meta.name || meta.full_name || sbUser.email.split('@')[0];

    let user = {
      id: sbUser.id,
      name: name,
      email: sbUser.email,
      role: role,
      status: meta.status || (role === 'trainee' ? 'active' : 'pending_approval'),
      avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      department: meta.department || 'Enterprise Department',
      title: meta.title || (role === 'trainer' ? 'Certified Instructor' : (role === 'admin' ? 'Capacity Administrator' : 'Enterprise Trainee')),
      joinedDate: meta.joinedDate || new Date().toISOString().split('T')[0],
      bio: meta.bio || '',
      qualifications: meta.qualifications || [],
      experience: meta.experience || [],
      skills: meta.skills || [],
      competencies: meta.competencies || [],
      supabaseAuth: true
    };

    if (window.store) {
      // Check if user already exists in local state or register them
      const existing = window.store.getUsers().find(u => u.email.toLowerCase() === sbUser.email.toLowerCase());
      if (existing) {
        user = { ...existing, ...user };
      } else {
        window.store.data.users.push(user);
        window.store.saveData();
      }
      window.store.setCurrentUser(user);
    }
    return user;
  },

  /**
   * Role-based Sign In via Supabase Auth
   */
  async signIn(email, password, expectedRole = null) {
    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (error) {
          return { success: false, message: error.message };
        }

        if (data && data.user) {
          const user = this.syncSupabaseUserToStore(data.user);
          // Verify role if specified
          if (expectedRole && user.role !== expectedRole) {
            console.warn(`Role mismatch: Expected ${expectedRole}, got ${user.role}`);
          }
          return { success: true, user: user, session: data.session, viaSupabase: true };
        }
      } catch (err) {
        console.error("Supabase sign in failed:", err);
        return { success: false, message: err.message || "Authentication error" };
      }
    }

    // Fallback to local store demo mode if Supabase not configured
    const localRes = window.store.login(email, password);
    if (localRes.success) {
      return { ...localRes, viaSupabase: false };
    }
    return localRes;
  },

  /**
   * Role-based Sign Up via Supabase Auth
   */
  async signUp(email, password, profileData) {
    const role = profileData.role || 'trainee';
    const metadata = {
      name: profileData.name,
      role: role,
      department: profileData.department || '',
      title: profileData.title || '',
      bio: profileData.bio || '',
      qualifications: profileData.qualifications || [],
      experience: profileData.experience || [],
      skills: profileData.skills || [],
      competencies: profileData.competencies || [],
      status: role === 'trainee' ? 'active' : 'pending_approval',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    if (this.isConfigured()) {
      try {
        const { data, error } = await this.client.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: metadata
          }
        });

        if (error) {
          return { success: false, message: error.message };
        }

        if (data && data.user) {
          // Attempt to insert into Supabase 'profiles' table if the user has created it
          try {
            await this.client.from('profiles').upsert({
              id: data.user.id,
              name: metadata.name,
              email: email.trim(),
              role: role,
              department: metadata.department,
              title: metadata.title,
              bio: metadata.bio,
              status: metadata.status,
              created_at: new Date().toISOString()
            });
          } catch (dbErr) {
            console.info("Profiles table sync skipped or not created yet:", dbErr.message);
          }

          const user = this.syncSupabaseUserToStore(data.user);
          return {
            success: true,
            user: user,
            pendingApproval: role !== 'trainee',
            confirmationRequired: !data.session,
            message: !data.session ? "Verification email sent. Please verify your email to log in." : "Account created successfully.",
            viaSupabase: true
          };
        }
      } catch (err) {
        console.error("Supabase sign up failed:", err);
        return { success: false, message: err.message || "Registration failed" };
      }
    }

    // Fallback to local store demo mode
    const localRes = window.store.registerUser({
      name: profileData.name,
      email: email,
      password: password,
      role: role,
      department: profileData.department,
      title: profileData.title,
      bio: profileData.bio,
      qualifications: profileData.qualifications,
      experience: profileData.experience,
      skills: profileData.skills,
      competencies: profileData.competencies
    });
    return { ...localRes, viaSupabase: false };
  },

  /**
   * Sign out
   */
  async signOut() {
    if (this.isConfigured()) {
      try {
        await this.client.auth.signOut();
      } catch (err) {
        console.warn("Supabase sign out error:", err);
      }
    }
    if (window.store) {
      window.store.setCurrentUser(null);
    }
    return { success: true };
  }
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  window.SupabaseConfig = SupabaseConfig;
}
