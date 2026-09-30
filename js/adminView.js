/**
 * CAPACITY CONNECT - ADMIN PORTAL CONTROLLER
 * User Approval, Role Management, Dashboards & Charts,
 * and Homepage Publishing (Announcements, Achievements, Content).
 */

const AdminView = {
  activeTab: 'approvals',
  chartInstances: {},

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // 1. Admin Direct User Onboarding
    const userForm = document.getElementById('form-admin-create-user');
    if (userForm && !userForm.dataset.bound) {
      userForm.dataset.bound = "true";
      userForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('adm-user-name').value.trim();
        const email = document.getElementById('adm-user-email').value.trim();
        const role = document.getElementById('adm-user-role').value;
        const department = document.getElementById('adm-user-dept').value.trim();
        const title = document.getElementById('adm-user-title').value.trim();
        const bio = document.getElementById('adm-user-bio').value.trim();

        store.adminCreateUser({ name, email, role, department, title, bio });
        App.showToast("Account Activated", `${name} onboarded directly as ${role.toUpperCase()}.`, "success");
        App.closeAllModals();
        userForm.reset();
        this.render();
      });
    }

    // 2. Admin / Trainer Course Publishing
    const courseForm = document.getElementById('form-create-course');
    if (courseForm && !courseForm.dataset.bound) {
      courseForm.dataset.bound = "true";
      courseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = store.getCurrentUser();
        const title = document.getElementById('new-course-title').value.trim();
        const subject = document.getElementById('new-course-subject').value;
        const duration = document.getElementById('new-course-duration').value.trim();
        const level = document.getElementById('new-course-level').value;
        const isFeatured = document.getElementById('new-course-featured').value === 'yes';
        const description = document.getElementById('new-course-desc').value.trim();
        const prerequisites = document.getElementById('new-course-prereq').value.trim();

        store.addCourse({
          title,
          subject,
          duration,
          level,
          isFeatured,
          description,
          prerequisites,
          trainerId: user ? user.id : 'usr-trainer-01',
          trainerName: user ? user.name : 'Dr. Marcus Vance'
        });

        App.showToast("Course Published", `${title} has been added to the enterprise catalog.`, "success");
        App.closeAllModals();
        courseForm.reset();
        this.render();
        App.renderHomepageContent();
      });
    }
  },

  render() {
    const user = store.getCurrentUser();
    if (!user || user.role !== 'admin') {
      return;
    }

    const container = document.getElementById('admin-portal-view');
    if (!container) return;

    const allUsers = store.getUsers();
    const pendingUsers = allUsers.filter(u => u.status === 'pending_approval');
    const courses = store.getCourses();
    const enrollments = store.data.enrollments;
    const attempts = store.getAllAttempts();
    const certCount = allUsers.reduce((sum, u) => sum + (u.certificates ? u.certificates.length : 0), 0);

    container.innerHTML = `
      <div class="container">
        <!-- Admin Banner -->
        <div class="dashboard-banner">
          <div class="user-banner-profile">
            <div class="user-banner-avatar" style="background:var(--role-admin-bg); color:var(--role-admin);">
              ${user.avatar || 'AD'}
            </div>
            <div class="user-banner-info">
              <h2>${user.name}</h2>
              <div class="user-banner-meta">
                <span class="badge badge-admin"><i data-lucide="shield-check"></i> System Administrator</span>
                <span><i data-lucide="building"></i> ${user.department || 'Executive Directorate'}</span>
                <span><i data-lucide="alert-circle" style="color:var(--color-warning);"></i> ${pendingUsers.length} Pending Approval</span>
              </div>
            </div>
          </div>
          <div class="dashboard-banner-actions">
            <button class="btn btn-outline" id="btn-open-announcement-modal">
              <i data-lucide="megaphone"></i> Publish Notice
            </button>
            <button class="btn btn-primary" onclick="App.navigateTo('competency')">
              <i data-lucide="git-merge"></i> Competency Engine
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div>
              <div class="metric-label">Total Registered Users</div>
              <div class="metric-value">${allUsers.length}</div>
              <div class="metric-change positive"><i data-lucide="user-plus"></i> ${pendingUsers.length} pending review</div>
            </div>
            <div class="metric-icon-box" style="background:#EFF6FF; color:#2563EB;">
              <i data-lucide="users"></i>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-label">Active Course Tracks</div>
              <div class="metric-value">${courses.length}</div>
              <div class="metric-change positive"><i data-lucide="layers"></i> Across 6 domains</div>
            </div>
            <div class="metric-icon-box" style="background:#F0FDFA; color:#0D9488;">
              <i data-lucide="book-marked"></i>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-label">Total Course Enrollments</div>
              <div class="metric-value">${enrollments.length}</div>
              <div class="metric-change positive"><i data-lucide="trending-up"></i> +18% this month</div>
            </div>
            <div class="metric-icon-box" style="background:#FEF3C7; color:#D97706;">
              <i data-lucide="graduation-cap"></i>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-label">Certificates Issued</div>
              <div class="metric-value">${certCount}</div>
              <div class="metric-change positive"><i data-lucide="award"></i> 91% pass benchmark</div>
            </div>
            <div class="metric-icon-box" style="background:#F5F3FF; color:#7C3AED;">
              <i data-lucide="award"></i>
            </div>
          </div>
        </div>

        <!-- Admin Navigation Tabs -->
        <div class="tabs-nav" id="admin-tabs">
          <button class="tab-btn ${this.activeTab === 'approvals' ? 'active' : ''}" data-admin-tab="approvals">
            <i data-lucide="user-check"></i> User Approvals & Roles (${pendingUsers.length} Pending)
          </button>
          <button class="tab-btn ${this.activeTab === 'analytics' ? 'active' : ''}" data-admin-tab="analytics">
            <i data-lucide="bar-chart-3"></i> Dashboards & Analytics
          </button>
          <button class="tab-btn ${this.activeTab === 'cms' ? 'active' : ''}" data-admin-tab="cms">
            <i data-lucide="layout"></i> Homepage CMS & Announcements
          </button>
        </div>

        <!-- Tab Content -->
        <div id="admin-tab-content">
          ${this.renderActiveTabContent(allUsers, pendingUsers, courses, enrollments, attempts)}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindTabEvents();

    if (this.activeTab === 'analytics') {
      this.initCharts(courses, enrollments, attempts, allUsers);
    }
  },

  renderActiveTabContent(allUsers, pendingUsers, courses, enrollments, attempts) {
    switch (this.activeTab) {
      case 'approvals':
        return this.renderApprovalsTab(allUsers, pendingUsers);
      case 'analytics':
        return this.renderAnalyticsTab();
      case 'cms':
        return this.renderCmsTab();
      default:
        return this.renderApprovalsTab(allUsers, pendingUsers);
    }
  },

  // 1. User Approval & Role Management Tab
  renderApprovalsTab(allUsers, pendingUsers) {
    return `
      <div>
        <!-- Pending Users Box (if any) -->
        ${pendingUsers.length > 0 ? `
          <div style="background:var(--color-warning-bg); border:1px solid var(--color-warning-border); border-radius:var(--radius-lg); padding:16px 20px; margin-bottom:24px;">
            <div style="display:flex; align-items:center; gap:8px; font-weight:700; color:var(--color-warning); margin-bottom:6px;">
              <i data-lucide="alert-triangle"></i> Pending User Approvals Action Required
            </div>
            <p style="font-size:0.875rem; color:#92400E;">
              There are ${pendingUsers.length} newly registered users awaiting verification before they can access portal learning resources.
            </p>
          </div>
        ` : ''}

        <div class="table-container">
          <div class="table-toolbar">
            <div>
              <h3>User Directory & Role Permissions</h3>
              <p class="section-subtitle">Approve registrations, reassign roles, or deactivate portal access</p>
            </div>
            <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
              <button class="btn btn-sm btn-primary" onclick="AdminView.openCreateUserModal()">
                <i data-lucide="user-plus"></i> Onboard User
              </button>
              <select class="form-select" id="admin-user-filter" style="width:160px;">
                <option value="all">All Statuses</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <div class="table-search-box">
                <i data-lucide="search" class="search-icon"></i>
                <input type="text" class="form-input" id="admin-user-search" placeholder="Search user name or email...">
              </div>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>User Details</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th>Admin Actions</th>
              </tr>
            </thead>
            <tbody id="admin-users-tbody">
              ${allUsers.map(u => `
                <tr data-status="${u.status}">
                  <td>
                    <div class="table-user-cell">
                      <div class="table-avatar" style="${u.role === 'admin' ? 'background:var(--role-admin-bg); color:var(--role-admin);' : (u.role === 'trainer' ? 'background:var(--role-trainer-bg); color:var(--role-trainer);' : '')}">
                        ${u.avatar || u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style="font-weight:600;">${u.name}</div>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select class="form-select" style="padding:4px 8px; font-size:0.8rem; width:110px;" onchange="AdminView.changeRole('${u.id}', this.value)">
                      <option value="trainee" ${u.role === 'trainee' ? 'selected' : ''}>Trainee</option>
                      <option value="trainer" ${u.role === 'trainer' ? 'selected' : ''}>Trainer</option>
                      <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                  </td>
                  <td><span style="font-size:0.825rem;">${u.department || 'Workforce'}</span></td>
                  <td>
                    <span class="badge ${u.status === 'active' ? 'badge-success' : (u.status === 'pending_approval' ? 'badge-warning' : 'badge-danger')}">
                      ${u.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td><span style="font-size:0.8rem; color:var(--text-muted);">${u.joinedDate}</span></td>
                  <td>
                    <div style="display:flex; gap:6px;">
                      ${u.status === 'pending_approval' ? `
                        <button class="btn btn-sm btn-success" onclick="AdminView.approveUser('${u.id}')">
                          <i data-lucide="check"></i> Approve
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="AdminView.rejectUser('${u.id}')">
                          <i data-lucide="x"></i> Reject
                        </button>
                      ` : `
                        <button class="btn btn-sm btn-outline" onclick="AdminView.toggleSuspendUser('${u.id}', '${u.status}')">
                          ${u.status === 'active' ? '<i data-lucide="slash"></i> Suspend' : '<i data-lucide="check-circle"></i> Activate'}
                        </button>
                      `}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // 2. Dashboards & Chart.js Analytics Tab
  renderAnalyticsTab() {
    return `
      <div>
        <div class="section-header">
          <div>
            <h3>Enterprise Capacity Building Analytics</h3>
            <p class="section-subtitle">Real-time statistics on participation, domain mastery, and certification completion</p>
          </div>
          <button class="btn btn-outline" onclick="App.showToast('Export Report', 'Generated executive summary report in CSV.', 'success')">
            <i data-lucide="file-spreadsheet"></i> Export Analytics CSV
          </button>
        </div>

        <div class="charts-grid">
          <!-- Chart 1: Enrollment Trends -->
          <div class="chart-card">
            <div class="chart-card-header">
              <h4>Enrollment Growth Over Time</h4>
              <span class="badge badge-primary">Past 6 Months</span>
            </div>
            <div class="chart-wrapper">
              <canvas id="chart-enrollments"></canvas>
            </div>
          </div>

          <!-- Chart 2: Subject MCQ Performance -->
          <div class="chart-card">
            <div class="chart-card-header">
              <h4>Assessment Pass Rates by Subject</h4>
              <span class="badge badge-success">Target: 80%</span>
            </div>
            <div class="chart-wrapper">
              <canvas id="chart-subject-scores"></canvas>
            </div>
          </div>

          <!-- Chart 3: User Role Distribution -->
          <div class="chart-card">
            <div class="chart-card-header">
              <h4>Platform Role Distribution</h4>
              <span class="badge badge-info">Active Directory</span>
            </div>
            <div class="chart-wrapper">
              <canvas id="chart-user-distribution"></canvas>
            </div>
          </div>

          <!-- Chart 4: Course Completion Funnel -->
          <div class="chart-card">
            <div class="chart-card-header">
              <h4>Competency Milestone Funnel</h4>
              <span class="badge badge-warning">Completion Rates</span>
            </div>
            <div class="chart-wrapper">
              <canvas id="chart-completion-funnel"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 3. Homepage CMS & Announcements Tab
  renderCmsTab() {
    const announcements = store.getAnnouncements();
    const achievements = store.getAchievements();

    return `
      <div class="flex-col gap-xl flex">
        <!-- Announcements Management -->
        <div class="card">
          <div class="profile-card-header">
            <div>
              <h3>Homepage Announcements & Broadcasts</h3>
              <p class="section-subtitle">Broadcast critical notifications, events, and newly added learning content</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="AdminView.openCreateAnnouncementModal()">
              <i data-lucide="plus"></i> New Announcement
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:12px;">
            ${announcements.map(ann => `
              <div style="background:var(--bg-surface-alt); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:14px; display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                  <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                    <span class="badge ${ann.type === 'URGENT' ? 'badge-danger' : (ann.type === 'EVENT' ? 'badge-warning' : 'badge-primary')}">
                      ${ann.type}
                    </span>
                    <strong style="font-size:0.95rem;">${ann.title}</strong>
                  </div>
                  <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:4px;">${ann.content}</p>
                  <div style="font-size:0.75rem; color:var(--text-muted);">
                    Published: ${ann.date} | Target: ${ann.target}
                  </div>
                </div>
                <button class="btn btn-sm btn-ghost" style="color:var(--color-danger);" onclick="AdminView.deleteAnnouncement('${ann.id}')">
                  <i data-lucide="trash-2"></i>
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Spotlight Achievements Management -->
        <div class="card">
          <div class="profile-card-header">
            <div>
              <h3>Spotlight Achievements & Hall of Fame</h3>
              <p class="section-subtitle">Showcase exemplary trainee and team performance on the homepage</p>
            </div>
            <button class="btn btn-sm btn-primary" onclick="AdminView.openCreateAchievementModal()">
              <i data-lucide="plus"></i> Add Spotlight
            </button>
          </div>

          <div class="grid grid-cols-3 gap-md" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
            ${achievements.map(ach => `
              <div style="background:var(--bg-surface-alt); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
                  <div class="table-avatar">${ach.avatar || 'CC'}</div>
                  <div>
                    <div style="font-weight:700; font-size:0.95rem;">${ach.recipientName}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${ach.department}</div>
                  </div>
                </div>
                <div style="font-weight:600; font-size:0.85rem; color:var(--brand-accent); margin-bottom:6px;">
                  <i data-lucide="award"></i> ${ach.awardTitle}
                </div>
                <p style="font-size:0.8rem; font-style:italic; color:var(--text-secondary); margin-bottom:8px;">"${ach.testimonial}"</p>
                <div style="font-size:0.75rem; color:var(--color-success); font-weight:700;">
                  ${ach.score}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  // Chart.js initialization
  initCharts(courses, enrollments, attempts, allUsers) {
    if (!window.Chart) return;

    // Destroy prior instances
    Object.values(this.chartInstances).forEach(chart => {
      if (chart && chart.destroy) chart.destroy();
    });

    // 1. Enrollment Line Chart
    const ctx1 = document.getElementById('chart-enrollments');
    if (ctx1) {
      this.chartInstances.enrollments = new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct (Projected)'],
          datasets: [{
            label: 'Cumulative Enrollments',
            data: [45, 92, 160, 235, 312, 420],
            borderColor: '#2563EB',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } }
        }
      });
    }

    // 2. Subject Scores Bar Chart
    const ctx2 = document.getElementById('chart-subject-scores');
    if (ctx2) {
      this.chartInstances.subjectScores = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Cloud Arch', 'Applied AI', 'Cyber Defense', 'Agile Lead', 'Data Gov'],
          datasets: [
            {
              label: 'Average Score (%)',
              data: [82, 85, 78, 88, 76],
              backgroundColor: '#0D9488',
              borderRadius: 6
            },
            {
              label: 'Benchmark (75%)',
              data: [75, 75, 75, 75, 75],
              type: 'line',
              borderColor: '#D97706',
              borderDash: [5, 5],
              fill: false
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } },
          scales: { y: { beginAtZero: true, max: 100 } }
        }
      });
    }

    // 3. User Role Doughnut Chart
    const ctx3 = document.getElementById('chart-user-distribution');
    if (ctx3) {
      const traineesCount = allUsers.filter(u => u.role === 'trainee').length;
      const trainersCount = allUsers.filter(u => u.role === 'trainer').length;
      const adminsCount = allUsers.filter(u => u.role === 'admin').length;

      this.chartInstances.userDist = new Chart(ctx3, {
        type: 'doughnut',
        data: {
          labels: ['Trainees', 'Trainers', 'Admins'],
          datasets: [{
            data: [traineesCount, trainersCount, adminsCount],
            backgroundColor: ['#2563EB', '#0D9488', '#7C3AED'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 4. Completion Funnel Bar Chart
    const ctx4 = document.getElementById('chart-completion-funnel');
    if (ctx4) {
      this.chartInstances.funnel = new Chart(ctx4, {
        type: 'bar',
        data: {
          labels: ['Enrolled in Track', 'Modules Accessed', 'Assessments Attempted', 'Certified Passed'],
          datasets: [{
            label: 'Learners',
            data: [312, 280, 215, 185],
            backgroundColor: ['#3B82F6', '#60A5FA', '#10B981', '#059669'],
            borderRadius: 6
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: { x: { beginAtZero: true } }
        }
      });
    }
  },

  bindTabEvents() {
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-admin-tab');
        this.activeTab = tab;
        this.render();
      });
    });

    const annBtn = document.getElementById('btn-open-announcement-modal');
    if (annBtn) annBtn.addEventListener('click', () => this.openCreateAnnouncementModal());

    // Search input
    const searchInput = document.getElementById('admin-user-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#admin-users-tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }

    // Filter select
    const filterSelect = document.getElementById('admin-user-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        const status = e.target.value;
        const rows = document.querySelectorAll('#admin-users-tbody tr');
        rows.forEach(row => {
          if (status === 'all' || row.getAttribute('data-status') === status) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    }
  },

  // Actions
  approveUser(userId) {
    const success = store.updateUserStatus(userId, 'active');
    if (success) {
      App.showToast("User Approved", "The user account is now active and granted portal access.", "success");
      this.render();
    }
  },

  rejectUser(userId) {
    if (confirm("Reject this registration request?")) {
      const success = store.updateUserStatus(userId, 'rejected');
      if (success) {
        App.showToast("User Rejected", "Registration was rejected.", "info");
        this.render();
      }
    }
  },

  toggleSuspendUser(userId, currentStatus) {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    store.updateUserStatus(userId, nextStatus);
    App.showToast("Status Updated", `User is now ${nextStatus}.`, "info");
    this.render();
  },

  changeRole(userId, newRole) {
    store.updateUserRole(userId, newRole);
    App.showToast("Role Updated", `User role changed to ${newRole.toUpperCase()}.`, "success");
    this.render();
  },

  openCreateAnnouncementModal() {
    const modal = document.getElementById('modal-create-announcement');
    if (modal) modal.classList.add('active');
  },

  openCreateAchievementModal() {
    const modal = document.getElementById('modal-create-achievement');
    if (modal) modal.classList.add('active');
  },

  deleteAnnouncement(annId) {
    store.data.announcements = store.data.announcements.filter(a => a.id !== annId);
    store.saveData();
    App.showToast("Notice Deleted", "Announcement removed from homepage.", "info");
    this.render();
  },

  openCreateUserModal() {
    const modal = document.getElementById('modal-admin-create-user');
    if (modal) modal.classList.add('active');
  },

  openCreateCourseModal() {
    const modal = document.getElementById('modal-create-course');
    if (modal) modal.classList.add('active');
  },

  toggleCourseFeatured(courseId) {
    const course = store.getCourseById(courseId);
    if (course) {
      course.isFeatured = !course.isFeatured;
      store.saveData();
      App.showToast("Catalog Updated", `${course.title} is now ${course.isFeatured ? 'featured' : 'standard'} on homepage.`, "info");
      this.render();
      App.renderHomepageContent();
    }
  }
};
