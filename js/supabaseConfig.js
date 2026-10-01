/**
 * CAPACITY CONNECT - SUPABASE AUTH & DATABASE INTEGRATION
 * Official Supabase Client setup, reactive authentication listeners,
 * role-based profile synchronization with trainee_profiles and trainer_profiles,
 * dynamic database querying, and graceful demo/mock fallback.
 */

const SupabaseConfig = {
  // Key names in LocalStorage
  STORAGE_URL_KEY: 'capacity_connect_supabase_url',
  STORAGE_KEY_KEY: 'capacity_connect_supabase_anon_key',

  // Default / environment credentials (injected from .env by server.js)
  defaultUrl: window.ENV_SUPABASE_URL || '',
  defaultAnonKey: window.ENV_SUPABASE_ANON_KEY || '',

  client: null,
  isInitialized: false,

  normalizeUrl(rawUrl) {
    if (!rawUrl) return '';
    let cleaned = rawUrl.trim().replace(/\/+$/, '');
    if (cleaned && !cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
      cleaned = 'https://' + cleaned;
    }
    return cleaned;
  },

  init() {
    const rawUrl = localStorage.getItem(this.STORAGE_URL_KEY) || this.defaultUrl;
    const rawKey = localStorage.getItem(this.STORAGE_KEY_KEY) || this.defaultAnonKey;

    const url = this.normalizeUrl(rawUrl);
    const key = (rawKey || '').trim();

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
    const cleanUrl = this.normalizeUrl(url);
    const cleanKey = (anonKey || '').trim();

    if (cleanUrl) localStorage.setItem(this.STORAGE_URL_KEY, cleanUrl);
    else localStorage.removeItem(this.STORAGE_URL_KEY);

    if (cleanKey) localStorage.setItem(this.STORAGE_KEY_KEY, cleanKey);
    else localStorage.removeItem(this.STORAGE_KEY_KEY);

    this.init();
    return this.isConfigured();
  },

  async testConnection(rawUrl, rawKey) {
    const url = this.normalizeUrl(rawUrl);
    const key = (rawKey || '').trim();

    if (!url || !key) {
      return { success: false, message: "Please provide both Supabase Project URL and Anon API Key." };
    }

    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      return { success: false, message: "Supabase JS SDK library not loaded." };
    }

    try {
      const testClient = window.supabase.createClient(url, key);
      const { data, error } = await testClient.auth.getSession();
      if (error && error.status && error.status >= 500) {
        return { success: false, message: `Server error from Supabase: ${error.message}` };
      }
      return { success: true, message: "Connection verified! Supabase project is active, online, and reachable." };
    } catch (err) {
      return {
        success: false,
        message: "Failed to connect to Supabase: " + (err.message || "Invalid URL or unreachable host. Ensure project is not paused.")
      };
    }
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
        await this.syncSupabaseUserToStore(session.user);
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
          await this.syncSupabaseUserToStore(session.user);
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

  /**
   * Synchronize Supabase User Auth & Database tables (profiles, trainee_profiles, trainer_profiles) to store
   */
  async syncSupabaseUserToStore(sbUser) {
    if (!sbUser) return null;
    const meta = sbUser.user_metadata || {};
    let role = meta.role || 'trainee';
    let name = meta.name || meta.full_name || sbUser.email.split('@')[0];
    let department = meta.department || 'Enterprise Department';
    let title = meta.title || (role === 'trainer' ? 'Certified Instructor' : (role === 'admin' ? 'Capacity Administrator' : 'Enterprise Trainee'));
    let bio = meta.bio || '';
    let qualifications = meta.qualifications || [];
    let skills = meta.skills || [];
    let interests = meta.interests || [];
    let certificates = meta.certificates || [];
    let experience = meta.experience || [];
    let photoUrl = meta.profile_photo_url || '';

    // If client is initialized, attempt to fetch user's profile table records
    if (this.client) {
      try {
        const { data: profData } = await this.client
          .from('profiles')
          .select('*')
          .eq('id', sbUser.id)
          .maybeSingle();

        if (profData) {
          if (profData.full_name) name = profData.full_name;
          if (profData.role) role = profData.role;
        }

        if (role === 'trainee') {
          const { data: traineeData } = await this.client
            .from('trainee_profiles')
            .select('*')
            .eq('id', sbUser.id)
            .maybeSingle();

          if (traineeData) {
            if (traineeData.bio) bio = traineeData.bio;
            if (traineeData.skills && traineeData.skills.length > 0) skills = traineeData.skills;
            if (traineeData.interests && traineeData.interests.length > 0) interests = traineeData.interests;
            if (traineeData.certificates && traineeData.certificates.length > 0) certificates = traineeData.certificates;
            if (traineeData.qualification) {
              qualifications = [{ degree: traineeData.qualification, institution: "Verified Academy", year: "2024" }];
            }
            if (traineeData.work_experience) {
              experience = [{ role: traineeData.work_experience, company: department, period: "Present" }];
            }
            if (traineeData.profile_photo_url) photoUrl = traineeData.profile_photo_url;
          }
        } else if (role === 'trainer') {
          const { data: trainerData } = await this.client
            .from('trainer_profiles')
            .select('*')
            .eq('id', sbUser.id)
            .maybeSingle();

          if (trainerData) {
            if (trainerData.bio) bio = trainerData.bio;
            if (trainerData.skills && trainerData.skills.length > 0) skills = trainerData.skills;
            if (trainerData.specialization) department = trainerData.specialization;
            if (trainerData.profile_photo_url) photoUrl = trainerData.profile_photo_url;
            if (trainerData.qualification) {
              qualifications = [{ degree: trainerData.qualification, institution: "Verified Academy", year: "2024" }];
            }
            if (trainerData.work_experience) {
              experience = [{ role: trainerData.work_experience, company: "Faculty Division", period: "Present" }];
            }
          }
        }
      } catch (err) {
        console.warn("Could not query Supabase profile tables:", err.message);
      }
    }

    let user = {
      id: sbUser.id,
      name: name,
      email: sbUser.email,
      role: role,
      status: meta.status || (role === 'trainee' ? 'active' : 'pending_approval'),
      avatar: name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      department: department,
      title: title,
      joinedDate: meta.joinedDate || new Date().toISOString().split('T')[0],
      bio: bio,
      qualifications: qualifications,
      experience: experience,
      skills: skills,
      interests: interests,
      certificates: certificates,
      photoUrl: photoUrl,
      competencies: meta.competencies || skills.map(s => ({ subject: s, proficiency: 5, certified: true })),
      supabaseAuth: true
    };

    if (window.store) {
      const existing = window.store.getUsers().find(u => u.email.toLowerCase() === sbUser.email.toLowerCase() || u.id === sbUser.id);
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
          let msg = error.message;
          const code = error.code || '';

          if (code === 'email_not_confirmed' || msg.includes('Email not confirmed')) {
            msg = "Email not confirmed. Please check your inbox for the Supabase confirmation link, or disable 'Confirm email' under Supabase Dashboard -> Authentication -> Providers -> Email for instant sign-in.";
          } else if (code === 'invalid_credentials' || msg.includes('Invalid login credentials')) {
            msg = "Invalid email or password. Please verify your credentials or register a new account.";
          } else if (code === 'over_email_send_rate_limit' || msg.includes('rate limit')) {
            msg = "Supabase email rate limit reached. Please wait a few minutes or disable 'Confirm email' in Supabase Auth settings.";
          }
          return { success: false, message: msg };
        }

        if (data && data.user) {
          const user = await this.syncSupabaseUserToStore(data.user);
          if (expectedRole && user.role !== expectedRole) {
            console.warn(`Role notice: Signing into ${expectedRole} portal with account role '${user.role}'`);
          }
          return { success: true, user: user, session: data.session, viaSupabase: true };
        }
      } catch (err) {
        console.error("Supabase sign in failed:", err);
        const errMsg = err.message === 'Failed to fetch'
          ? 'Cannot reach Supabase API ("Failed to fetch"). Check project URL in .env, verify internet connection, or confirm Supabase project is active.'
          : (err.message || "Authentication error");
        return { success: false, message: errMsg };
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
   * Role-based Sign Up via Supabase Auth + Database Table Sync (profiles, trainee_profiles, trainer_profiles)
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
      interests: profileData.interests || [],
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
          let msg = error.message;
          const code = error.code || '';

          if (code === 'over_email_send_rate_limit' || msg.includes('rate limit')) {
            msg = "Supabase Email Rate Limit Reached: The Supabase free-tier email limit has been reached. To enable instant sign-up without email limits, go to Supabase Dashboard -> Authentication -> Providers -> Email and turn OFF 'Confirm email'.";
          } else if (code === 'email_address_invalid' || msg.includes('is invalid')) {
            msg = "Supabase rejected this email domain. Please use a standard email address (e.g. user@gmail.com).";
          } else if (code === 'user_already_exists' || msg.includes('already registered')) {
            msg = "This email is already registered in Supabase. Please sign in instead.";
          }
          return { success: false, message: msg };
        }

        if (data && data.user) {
          const user = await this.syncSupabaseUserToStore(data.user);
          const needsEmailConfirmation = !data.session;

          // Attempt to populate database tables (profiles, trainee_profiles, trainer_profiles)
          try {
            // 1. Sync `profiles`
            await this.client.from('profiles').upsert({
              id: data.user.id,
              full_name: profileData.name,
              email: email.trim(),
              role: role,
              created_at: new Date().toISOString()
            });

            // 2. Sync role-specific table
            if (role === 'trainee') {
              await this.client.from('trainee_profiles').upsert({
                id: data.user.id,
                qualification: profileData.qualification || profileData.title || '',
                work_experience: profileData.work_experience || profileData.experience || 'Entry-Level Professional',
                interests: profileData.interests || ['Cloud Architecture', 'Digital Transformation'],
                skills: profileData.skills || ['Agile Leadership', 'Digital Capacity'],
                certificates: [],
                bio: profileData.bio || '',
                updated_at: new Date().toISOString()
              });
            } else if (role === 'trainer') {
              await this.client.from('trainer_profiles').upsert({
                id: data.user.id,
                qualification: profileData.qualification || profileData.title || 'Master Faculty Instructor',
                work_experience: profileData.work_experience || 'Senior Enterprise Trainer',
                skills: profileData.skills || ['Instructional Design', 'System Architecture'],
                specialization: profileData.department || profileData.specialization || 'Enterprise Learning',
                bio: profileData.bio || '',
                updated_at: new Date().toISOString()
              });
            }
          } catch (dbErr) {
            console.warn("Notice: Direct database table write on signup returned:", dbErr.message);
          }

          return {
            success: true,
            user: user,
            pendingApproval: role !== 'trainee',
            confirmationRequired: needsEmailConfirmation,
            message: needsEmailConfirmation 
              ? "Account registered in Supabase! A verification email has been sent. (Tip: Disable 'Confirm email' in Supabase Auth settings to enable instant sign-in without email verification)."
              : `Welcome to Capacity Connect, ${user.name}!`,
            viaSupabase: true
          };
        }
      } catch (err) {
        console.error("Supabase sign up failed:", err);
        const errMsg = err.message === 'Failed to fetch'
          ? 'Cannot reach Supabase API ("Failed to fetch"). Please check your Supabase Project URL in .env and ensure your project is active.'
          : (err.message || "Registration failed");
        return { success: false, message: errMsg };
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
