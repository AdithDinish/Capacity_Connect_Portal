/**
 * CAPACITY CONNECT - MAIN APPLICATION CONTROLLER
 * Routing, Toast System, Modal Handlers, Theme Toggling, Quick Search,
 * Credential Verification, Dynamic Notifications, and Interactive Catalogs.
 */

const App = {
  currentView: 'home',

  init() {
    this.initTheme();
    this.bindGlobalEvents();
    this.bindFormHandlers();

    // Initialize sub-controllers
    Auth.init();
    TraineeView.init();
    TrainerView.init();
    AdminView.init();
    CompetencyView.init();

    this.renderNotifications();

    // Initial route based on hash or user state
    const hash = (window.location.hash || '').replace('#', '').trim();
    if (hash && document.getElementById(`${hash}-view`)) {
      this.navigateTo(hash);
    } else {
      const user = store.getCurrentUser();
      if (user) {
        this.navigateByRole(user.role);
      } else {
        this.navigateTo('home');
      }
    }

    // Hash change listener
    window.addEventListener('hashchange', () => {
      const currentHash = (window.location.hash || '').replace('#', '').trim();
      if (currentHash && currentHash !== this.currentView && document.getElementById(`${currentHash}-view`)) {
        this.navigateTo(currentHash);
      }
    });

    // Subscribe to store updates
    store.subscribe(() => {
      this.onStoreUpdated();
    });

    if (window.lucide) window.lucide.createIcons();
  },

  onStoreUpdated() {
    Auth.updateUserUI();
    this.renderNotifications();
    this.renderHomepageContent();
    if (this.currentView === 'trainee-portal') TraineeView.render();
    if (this.currentView === 'trainer-portal') TrainerView.render();
    if (this.currentView === 'admin-portal') AdminView.render();
    if (this.currentView === 'competency') CompetencyView.render();
    if (this.currentView === 'courses') this.renderCourseCatalog();
    if (this.currentView === 'library') this.renderGlobalLibrary();
    if (this.currentView === 'auth') Auth.renderAuthPage();
  },

  // Navigation & View Routing
  navigateTo(viewName) {
    this.currentView = viewName;

    // Sync URL hash
    if (window.location.hash.replace('#', '') !== viewName) {
      window.location.hash = viewName;
    }

    // Hide all view sections
    document.querySelectorAll('.app-view').forEach(v => v.classList.add('hidden'));

    // Highlight active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-target') === viewName) {
        link.classList.add('active');
      }
    });

    const targetEl = document.getElementById(`${viewName}-view`);
    if (targetEl) {
      targetEl.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // View specific render hooks
    if (viewName === 'home') this.renderHomepageContent();
    else if (viewName === 'courses') this.renderCourseCatalog();
    else if (viewName === 'competency') CompetencyView.render();
    else if (viewName === 'library') this.renderGlobalLibrary();
    else if (viewName === 'trainee-portal') TraineeView.render();
    else if (viewName === 'trainer-portal') TrainerView.render();
    else if (viewName === 'admin-portal') AdminView.render();
    else if (viewName === 'auth') Auth.renderAuthPage();

    if (window.lucide) window.lucide.createIcons();
  },

  navigateByRole(role) {
    if (role === 'trainee') this.navigateTo('trainee-portal');
    else if (role === 'trainer') this.navigateTo('trainer-portal');
    else if (role === 'admin') this.navigateTo('admin-portal');
    else this.navigateTo('home');
  },

  // Theme Management (Light / Dark)
  initTheme() {
    const savedTheme = localStorage.getItem('capacity_connect_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeIcon(savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('capacity_connect_theme', next);
    this.updateThemeIcon(next);
    this.showToast("Theme Updated", `Switched to ${next} mode`, "info");
  },

  updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? `<i data-lucide="sun"></i>` : `<i data-lucide="moon"></i>`;
    if (window.lucide) window.lucide.createIcons();
  },

  // Toast System
  showToast(title, desc = "", type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check-circle-2';
    else if (type === 'error') icon = 'alert-circle';
    else if (type === 'warning') icon = 'alert-triangle';

    toast.innerHTML = `
      <i data-lucide="${icon}" style="width:20px; height:20px; flex-shrink:0;"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${desc ? `<div class="toast-desc">${desc}</div>` : ''}
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i data-lucide="x" style="width:16px; height:16px;"></i>
      </button>
    `;

    container.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  },

  // Modal System
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  },

  openLoginModal() {
    Auth.setMode('signin');
    this.navigateTo('auth');
  },

  openRegisterModal() {
    Auth.setMode('signup');
    this.navigateTo('auth');
  },

  // --- Dynamic Notifications System ---
  renderNotifications() {
    const notifications = store.getNotifications();
    const unreadCount = notifications.filter(n => n.unread).length;

    const unreadBadge = document.getElementById('notif-unread-count');
    const countBadge = document.getElementById('notif-count-badge');
    const container = document.getElementById('notif-list-container');

    if (unreadBadge) {
      unreadBadge.textContent = unreadCount;
      unreadBadge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    if (countBadge) {
      countBadge.textContent = `${unreadCount} New`;
    }

    if (container) {
      if (notifications.length === 0) {
        container.innerHTML = `
          <div style="padding:28px; text-align:center; color:var(--text-muted); font-size:0.875rem;">
            <i data-lucide="bell-off" style="width:28px; height:28px; margin:0 auto 8px auto; opacity:0.5; display:block;"></i>
            No notifications at this time
          </div>
        `;
      } else {
        container.innerHTML = notifications.map(n => `
          <div class="notification-item ${n.unread ? 'unread' : ''}" onclick="App.handleNotificationClick('${n.id}')">
            <div class="notif-icon-box" style="background:${n.bg || '#EFF6FF'}; color:${n.color || '#2563EB'};">
              <i data-lucide="${n.icon || 'bell'}" style="width:16px; height:16px;"></i>
            </div>
            <div style="flex:1; min-width:0;">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:6px;">
                <span class="notif-title">${n.title}</span>
                ${n.unread ? '<span style="width:7px; height:7px; border-radius:50%; background:var(--brand-accent); flex-shrink:0; margin-top:4px;"></span>' : ''}
              </div>
              <div class="notif-desc">${n.desc}</div>
              <div class="notif-time">${n.time || 'Just now'}</div>
            </div>
          </div>
        `).join('');
      }
    }

    if (window.lucide) window.lucide.createIcons();
  },

  handleNotificationClick(notifId) {
    store.markNotificationRead(notifId);
    this.renderNotifications();
  },

  // --- Global Quick Search (Ctrl+K) ---
  openQuickSearch() {
    this.openModal('modal-global-search');
    const input = document.getElementById('global-search-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 80);
    }
    this.renderSearchResults('');
  },

  renderSearchResults(query = '') {
    const container = document.getElementById('global-search-results');
    if (!container) return;

    const q = (query || '').toLowerCase().trim();

    if (!q) {
      container.innerHTML = `
        <div style="padding:16px;">
          <div class="search-group-title">Suggested Inquiries</div>
          <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:20px;">
            <button class="btn btn-xs btn-outline" onclick="document.getElementById('global-search-input').value='Cloud Architecture'; App.renderSearchResults('Cloud Architecture');">
              <i data-lucide="cloud"></i> Cloud Architecture
            </button>
            <button class="btn btn-xs btn-outline" onclick="document.getElementById('global-search-input').value='Artificial Intelligence'; App.renderSearchResults('Artificial Intelligence');">
              <i data-lucide="cpu"></i> Artificial Intelligence
            </button>
            <button class="btn btn-xs btn-outline" onclick="document.getElementById('global-search-input').value='Zero-Trust'; App.renderSearchResults('Zero-Trust');">
              <i data-lucide="shield"></i> Zero-Trust Defense
            </button>
            <button class="btn btn-xs btn-outline" onclick="document.getElementById('global-search-input').value='Vance'; App.renderSearchResults('Vance');">
              <i data-lucide="user"></i> Dr. Marcus Vance
            </button>
            <button class="btn btn-xs btn-outline" onclick="document.getElementById('global-search-input').value='Agile'; App.renderSearchResults('Agile');">
              <i data-lucide="activity"></i> Agile Leadership
            </button>
          </div>

          <div class="search-group-title">Quick Portals</div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <div class="search-result-row" onclick="App.closeAllModals(); App.navigateTo('courses');">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:6px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center;">
                  <i data-lucide="book-open" style="width:16px; height:16px;"></i>
                </div>
                <div>
                  <div style="font-weight:600; font-size:0.875rem;">Full Course Catalog</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Explore enterprise tracks and accreditations</div>
                </div>
              </div>
              <span class="badge badge-primary">Catalog</span>
            </div>

            <div class="search-result-row" onclick="App.closeAllModals(); App.navigateTo('competency');">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:6px; background:#F5F3FF; color:#7C3AED; display:flex; align-items:center; justify-content:center;">
                  <i data-lucide="cpu" style="width:16px; height:16px;"></i>
                </div>
                <div>
                  <div style="font-weight:600; font-size:0.875rem;">Competency Matrix & Matchmaker</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Algorithmic faculty gap analysis</div>
                </div>
              </div>
              <span class="badge badge-admin">Engine</span>
            </div>

            <div class="search-result-row" onclick="App.closeAllModals(); App.navigateTo('library');">
              <div style="display:flex; align-items:center; gap:10px;">
                <div style="width:30px; height:30px; border-radius:6px; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center;">
                  <i data-lucide="folder" style="width:16px; height:16px;"></i>
                </div>
                <div>
                  <div style="font-weight:600; font-size:0.875rem;">Trainer Resource Library</div>
                  <div style="font-size:0.75rem; color:var(--text-muted);">Slide decks, recorded lectures & field manuals</div>
                </div>
              </div>
              <span class="badge badge-trainer">Repository</span>
            </div>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const courses = store.getCourses().filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q)) ||
      (c.trainerName && c.trainerName.toLowerCase().includes(q))
    );

    const resources = store.getResources().filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      (r.type && r.type.toLowerCase().includes(q)) ||
      (r.trainerName && r.trainerName.toLowerCase().includes(q))
    );

    const competencies = store.getCompetencyMatrix().filter(m =>
      m.subject.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );

    const users = store.getUsers().filter(u =>
      u.name.toLowerCase().includes(q) ||
      (u.department && u.department.toLowerCase().includes(q)) ||
      (u.title && u.title.toLowerCase().includes(q))
    );

    const totalMatches = courses.length + resources.length + competencies.length + users.length;

    if (totalMatches === 0) {
      container.innerHTML = `
        <div style="padding:36px 16px; text-align:center; color:var(--text-muted);">
          <i data-lucide="search-x" style="width:36px; height:36px; margin:0 auto 10px auto; opacity:0.5; display:block;"></i>
          <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">No matching results for "${query}"</div>
          <div style="font-size:0.8rem;">Try checking your spelling or search for broader keywords like "Cloud", "Security", or "Vance".</div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    let html = '';

    // Matched Courses
    if (courses.length > 0) {
      html += `<div class="search-group-title">Courses & Programs (${courses.length})</div>`;
      courses.forEach(c => {
        html += `
          <div class="search-result-row" onclick="App.closeAllModals(); TraineeView.openCourseDetailModal('${c.id}');">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:6px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="book-open" style="width:16px; height:16px;"></i>
              </div>
              <div>
                <div style="font-weight:600; font-size:0.875rem;">${c.title}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${c.subject} • Trainer: ${c.trainerName} • ${c.duration}</div>
              </div>
            </div>
            <span class="badge badge-primary">${c.level}</span>
          </div>
        `;
      });
    }

    // Matched Library Assets
    if (resources.length > 0) {
      html += `<div class="search-group-title">Trainer Library Resources (${resources.length})</div>`;
      resources.forEach(r => {
        html += `
          <div class="search-result-row" onclick="App.closeAllModals(); TraineeView.openResourceViewer('${r.id}');">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:6px; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="${r.type === 'video' ? 'video' : (r.type === 'presentation' ? 'presentation' : 'file-text')}" style="width:16px; height:16px;"></i>
              </div>
              <div>
                <div style="font-weight:600; font-size:0.875rem;">${r.title}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${r.subject} • Uploaded by ${r.trainerName}</div>
              </div>
            </div>
            <span class="badge badge-trainer">${r.type.toUpperCase()}</span>
          </div>
        `;
      });
    }

    // Matched Competency Domains
    if (competencies.length > 0) {
      html += `<div class="search-group-title">Strategic Competency Matrix (${competencies.length})</div>`;
      competencies.forEach(m => {
        html += `
          <div class="search-result-row" onclick="App.closeAllModals(); App.navigateTo('competency');">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:32px; height:32px; border-radius:6px; background:#F5F3FF; color:#7C3AED; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                <i data-lucide="cpu" style="width:16px; height:16px;"></i>
              </div>
              <div>
                <div style="font-weight:600; font-size:0.875rem;">${m.subject}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${m.category} • Required: ${m.requiredLevel}</div>
              </div>
            </div>
            <span class="badge badge-admin">${m.demand} Demand</span>
          </div>
        `;
      });
    }

    // Matched Users
    if (users.length > 0) {
      html += `<div class="search-group-title">Faculty & Trainees (${users.length})</div>`;
      users.forEach(u => {
        html += `
          <div class="search-result-row" onclick="App.closeAllModals(); App.showToast('${u.name}', '${u.title || u.role} • ${u.department || 'Capacity Directorate'}', 'info');">
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="table-avatar" style="width:32px; height:32px; font-size:0.8rem;">
                ${u.avatar || u.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style="font-weight:600; font-size:0.875rem;">${u.name}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${u.title || 'Enterprise Member'} • ${u.department || 'Directorate'}</div>
              </div>
            </div>
            <span class="badge ${u.role === 'trainer' ? 'badge-trainer' : (u.role === 'admin' ? 'badge-admin' : 'badge-trainee')}">${u.role.toUpperCase()}</span>
          </div>
        `;
      });
    }

    container.innerHTML = html;
    if (window.lucide) window.lucide.createIcons();
  },

  // --- Official Credential Verification Engine ---
  openVerifyCredentialModal(certCode = '') {
    this.openModal('modal-verify-credential');
    const input = document.getElementById('verify-cert-input');
    if (input) {
      if (certCode) input.value = certCode;
      setTimeout(() => input.focus(), 80);
    }
    if (input && input.value) {
      this.runCredentialVerification(input.value);
    }
  },

  runCredentialVerification(inputVal = null) {
    const input = document.getElementById('verify-cert-input');
    const code = (inputVal !== null ? inputVal : (input ? input.value : '')).trim();
    const container = document.getElementById('verify-results-container');
    if (!container) return;

    if (!code) {
      this.showToast("Enter Credential ID", "Please input an official Certificate ID or verification code.", "warning");
      return;
    }

    const res = store.verifyCertificate(code);

    if (res && res.isValid) {
      const cert = res.certificate;
      const rec = res.recipient;

      container.innerHTML = `
        <div class="cert-verification-card">
          <div class="cert-verified-header">
            <div class="cert-verified-icon">
              <i data-lucide="shield-check" style="width:30px; height:30px;"></i>
            </div>
            <div style="flex:1;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                <span class="badge badge-success"><i data-lucide="check"></i> AUTHENTIC & VERIFIED</span>
                <span style="font-family:var(--font-mono); font-size:0.8rem; font-weight:700; color:var(--text-muted);">${cert.id}</span>
              </div>
              <h3 style="margin:0; font-size:1.25rem; color:var(--text-primary);">${cert.courseTitle}</h3>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-md" style="margin-bottom:16px;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.05em; margin-bottom:2px;">Certified Recipient</div>
              <div style="font-size:1.05rem; font-weight:700; color:var(--text-primary);">${rec.name}</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">${rec.title || 'Enterprise Professional'} • ${rec.department || 'Capacity Directorate'}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; font-weight:700; letter-spacing:0.05em; margin-bottom:2px;">Distinction & Date</div>
              <div style="font-size:1.05rem; font-weight:700; color:var(--color-success);">${cert.score}% Distinction</div>
              <div style="font-size:0.8rem; color:var(--text-secondary);">Issued on ${cert.issueDate}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-md" style="background:var(--bg-surface-alt); padding:12px 16px; border-radius:var(--radius-md); border:1px solid var(--border-color); margin-bottom:18px;">
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Principal Instructor</div>
              <div style="font-size:0.9rem; font-weight:600;">${cert.trainerName || 'Dr. Marcus Vance'}</div>
            </div>
            <div>
              <div style="font-size:0.75rem; color:var(--text-muted);">Security Checksum Code</div>
              <div style="font-size:0.9rem; font-weight:600; font-family:var(--font-mono);">${cert.verificationCode || 'CC-VERIFIED-AUTH'}</div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <span style="font-size:0.775rem; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
              <i data-lucide="lock" style="width:14px; height:14px; color:var(--color-success);"></i> Cryptographically sealed against Directorate Registry
            </span>
            <button class="btn btn-sm btn-primary" onclick="CertificateView.openModal('${cert.id}')">
              <i data-lucide="file-text"></i> View Full Certificate
            </button>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="background:var(--bg-surface); border:2px solid var(--color-danger); border-radius:var(--radius-xl); padding:28px; text-align:center;">
          <div style="width:52px; height:52px; border-radius:50%; background:var(--color-danger-bg); color:var(--color-danger); display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto;">
            <i data-lucide="shield-alert" style="width:28px; height:28px;"></i>
          </div>
          <h4 style="margin:0 0 6px 0; color:var(--color-danger); font-size:1.15rem;">Credential Not Found in Registry</h4>
          <p style="font-size:0.875rem; color:var(--text-secondary); max-width:440px; margin:0 auto 16px auto;">
            The credential ID <strong>"${code}"</strong> could not be matched against any authorized digital certificates issued by the Capacity Connect Directorate.
          </p>
          <div style="font-size:0.775rem; color:var(--text-muted);">
            Please confirm the exact credential ID printed at the bottom of the certificate document.
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // Global Event Listeners
  bindGlobalEvents() {
    // Nav Click delegation
    document.querySelectorAll('[data-target]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = e.currentTarget.getAttribute('data-target');
        this.navigateTo(target);
      });
    });

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ctrl+K or Cmd+K opens quick search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openQuickSearch();
      }
      // Escape closes modals
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    // Nav Search button
    const searchNavBtn = document.getElementById('nav-search-btn');
    if (searchNavBtn) {
      searchNavBtn.addEventListener('click', () => this.openQuickSearch());
    }

    // Search input typing
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.renderSearchResults(e.target.value);
      });
    }

    // Nav Verify Credential button
    const verifyNavBtn = document.getElementById('nav-verify-btn');
    if (verifyNavBtn) {
      verifyNavBtn.addEventListener('click', () => this.openVerifyCredentialModal());
    }

    // Run Verify button inside modal
    const runVerifyBtn = document.getElementById('btn-run-cert-verify');
    const verifyInput = document.getElementById('verify-cert-input');
    if (runVerifyBtn) {
      runVerifyBtn.addEventListener('click', () => this.runCredentialVerification());
    }
    if (verifyInput) {
      verifyInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.runCredentialVerification();
        }
      });
    }

    // Clear all notifications
    const clearNotifsBtn = document.getElementById('notif-mark-all-read');
    if (clearNotifsBtn) {
      clearNotifsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.markAllNotificationsRead();
        this.renderNotifications();
        this.showToast('Notifications Cleared', 'All notifications marked as read.', 'info');
      });
    }

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) themeBtn.addEventListener('click', () => this.toggleTheme());

    // Role Switcher Dropdown Toggle
    const switcherBtn = document.getElementById('role-switcher-btn');
    const switcherMenu = document.getElementById('role-switcher-menu');
    if (switcherBtn && switcherMenu) {
      switcherBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        switcherMenu.classList.toggle('show');
      });
    }

    // Notifications Panel Toggle
    const notifBtn = document.getElementById('notif-btn');
    const notifPanel = document.getElementById('notif-panel');
    if (notifBtn && notifPanel) {
      notifBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notifPanel.classList.toggle('show');
      });

      notifPanel.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    // Close Dropdowns on Click Outside
    document.addEventListener('click', () => {
      if (switcherMenu) switcherMenu.classList.remove('show');
      if (notifPanel) notifPanel.classList.remove('show');
    });

    // Modal Close Buttons & Backdrop clicks
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.closeAllModals());
    });

    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeAllModals();
      });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('main-nav-links');
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-open');
      });
    }

    // Reset Demo Data
    const resetBtn = document.getElementById('btn-reset-data');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm("Reset all portal data back to factory defaults?")) {
          store.resetToInitial();
          this.showToast("Data Reset", "Portal data reinitialized to defaults.", "info");
          location.reload();
        }
      });
    }
  },

  // Form Submissions Binding
  bindFormHandlers() {
    // 1. Add Qualification
    const qualForm = document.getElementById('form-add-qual');
    if (qualForm) {
      qualForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const degree = document.getElementById('qual-degree').value.trim();
        const institution = document.getElementById('qual-institution').value.trim();
        const year = document.getElementById('qual-year').value.trim();

        store.addQualification(user.id, { degree, institution, year });
        this.showToast("Qualification Added", `${degree} saved to your profile.`, "success");
        this.closeAllModals();
        qualForm.reset();
        TraineeView.render();
      });
    }

    // 2. Add Experience
    const expForm = document.getElementById('form-add-exp');
    if (expForm) {
      expForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const role = document.getElementById('exp-role').value.trim();
        const organization = document.getElementById('exp-org').value.trim();
        const period = document.getElementById('exp-period').value.trim();
        const description = document.getElementById('exp-desc').value.trim();

        store.addExperience(user.id, { role, organization, period, description });
        this.showToast("Experience Added", `${role} saved to your profile.`, "success");
        this.closeAllModals();
        expForm.reset();
        TraineeView.render();
      });
    }

    // 3. Add Skill
    const skillForm = document.getElementById('form-add-skill');
    if (skillForm) {
      skillForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const name = document.getElementById('skill-name').value.trim();
        const level = document.getElementById('skill-level').value;

        store.addSkill(user.id, { name, level });
        this.showToast("Skill Added", `${name} (${level}) added.`, "success");
        this.closeAllModals();
        skillForm.reset();
        TraineeView.render();
      });
    }

    // 4. Trainer: Upload Resource
    const uploadForm = document.getElementById('form-upload-resource');
    if (uploadForm) {
      uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const type = document.getElementById('res-type').value;
        const subject = document.getElementById('res-subject').value;
        const title = document.getElementById('res-title').value.trim();
        const description = document.getElementById('res-desc').value.trim();
        const duration = document.getElementById('res-duration').value.trim();
        const slideCount = document.getElementById('res-slides').value.trim();

        store.addResource({
          trainerId: user.id,
          trainerName: user.name,
          subject,
          type,
          title,
          description,
          duration: duration ? duration + ' mins' : null,
          slideCount: slideCount ? parseInt(slideCount) : null
        });

        this.showToast("Resource Uploaded", `${title} is now available in Trainer Library.`, "success");
        this.closeAllModals();
        uploadForm.reset();
        TrainerView.render();
      });
    }

    // 5. Trainer: Create Questionnaire (Dynamic Builder Enabled)
    const asmForm = document.getElementById('form-create-assessment');
    if (asmForm) {
      asmForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const subject = document.getElementById('asm-subject').value;
        const title = document.getElementById('asm-title').value.trim();
        const timeLimitMinutes = document.getElementById('asm-time-limit').value;
        const passingScore = document.getElementById('asm-pass-score').value;
        const deadline = document.getElementById('asm-deadline').value;
        const description = document.getElementById('asm-desc').value.trim();

        // Use questions authored in dynamic builder if available
        let questions = [];
        if (TrainerView.builderQuestions && TrainerView.builderQuestions.length > 0) {
          questions = TrainerView.builderQuestions.map((q, idx) => ({
            id: `cq_${Date.now()}_${idx + 1}`,
            question: q.question,
            options: [...q.options],
            correctIndex: q.correctIndex !== undefined ? q.correctIndex : 0,
            explanation: q.explanation || `Core competency domain principle for ${subject}.`
          }));
        } else {
          questions = [
            {
              id: 'cq_1',
              question: `What is the primary architectural principle of ${subject}?`,
              options: [
                `A) High availability with automated failover`,
                `B) Manual deployment on single workstation`,
                `C) Unencrypted transmission`,
                `D) Static non-scalable queues`
              ],
              correctIndex: 0,
              explanation: `Ensures robust resilience and continuous service continuity.`
            },
            {
              id: 'cq_2',
              question: `How is organizational compliance verified in ${subject}?`,
              options: [
                `A) Periodic continuous automated auditing`,
                `B) Skipping security reviews`,
                `C) Sharing admin passwords`,
                `D) Unmonitored logs`
              ],
              correctIndex: 0,
              explanation: `Continuous verification and automated auditing guarantee standards compliance.`
            }
          ];
        }

        store.createAssessment({
          subject,
          title,
          trainerId: user.id,
          trainerName: user.name,
          timeLimitMinutes: parseInt(timeLimitMinutes) || 15,
          passingScore: parseInt(passingScore) || 75,
          deadline,
          description,
          questions
        });

        this.showToast("Questionnaire Published", `${title} created with ${questions.length} questions.`, "success");
        this.closeAllModals();
        asmForm.reset();
        TrainerView.render();
      });
    }

    // 6. Admin: Publish Announcement
    const annForm = document.getElementById('form-create-announcement');
    if (annForm) {
      annForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('ann-title').value.trim();
        const type = document.getElementById('ann-type').value;
        const target = document.getElementById('ann-target').value;
        const content = document.getElementById('ann-content').value.trim();

        store.addAnnouncement({ title, type, target, content });
        this.showToast("Announcement Broadcasted", "Notification published to homepage ticker.", "success");
        this.closeAllModals();
        annForm.reset();
        AdminView.render();
        this.renderHomepageContent();
      });
    }

    // 7. Admin: Create Achievement
    const achForm = document.getElementById('form-create-achievement');
    if (achForm) {
      achForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const recipientName = document.getElementById('ach-name').value.trim();
        const department = document.getElementById('ach-dept').value.trim();
        const awardTitle = document.getElementById('ach-title').value.trim();
        const score = document.getElementById('ach-score').value.trim();
        const testimonial = document.getElementById('ach-quote').value.trim();

        store.addAchievement({ recipientName, department, awardTitle, score, testimonial });
        this.showToast("Achievement Published", `${recipientName} added to Spotlight Wall.`, "success");
        this.closeAllModals();
        achForm.reset();
        AdminView.render();
        this.renderHomepageContent();
      });
    }

    // 8. Trainee: Course Feedback
    const fbForm = document.getElementById('form-course-feedback');
    if (fbForm) {
      fbForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const courseId = document.getElementById('feedback-course-id').value;
        const rating = parseInt(document.getElementById('feedback-rating-val').value) || 5;
        const clarity = parseInt(document.getElementById('feedback-clarity').value) || 5;
        const depth = parseInt(document.getElementById('feedback-depth').value) || 5;
        const practical = parseInt(document.getElementById('feedback-practical').value) || 5;
        const comment = document.getElementById('feedback-comment').value.trim();

        store.addFeedback({
          courseId,
          traineeId: user.id,
          traineeName: user.name,
          rating,
          ratingsBreakdown: { instructorClarity: clarity, courseDepth: depth, practicalApplicability: practical },
          comment
        });

        this.showToast("Feedback Submitted", "Thank you for rating this learning track!", "success");
        this.closeAllModals();
        fbForm.reset();
      });
    }
  },

  // Homepage Render Helpers
  renderHomepageContent() {
    const announcements = store.getAnnouncements();
    const ticker = document.getElementById('homepage-announcements-ticker');
    if (ticker && announcements.length > 0) {
      const latest = announcements[0];
      ticker.innerHTML = `
        <span class="ticker-badge"><i data-lucide="megaphone" style="width:14px; height:14px;"></i> ${latest.type}</span>
        <span class="ticker-content"><strong>${latest.title}:</strong> ${latest.content}</span>
      `;
    }

    // Newly added learning content
    const courses = store.getCourses();
    const newContentGrid = document.getElementById('homepage-new-courses-grid');
    if (newContentGrid) {
      const user = store.getCurrentUser();
      const featured = courses.filter(c => c.isFeatured || c.isNew).slice(0, 3);
      newContentGrid.innerHTML = featured.map(c => {
        const isEnrolled = user && user.role === 'trainee' && store.getEnrollment(c.id, user.id);
        const bgStyle = c.imageUrl ? `background-image: url('${c.imageUrl}');` : `background: ${c.imageBg};`;
        return `
          <div class="course-card">
            <div class="course-thumb" style="${bgStyle}">
              <div class="course-thumb-content">
                <span class="badge ${c.isNew ? 'badge-warning' : 'badge-primary'}">${c.isNew ? 'NEW TRACK' : 'FEATURED'}</span>
                <span style="color:#fff; font-size:0.75rem; font-weight:600;"><i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> ${c.duration}</span>
              </div>
            </div>
            <div class="course-body">
              <div class="course-subject">${c.subject}</div>
              <h4 class="course-title">${c.title}</h4>
              <p class="course-desc">${c.description}</p>
              <div class="course-meta">
                <div class="course-trainer">
                  <span>Trainer: ${c.trainerName}</span>
                </div>
                <span style="color:#F59E0B; font-weight:700;">★ ${c.rating}</span>
              </div>
            </div>
            <div class="course-footer">
              <button class="btn btn-sm btn-outline" onclick="TraineeView.openCourseDetailModal('${c.id}')">
                <i data-lucide="eye"></i> Syllabus
              </button>
              ${isEnrolled ? `
                <button class="btn btn-sm btn-primary" onclick="TraineeView.openCoursePlayer('${c.id}')">
                  <i data-lucide="play-circle"></i> Resume Track
                </button>
              ` : `
                <button class="btn btn-sm btn-primary" onclick="App.handleEnrollClick('${c.id}')">
                  <i data-lucide="plus-circle"></i> Enroll Now
                </button>
              `}
            </div>
          </div>
        `;
      }).join('');
    }

    // Spotlight Achievements Wall
    const achievements = store.getAchievements();
    const achGrid = document.getElementById('homepage-achievements-grid');
    if (achGrid) {
      achGrid.innerHTML = achievements.map(ach => `
        <div class="card" style="border-left: 4px solid #F59E0B;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <div class="table-avatar" style="background:#FEF3C7; color:#B45309;">${ach.avatar || 'CC'}</div>
            <div>
              <div style="font-weight:700; font-size:0.95rem;">${ach.recipientName}</div>
              <div style="font-size:0.75rem; color:var(--text-muted);">${ach.department}</div>
            </div>
          </div>
          <div style="font-weight:600; font-size:0.85rem; color:var(--brand-accent); margin-bottom:6px;">
            <i data-lucide="award" style="width:16px; height:16px; display:inline;"></i> ${ach.awardTitle}
          </div>
          <p style="font-size:0.825rem; font-style:italic; color:var(--text-secondary); margin-bottom:10px;">"${ach.testimonial}"</p>
          <div style="font-size:0.75rem; font-weight:700; color:var(--color-success);">${ach.score}</div>
        </div>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  },

  // Course Catalog View
  renderCourseCatalog() {
    const courses = store.getCourses();
    const container = document.getElementById('catalog-courses-grid');
    if (!container) return;

    const user = store.getCurrentUser();

    container.innerHTML = courses.map(c => {
      const isEnrolled = user && user.role === 'trainee' && store.getEnrollment(c.id, user.id);
      const bgStyle = c.imageUrl ? `background-image: url('${c.imageUrl}');` : `background: ${c.imageBg};`;
      return `
        <div class="course-card">
          <div class="course-thumb" style="${bgStyle}">
            <div class="course-thumb-content">
              <span class="badge ${c.isNew ? 'badge-warning' : 'badge-primary'}">${c.level}</span>
              <span style="color:#fff; font-size:0.75rem; font-weight:600;"><i data-lucide="clock" style="width:12px; height:12px; display:inline;"></i> ${c.duration}</span>
            </div>
          </div>
          <div class="course-body">
            <div class="course-subject">${c.subject}</div>
            <h4 class="course-title">${c.title}</h4>
            <p class="course-desc">${c.description}</p>
            <div class="course-meta">
              <div class="course-trainer">
                <span>${c.trainerName}</span>
              </div>
              <span style="color:#F59E0B; font-weight:700;">★ ${c.rating} (${c.enrolledCount} Enrolled)</span>
            </div>
          </div>
          <div class="course-footer">
            <button class="btn btn-sm btn-outline" onclick="TraineeView.openCourseDetailModal('${c.id}')">
              <i data-lucide="info"></i> Syllabus
            </button>
            ${isEnrolled ? `
              <button class="btn btn-sm btn-primary" onclick="TraineeView.openCoursePlayer('${c.id}')">
                <i data-lucide="play-circle"></i> Resume Learning
              </button>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="App.handleEnrollClick('${c.id}')">
                <i data-lucide="check"></i> Enroll
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  // Global Library View
  renderGlobalLibrary() {
    const resources = store.getResources();
    const grid = document.getElementById('global-library-grid');
    if (!grid) return;

    grid.innerHTML = resources.map(res => TraineeView.renderResourceCard(res)).join('');
    if (window.lucide) window.lucide.createIcons();
  },

  handleEnrollClick(courseId) {
    const user = store.getCurrentUser();
    if (!user) {
      this.showToast("Sign In Required", "Please sign in as Trainee to enroll in courses.", "warning");
      this.openLoginModal();
      return;
    }

    if (user.role !== 'trainee') {
      this.showToast("Role Restricted", "Only Trainee accounts can enroll in courses.", "warning");
      return;
    }

    const res = store.enrollInCourse(courseId, user.id);
    if (res.success) {
      this.showToast("Enrolled Successfully!", "Course has been added to your Trainee Hub.", "success");
      this.navigateTo('trainee-portal');
      TraineeView.switchTab('courses');
    } else {
      this.showToast("Enrollment", res.message, "info");
    }
  }
};

// Auto start when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
