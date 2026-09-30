/**
 * CAPACITY CONNECT - AUTHENTICATION & DEMO ROLE SWITCHER
 */

const Auth = {
  init() {
    this.bindEvents();
    this.updateUserUI();
  },

  bindEvents() {
    // Demo switcher items
    document.querySelectorAll('[data-demo-login]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = e.currentTarget.getAttribute('data-demo-login');
        this.loginAsDemo(role);
      });
    });

    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value.trim();
        const res = store.login(email, pass);
        if (res.success) {
          App.showToast("Signed In", `Welcome back, ${res.user.name}!`, "success");
          App.closeAllModals();
          App.navigateByRole(res.user.role);
        } else {
          App.showToast("Sign In Failed", res.message, "error");
        }
      });
    }

    // Register Form Submit
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value.trim();
        const role = document.getElementById('reg-role').value;
        const department = document.getElementById('reg-dept').value.trim();
        const title = document.getElementById('reg-title').value.trim();
        const bio = document.getElementById('reg-bio').value.trim();

        const res = store.registerUser({
          name,
          email,
          password,
          role,
          department,
          title,
          bio
        });

        if (res.success) {
          if (res.pendingApproval) {
            App.showToast("Registration Submitted", "Your account is pending Admin approval. You will receive access once approved.", "info");
          } else {
            App.showToast("Account Created", `Welcome to Capacity Connect, ${res.user.name}!`, "success");
            App.navigateByRole(res.user.role);
          }
          App.closeAllModals();
        } else {
          App.showToast("Registration Failed", res.message, "error");
        }
      });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        store.setCurrentUser(null);
        App.showToast("Signed Out", "You have securely signed out.", "info");
        App.navigateTo('home');
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

    if (!user) {
      if (guestActions) guestActions.classList.remove('hidden');
      if (userActions) userActions.classList.add('hidden');
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
    const portalNavLink = document.getElementById('nav-portal-link');
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
