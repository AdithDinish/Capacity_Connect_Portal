/**
 * CAPACITY CONNECT - ROLE-BASED AUTHENTICATION & SUPABASE CONTROLLER
 * Full support for separate Trainee, Trainer, and Admin sign in / sign up flows,
 * Supabase Auth API with user metadata sync, and live fallback to demo mock accounts.
 */

const Auth = {
  selectedRole: 'trainee', // 'trainee' | 'trainer' | 'admin'
  authMode: 'signin',      // 'signin' | 'signup'

  init() {
    // Initialize Supabase Client
    if (window.SupabaseConfig) {
      window.SupabaseConfig.init();
    }

    this.bindEvents();
    this.updateUserUI();
    this.renderAuthPage();
  },

  bindEvents() {
    // Role Switcher Demo Dropdown
    document.querySelectorAll('[data-demo-login]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-demo-login');
        this.loginAsDemo(role);
      });
    });

    // Global Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (window.SupabaseConfig) {
          await window.SupabaseConfig.signOut();
        }
        if (window.store) {
          window.store.setCurrentUser(null);
        }
        Auth.updateUserUI();
        App.showToast("Signed Out", "You have securely signed out.", "info");
        Auth.setMode('signin');
        App.navigateTo('auth');
      });
    }

    // Bind Auth Page Forms if already on page
    this.bindAuthFormEvents();
  },

  setRole(role) {
    if (!['trainee', 'trainer', 'admin'].includes(role)) return;
    this.selectedRole = role;
    this.renderAuthPage();
  },

  setMode(mode) {
    if (!['signin', 'signup'].includes(mode)) return;
    this.authMode = mode;
    this.renderAuthPage();
  },

  async logoutAndStayOnAuth() {
    if (window.SupabaseConfig) {
      await window.SupabaseConfig.signOut();
    } else if (window.store) {
      window.store.setCurrentUser(null);
    }
    this.updateUserUI();
    this.renderAuthPage();
    App.showToast("Signed Out", "Switched to guest mode. You can now sign in with any role.", "info");
  },

  toggleSupabaseDrawer() {
    const drawer = document.getElementById('supabase-config-drawer');
    if (drawer) {
      drawer.classList.toggle('show');
      if (window.lucide) window.lucide.createIcons();
    }
  },

  async testSupabaseConfig() {
    const url = document.getElementById('sb-input-url').value.trim();
    const key = document.getElementById('sb-input-key').value.trim();

    if (!url || !key) {
      App.showToast("Missing Credentials", "Please enter both Supabase URL and Anon Key to test.", "warning");
      return;
    }

    App.showToast("Testing Connection...", "Verifying Supabase project reachability...", "info");
    if (window.SupabaseConfig) {
      const res = await window.SupabaseConfig.testConnection(url, key);
      if (res.success) {
        App.showToast("Connection Successful", res.message, "success");
      } else {
        App.showToast("Connection Failed", res.message, "error");
      }
    }
  },

  saveSupabaseConfig(e) {
    if (e) e.preventDefault();
    const url = document.getElementById('sb-input-url').value.trim();
    const key = document.getElementById('sb-input-key').value.trim();

    if (window.SupabaseConfig) {
      const ok = window.SupabaseConfig.saveCredentials(url, key);
      if (ok) {
        App.showToast("Supabase Connected", "Supabase Client initialized with your credentials.", "success");
      } else if (!url && !key) {
        App.showToast("Supabase Reset", "Switched back to local demo mock mode.", "info");
      } else {
        App.showToast("Connection Error", "Please verify your Supabase URL & Anon Key format.", "warning");
      }
      this.renderAuthPage();
    }
  },

  renderAuthPage() {
    const container = document.getElementById('auth-view-content');
    if (!container) return;

    const isConnected = window.SupabaseConfig && window.SupabaseConfig.isConfigured();
    const creds = window.SupabaseConfig ? window.SupabaseConfig.getCredentials() : { url: '', anonKey: '' };

    const roleInfo = {
      trainee: {
        title: "Trainee Portal Access",
        subtitle: "Access personalized learning paths, take timed assessments, and earn verifiable certificates.",
        badge: "Trainee",
        badgeClass: "badge-trainee",
        icon: "user-check",
        color: "var(--role-trainee)",
        demoEmail: "priya.sharma@capacityconnect.org",
        demoName: "Priya Sharma (Senior Business Analyst)"
      },
      trainer: {
        title: "Trainer Studio Access",
        subtitle: "Author benchmark questionnaires, manage competencies, and upload knowledge library assets.",
        badge: "Trainer",
        badgeClass: "badge-trainer",
        icon: "presentation",
        color: "var(--role-trainer)",
        demoEmail: "marcus.vance@capacityconnect.org",
        demoName: "Dr. Marcus Vance (Principal Cloud Architect)"
      },
      admin: {
        title: "Directorate Admin Center",
        subtitle: "Review instructor approvals, publish organization-wide broadcasts, and audit analytics.",
        badge: "Admin",
        badgeClass: "badge-admin",
        icon: "shield-check",
        color: "var(--role-admin)",
        demoEmail: "admin@capacityconnect.org",
        demoName: "Eleanor Vance (Chief Capacity Officer)"
      }
    };

    const current = roleInfo[this.selectedRole];
    const loggedInUser = window.store ? window.store.getCurrentUser() : null;

    container.innerHTML = `
      <div class="auth-page-wrap">
        <div class="auth-card-container">
          
          ${loggedInUser ? `
            <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-left:4px solid var(--role-${loggedInUser.role}); border-radius:var(--radius-md); padding:14px 18px; margin-bottom:18px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; box-shadow:var(--shadow-sm);">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="table-avatar" style="background:var(--role-${loggedInUser.role}-bg); color:var(--role-${loggedInUser.role}); font-weight:700;">${loggedInUser.avatar || 'CC'}</div>
                <div>
                  <div style="font-size:0.875rem; font-weight:700; color:var(--text-primary);">
                    Active Session: ${loggedInUser.name} <span class="badge badge-${loggedInUser.role}" style="font-size:0.65rem; vertical-align:middle;">${loggedInUser.role.toUpperCase()}</span>
                  </div>
                  <div style="font-size:0.775rem; color:var(--text-muted);">${loggedInUser.email} • ${loggedInUser.department}</div>
                </div>
              </div>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn btn-sm btn-outline" onclick="App.navigateByRole('${loggedInUser.role}')" style="font-size:0.75rem;">
                  <i data-lucide="layout-dashboard"></i> Go to Dashboard
                </button>
                <button type="button" class="btn btn-sm btn-ghost" onclick="Auth.logoutAndStayOnAuth()" style="font-size:0.75rem; color:var(--color-danger);">
                  <i data-lucide="log-out"></i> Switch / Sign Out
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Supabase Connection Pill & Quick Settings Drawer -->
          <div class="supabase-status-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="supabase-status-pill ${isConnected ? 'connected' : 'mock'}">
                <i data-lucide="${isConnected ? 'check-circle' : 'zap'}" style="width:12px; height:12px;"></i>
                ${isConnected ? 'Supabase Auth: LIVE' : 'Supabase Auth: Configurable (Mock Mode)'}
              </span>
              <span style="color:var(--text-muted); font-size:0.75rem;">
                ${isConnected ? 'Connected to your Supabase Project' : 'Using reactive store fallback'}
              </span>
            </div>
            <button type="button" class="btn btn-sm btn-ghost" onclick="Auth.toggleSupabaseDrawer()" style="font-size:0.75rem; padding:4px 8px;">
              <i data-lucide="settings" style="width:13px; height:13px;"></i> Configure Supabase
            </button>
          </div>

          <!-- Collapsible Supabase Settings Form -->
          <div class="supabase-config-drawer" id="supabase-config-drawer">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <div style="font-weight:700; font-size:0.875rem;">
                <i data-lucide="database" style="width:15px; height:15px; display:inline;"></i> Supabase Project Credentials
              </div>
              <span class="badge ${isConnected ? 'badge-success' : 'badge-primary'}" style="font-size:0.7rem;">
                ${isConnected ? 'Connected' : 'Optional'}
              </span>
            </div>
            <p style="font-size:0.775rem; color:var(--text-secondary); margin-bottom:12px;">
              Enter your Supabase project API URL and public Anonymous API Key. Once saved, sign-ups and sign-ins will be authenticated directly via Supabase Auth.
            </p>
            <form onsubmit="Auth.saveSupabaseConfig(event)">
              <div class="form-group" style="margin-bottom:8px;">
                <label class="form-label" style="font-size:0.75rem;">Supabase Project URL</label>
                <input type="url" class="form-input" id="sb-input-url" placeholder="https://xyzproject.supabase.co" value="${creds.url}" style="font-size:0.8rem; padding:6px 10px;">
              </div>
              <div class="form-group" style="margin-bottom:12px;">
                <label class="form-label" style="font-size:0.75rem;">Supabase Anon / Public Key</label>
                <input type="password" class="form-input" id="sb-input-key" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." value="${creds.anonKey}" style="font-size:0.8rem; padding:6px 10px;">
              </div>
              <div style="display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap;">
                <button type="button" class="btn btn-sm btn-outline" onclick="Auth.testSupabaseConfig()" style="font-size:0.75rem;">
                  <i data-lucide="radio" style="width:12px; height:12px; display:inline;"></i> Test Connection
                </button>
                <button type="button" class="btn btn-sm btn-ghost" onclick="document.getElementById('sb-input-url').value=''; document.getElementById('sb-input-key').value=''; Auth.saveSupabaseConfig(event);" style="font-size:0.75rem;">Clear / Reset</button>
                <button type="submit" class="btn btn-sm btn-primary" style="font-size:0.75rem;">Save & Connect</button>
              </div>
            </form>
          </div>

          <!-- Step 1: Role Selector Grid -->
          <div class="auth-role-selector-grid">
            <div class="auth-role-card role-trainee ${this.selectedRole === 'trainee' ? 'active' : ''}" onclick="Auth.setRole('trainee')">
              <div class="role-icon-box">
                <i data-lucide="user-check" style="width:22px; height:22px;"></i>
              </div>
              <div class="role-card-title">Trainee</div>
              <div class="role-card-desc">Learner & Professional</div>
            </div>

            <div class="auth-role-card role-trainer ${this.selectedRole === 'trainer' ? 'active' : ''}" onclick="Auth.setRole('trainer')">
              <div class="role-icon-box">
                <i data-lucide="presentation" style="width:22px; height:22px;"></i>
              </div>
              <div class="role-card-title">Trainer</div>
              <div class="role-card-desc">Instructor & Faculty</div>
            </div>

            <div class="auth-role-card role-admin ${this.selectedRole === 'admin' ? 'active' : ''}" onclick="Auth.setRole('admin')">
              <div class="role-icon-box">
                <i data-lucide="shield-check" style="width:22px; height:22px;"></i>
              </div>
              <div class="role-card-title">Admin</div>
              <div class="role-card-desc">L&D Directorate</div>
            </div>
          </div>

          <!-- Step 2: Main Auth Panel Form -->
          <div class="auth-main-panel">
            
            <!-- Mode Switcher (Sign In vs Sign Up) -->
            <div class="auth-mode-toggle">
              <button type="button" class="auth-mode-btn ${this.authMode === 'signin' ? 'active' : ''}" onclick="Auth.setMode('signin')">
                <i data-lucide="log-in" style="width:14px; height:14px; display:inline;"></i> Sign In
              </button>
              <button type="button" class="auth-mode-btn ${this.authMode === 'signup' ? 'active' : ''}" onclick="Auth.setMode('signup')">
                <i data-lucide="user-plus" style="width:14px; height:14px; display:inline;"></i> Create Account
              </button>
            </div>

            <!-- Role Header Banner -->
            <div class="auth-role-banner role-${this.selectedRole}">
              <div style="display:flex; align-items:center; gap:10px;">
                <i data-lucide="${current.icon}" style="width:20px; height:20px;"></i>
                <div>
                  <strong style="font-size:0.95rem;">${current.title}</strong>
                  <div style="font-size:0.775rem; opacity:0.9;">${current.subtitle}</div>
                </div>
              </div>
              <span class="badge ${current.badgeClass}" style="text-transform:uppercase; font-size:0.7rem; font-weight:700;">
                ${current.badge}
              </span>
            </div>

            <!-- Quick 1-Click Demo Shortcut (for Sign In mode) -->
            ${this.authMode === 'signin' ? `
              <div class="auth-demo-shortcut">
                <div>
                  <span style="font-weight:600; color:var(--text-primary);">Demo Preset:</span>
                  <span style="color:var(--text-secondary); margin-left:4px;">${current.demoName}</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline" onclick="Auth.fillDemoCredentials('${this.selectedRole}')" style="font-size:0.75rem; padding:3px 10px;">
                  Quick Fill Demo
                </button>
              </div>
            ` : ''}

            <!-- FORM: SIGN IN -->
            ${this.authMode === 'signin' ? `
              <form id="role-auth-signin-form" onsubmit="Auth.handleSignInSubmit(event)">
                <div class="form-group">
                  <label class="form-label">${this.selectedRole === 'trainer' ? 'Faculty Email' : (this.selectedRole === 'admin' ? 'Directorate Email' : 'Email Address')}</label>
                  <div style="position:relative;">
                    <input type="email" class="form-input" id="auth-signin-email" value="${current.demoEmail}" placeholder="name@capacityconnect.org" required>
                  </div>
                </div>

                <div class="form-group">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <label class="form-label" style="margin:0;">Password</label>
                    <a href="javascript:void(0)" onclick="App.showToast('Password Reset', 'Password recovery instructions sent to your email.', 'info')" style="font-size:0.775rem; color:var(--brand-accent);">Forgot password?</a>
                  </div>
                  <input type="password" class="form-input" id="auth-signin-password" value="password123" placeholder="••••••••" required>
                </div>

                ${this.selectedRole === 'admin' ? `
                  <div class="form-group">
                    <label class="form-label">Directorate Security Access PIN / Token (Optional for Demo)</label>
                    <input type="password" class="form-input" id="auth-admin-pin" placeholder="Enter administrative token (e.g. CC-ADMIN-2026)">
                  </div>
                ` : ''}

                <button type="submit" class="btn btn-primary w-full" id="btn-submit-auth" style="margin-top:12px; padding:12px; font-weight:700;">
                  <i data-lucide="log-in"></i> Sign In to ${current.badge} Portal
                </button>
              </form>
            ` : ''}

            <!-- FORM: SIGN UP (ROLE SPECIFIC) -->
            ${this.authMode === 'signup' ? `
              <form id="role-auth-signup-form" onsubmit="Auth.handleSignUpSubmit(event)">
                <div class="grid grid-cols-2 gap-md">
                  <div class="form-group">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-input" id="reg-name" placeholder="e.g. Jordan Smith" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">${this.selectedRole === 'trainer' ? 'Official Faculty Email' : 'Organizational Email'}</label>
                    <input type="email" class="form-input" id="reg-email" placeholder="e.g. jordan.smith@capacityconnect.org" required>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-md">
                  <div class="form-group">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-input" id="reg-password" placeholder="At least 6 characters" minlength="6" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Selected Role</label>
                    <input type="text" class="form-input" value="${current.badge} Portal" disabled style="background:var(--bg-surface-alt); font-weight:700; color:${current.color};">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-md">
                  <div class="form-group">
                    <label class="form-label">${this.selectedRole === 'admin' ? 'Directorate Office' : 'Department / Division'}</label>
                    <input type="text" class="form-input" id="reg-dept" placeholder="e.g. Cloud & Systems Engineering" required>
                  </div>
                  <div class="form-group">
                    <label class="form-label">${this.selectedRole === 'trainer' ? 'Instructor Title' : (this.selectedRole === 'admin' ? 'Executive Role Title' : 'Job Title')}</label>
                    <input type="text" class="form-input" id="reg-title" placeholder="e.g. Senior Lead Specialist" required>
                  </div>
                </div>

                <!-- Role Specific Fields for Trainee -->
                ${this.selectedRole === 'trainee' ? `
                  <div class="form-group">
                    <label class="form-label">Highest Educational Qualification</label>
                    <input type="text" class="form-input" id="reg-qual" placeholder="e.g. B.Tech in Information Technology">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Primary Learning Focus Areas</label>
                    <input type="text" class="form-input" id="reg-interests" placeholder="e.g. Cloud Architecture, Applied AI, Cybersecurity">
                  </div>
                ` : ''}

                <!-- Role Specific Fields for Trainer -->
                ${this.selectedRole === 'trainer' ? `
                  <div class="form-group">
                    <label class="form-label">Primary Teaching Competencies (Comma separated)</label>
                    <input type="text" class="form-input" id="reg-competencies" placeholder="e.g. Cloud Architecture, DevSecOps, Machine Learning" required>
                  </div>
                  <div class="grid grid-cols-2 gap-md">
                    <div class="form-group">
                      <label class="form-label">Years of Instructional Experience</label>
                      <input type="number" class="form-input" id="reg-exp-years" value="5" min="1" max="40">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Faculty Directorate Reference ID</label>
                      <input type="text" class="form-input" id="reg-ref-id" placeholder="e.g. FAC-2026-9812">
                    </div>
                  </div>
                ` : ''}

                <!-- Role Specific Fields for Admin -->
                ${this.selectedRole === 'admin' ? `
                  <div class="form-group">
                    <label class="form-label">Directorate Security Master Key</label>
                    <input type="password" class="form-input" id="reg-admin-token" placeholder="Enter enterprise admin authorization key" required>
                    <span class="form-hint" style="font-size:0.725rem; color:var(--text-muted);">Use <code>CAPACITY-ADMIN-2026</code> for demonstration setup</span>
                  </div>
                ` : ''}

                <div class="form-group">
                  <label class="form-label">Professional Background / Bio</label>
                  <textarea class="form-textarea" id="reg-bio" placeholder="Describe your background and expertise..."></textarea>
                </div>

                ${this.selectedRole !== 'trainee' ? `
                  <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:10px 14px; border-radius:var(--radius-sm); margin-bottom:16px; font-size:0.8rem; color:#92400E; display:flex; align-items:center; gap:8px;">
                    <i data-lucide="info" style="width:16px; height:16px; flex-shrink:0;"></i>
                    <span><strong>Directorate Review Notice:</strong> ${current.badge} registrations will be submitted for L&D Directorate verification before full studio access is unlocked.</span>
                  </div>
                ` : ''}

                <button type="submit" class="btn btn-primary w-full" id="btn-submit-reg" style="margin-top:8px; padding:12px; font-weight:700;">
                  <i data-lucide="user-plus"></i> Create ${current.badge} Account
                </button>
              </form>
            ` : ''}

          </div>

          <!-- Bottom Switch link -->
          <div style="text-align:center; margin-top:20px; font-size:0.875rem; color:var(--text-secondary);">
            ${this.authMode === 'signin' ? `
              Don't have a ${current.badge} account? 
              <a href="javascript:void(0)" onclick="Auth.setMode('signup')" style="color:var(--brand-accent); font-weight:600;">Register as ${current.badge}</a>
            ` : `
              Already have an account? 
              <a href="javascript:void(0)" onclick="Auth.setMode('signin')" style="color:var(--brand-accent); font-weight:600;">Sign in here</a>
            `}
          </div>

        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  fillDemoCredentials(role) {
    const emailInput = document.getElementById('auth-signin-email');
    const passInput = document.getElementById('auth-signin-password');
    if (!emailInput || !passInput) return;

    if (role === 'trainee') {
      emailInput.value = "priya.sharma@capacityconnect.org";
      passInput.value = "password123";
    } else if (role === 'trainer') {
      emailInput.value = "marcus.vance@capacityconnect.org";
      passInput.value = "password123";
    } else if (role === 'admin') {
      emailInput.value = "admin@capacityconnect.org";
      passInput.value = "password123";
    }
    App.showToast("Credentials Loaded", `Loaded demo credentials for ${role.toUpperCase()}`, "info");
  },

  async handleSignInSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('auth-signin-email').value.trim();
    const password = document.getElementById('auth-signin-password').value.trim();

    const submitBtn = document.getElementById('btn-submit-auth');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Signing in...`;
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      let res;
      if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
        res = await window.SupabaseConfig.signIn(email, password, this.selectedRole);
      } else {
        res = window.store.login(email, password);
      }

      if (res.success) {
        App.showToast("Authentication Successful", `Welcome back, ${res.user.name}! [Role: ${res.user.role.toUpperCase()}]`, "success");
        this.updateUserUI();
        App.navigateByRole(res.user.role);
      } else {
        App.showToast("Sign In Failed", res.message || "Invalid credentials for this role.", "error");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      App.showToast("Sign In Error", err.message || "An unexpected error occurred.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="log-in"></i> Sign In to ${this.selectedRole.toUpperCase()} Portal`;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  async handleSignUpSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const department = document.getElementById('reg-dept').value.trim();
    const title = document.getElementById('reg-title').value.trim();
    const bio = document.getElementById('reg-bio').value.trim();

    const role = this.selectedRole;
    let qualification = '';
    let work_experience = '';
    let interests = [];
    let skills = [];

    if (role === 'trainee') {
      qualification = document.getElementById('reg-qual') ? document.getElementById('reg-qual').value.trim() : '';
      const rawInterests = document.getElementById('reg-interests') ? document.getElementById('reg-interests').value.trim() : '';
      if (rawInterests) {
        interests = rawInterests.split(',').map(s => s.trim()).filter(Boolean);
        skills = [...interests];
      } else {
        interests = ['Cloud Architecture', 'Digital Transformation'];
        skills = ['Cloud Architecture', 'Digital Transformation'];
      }
      work_experience = title || 'Enterprise Trainee';
    } else if (role === 'trainer') {
      const comps = document.getElementById('reg-competencies') ? document.getElementById('reg-competencies').value.trim() : '';
      if (comps) {
        skills = comps.split(',').map(c => c.trim()).filter(Boolean);
      }
      const expYears = document.getElementById('reg-exp-years') ? document.getElementById('reg-exp-years').value.trim() : '5';
      qualification = title || 'Certified Faculty Instructor';
      work_experience = `${expYears} years instructional & industry experience`;
    }

    const profileData = {
      name,
      email,
      role,
      department,
      title,
      bio,
      qualification,
      work_experience,
      interests,
      skills,
      specialization: department,
      qualifications: qualification ? [{ degree: qualification, institution: "Verified Academy", year: "2024" }] : [],
      experience: work_experience ? [{ role: work_experience, company: department, period: "Present" }] : [],
      competencies: skills.map(s => ({ subject: s, proficiency: 5, certified: true }))
    };

    if (role === 'admin') {
      const adminToken = document.getElementById('reg-admin-token') ? document.getElementById('reg-admin-token').value.trim() : '';
      if (adminToken && adminToken !== 'CAPACITY-ADMIN-2026') {
        App.showToast("Security Key Notice", "Using default authorization mode for registration.", "info");
      }
    }

    const submitBtn = document.getElementById('btn-submit-reg');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Creating account...`;
      if (window.lucide) window.lucide.createIcons();
    }

    try {
      let res;
      if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
        res = await window.SupabaseConfig.signUp(email, password, profileData);
      } else {
        res = window.store.registerUser({
          ...profileData,
          password: password
        });
      }

      if (res.success) {
        if (res.pendingApproval) {
          App.showToast("Registration Received", "Your instructor/directorate account is pending verification. You will receive full access upon approval.", "info");
        } else {
          App.showToast("Account Created", `Welcome to Capacity Connect, ${res.user ? res.user.name : name}!`, "success");
        }
        this.updateUserUI();
        if (res.user && res.user.status === 'active') {
          App.navigateByRole(res.user.role);
        } else {
          App.navigateTo('home');
        }
      } else {
        App.showToast("Registration Failed", res.message || "Could not register account.", "error");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      App.showToast("Registration Error", err.message || "An unexpected error occurred.", "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="user-plus"></i> Create ${this.selectedRole.toUpperCase()} Account`;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  },

  bindAuthFormEvents() {
    // Legacy modal submit bindings
    const modalLoginForm = document.getElementById('login-form');
    if (modalLoginForm) {
      modalLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        
        let res;
        if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
          res = await window.SupabaseConfig.signIn(email, pass);
        } else {
          res = store.login(email, pass);
        }

        if (res.success) {
          App.showToast("Signed In", `Welcome back, ${res.user.name}!`, "success");
          App.closeAllModals();
          Auth.updateUserUI();
          App.navigateByRole(res.user.role);
        } else {
          App.showToast("Sign In Failed", res.message, "error");
        }
      });
    }

    const modalRegForm = document.getElementById('register-form');
    if (modalRegForm) {
      modalRegForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name-modal').value.trim();
        const email = document.getElementById('reg-email-modal').value.trim();
        const password = document.getElementById('reg-password-modal').value.trim();
        const role = document.getElementById('reg-role-modal').value;
        const department = document.getElementById('reg-dept-modal').value.trim();
        const title = document.getElementById('reg-title-modal').value.trim();
        const bio = document.getElementById('reg-bio-modal').value.trim();

        let res;
        if (window.SupabaseConfig && window.SupabaseConfig.isConfigured()) {
          res = await window.SupabaseConfig.signUp(email, password, { name, role, department, title, bio });
        } else {
          res = store.registerUser({ name, email, password, role, department, title, bio });
        }

        if (res.success) {
          if (res.pendingApproval) {
            App.showToast("Registration Submitted", "Your account is pending Admin approval.", "info");
          } else {
            App.showToast("Account Created", `Welcome to Capacity Connect, ${name}!`, "success");
            App.navigateByRole(role);
          }
          App.closeAllModals();
          Auth.updateUserUI();
        } else {
          App.showToast("Registration Failed", res.message, "error");
        }
      });
    }
  },

  loginAsDemo(role) {
    let targetEmail = "";
    if (role === 'trainee') targetEmail = "priya.sharma@capacityconnect.org";
    else if (role === 'trainer') targetEmail = "marcus.vance@capacityconnect.org";
    else if (role === 'admin') targetEmail = "admin@capacityconnect.org";

    const res = store.login(targetEmail, "password123");
    if (res.success) {
      App.showToast("Role Switched", `Now operating as Demo ${role.toUpperCase()}: ${res.user.name}`, "info");
      const dropdown = document.getElementById('role-switcher-menu');
      if (dropdown) dropdown.classList.remove('show');
      this.updateUserUI();
      App.navigateByRole(role);
    }
  },

  updateUserUI() {
    const user = store.getCurrentUser();
    const guestActions = document.getElementById('nav-guest-actions');
    const userActions = document.getElementById('nav-user-actions');
    const roleIndicator = document.getElementById('nav-role-indicator');
    const userAvatarText = document.getElementById('nav-user-avatar');
    const userNameText = document.getElementById('nav-user-name');
    const roleBadge = document.getElementById('nav-user-role-badge');

    const portalNavLink = document.getElementById('nav-portal-link');

    if (!user) {
      if (guestActions) guestActions.classList.remove('hidden');
      if (userActions) userActions.classList.add('hidden');
      if (portalNavLink) portalNavLink.classList.add('hidden');
      if (roleIndicator) {
        roleIndicator.className = 'role-indicator-dot';
      }
      return;
    }

    if (guestActions) guestActions.classList.add('hidden');
    if (userActions) userActions.classList.remove('hidden');

    if (roleIndicator) {
      roleIndicator.className = `role-indicator-dot ${user.role}`;
    }

    if (userAvatarText) userAvatarText.textContent = user.avatar || user.name.substring(0, 2).toUpperCase();
    if (userNameText) userNameText.textContent = user.name;
    if (roleBadge) {
      roleBadge.textContent = user.role.toUpperCase();
      roleBadge.className = `badge badge-${user.role}`;
    }

    // Update role-specific navigation link
    if (portalNavLink) {
      portalNavLink.classList.remove('hidden');
      if (user.role === 'trainee') {
        portalNavLink.innerHTML = `<i data-lucide="layout-dashboard"></i> Trainee Hub`;
        portalNavLink.setAttribute('data-target', 'trainee-portal');
      } else if (user.role === 'trainer') {
        portalNavLink.innerHTML = `<i data-lucide="presentation"></i> Trainer Studio`;
        portalNavLink.setAttribute('data-target', 'trainer-portal');
      } else if (user.role === 'admin') {
        portalNavLink.innerHTML = `<i data-lucide="shield-check"></i> Admin Center`;
        portalNavLink.setAttribute('data-target', 'admin-portal');
      }
    }

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
};
