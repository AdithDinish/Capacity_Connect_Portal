/**
 * CAPACITY CONNECT - TRAINEE PORTAL CONTROLLER
 * Professional Profile, Enrolled Courses, Resource Library,
 * Assessments, Certificates, and Course Feedback.
 */

const TraineeView = {
  activeTab: 'profile',

  init() {
    this.bindEvents();
  },

  render() {
    const user = store.getCurrentUser();
    if (!user || user.role !== 'trainee') {
      return;
    }

    const container = document.getElementById('trainee-portal-view');
    if (!container) return;

    container.innerHTML = `
      <div class="container">
        <!-- Banner Greeting -->
        <div class="dashboard-banner">
          <div class="user-banner-profile">
            <div class="user-banner-avatar">${user.avatar || user.name.slice(0, 2).toUpperCase()}</div>
            <div class="user-banner-info">
              <h2>${user.name}</h2>
              <div class="user-banner-meta">
                <span class="badge badge-trainee"><i data-lucide="user-check"></i> Trainee</span>
                <span><i data-lucide="building"></i> ${user.department || 'Enterprise Workforce'}</span>
                <span><i data-lucide="award"></i> ${user.title || 'Professional Learner'}</span>
              </div>
            </div>
          </div>
          <div class="dashboard-banner-actions">
            <button class="btn btn-outline" id="btn-browse-catalog">
              <i data-lucide="compass"></i> Explore Courses
            </button>
            <button class="btn btn-primary" id="btn-view-assessments-tab">
              <i data-lucide="clipboard-check"></i> Take Assessment
            </button>
          </div>
        </div>

        <!-- Trainee Navigation Tabs -->
        <div class="tabs-nav" id="trainee-tabs">
          <button class="tab-btn ${this.activeTab === 'profile' ? 'active' : ''}" data-trainee-tab="profile">
            <i data-lucide="user"></i> Professional Profile
          </button>
          <button class="tab-btn ${this.activeTab === 'courses' ? 'active' : ''}" data-trainee-tab="courses">
            <i data-lucide="book-open"></i> Enrolled Courses (${store.getEnrollmentsForUser(user.id).length})
          </button>
          <button class="tab-btn ${this.activeTab === 'resources' ? 'active' : ''}" data-trainee-tab="resources">
            <i data-lucide="folder-git-2"></i> Trainer Library
          </button>
          <button class="tab-btn ${this.activeTab === 'assessments' ? 'active' : ''}" data-trainee-tab="assessments">
            <i data-lucide="check-circle-2"></i> Assessments & Quizzes
          </button>
          <button class="tab-btn ${this.activeTab === 'certificates' ? 'active' : ''}" data-trainee-tab="certificates">
            <i data-lucide="award"></i> Certificates (${(user.certificates || []).length})
          </button>
        </div>

        <!-- Tab Content Containers -->
        <div id="trainee-tab-content">
          ${this.renderActiveTabContent(user)}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindTabEvents(user);
  },

  renderActiveTabContent(user) {
    switch (this.activeTab) {
      case 'profile':
        return this.renderProfileTab(user);
      case 'courses':
        return this.renderCoursesTab(user);
      case 'resources':
        return this.renderResourcesTab(user);
      case 'assessments':
        return this.renderAssessmentsTab(user);
      case 'certificates':
        return this.renderCertificatesTab(user);
      default:
        return this.renderProfileTab(user);
    }
  },

  // 1. Professional Profile Tab
  renderProfileTab(user) {
    const qualifications = user.qualifications || [];
    const experience = user.experience || [];
    const skills = user.skills || [];
    const interests = user.interests || [];

    return `
      <div class="profile-grid">
        <!-- Left Sidebar: Bio, Interests, Skills -->
        <div class="profile-sidebar">
          <div class="card">
            <div class="profile-card-header">
              <h3>About & Bio</h3>
            </div>
            <p>${user.bio || 'Continuous learner dedicated to organizational capability building.'}</p>
            <div style="margin-top: 16px; font-size: 0.85rem; color: var(--text-muted);">
              <div><strong>Member Since:</strong> ${user.joinedDate || '2025'}</div>
              <div><strong>Email:</strong> ${user.email}</div>
            </div>
          </div>

          <!-- Skills Matrix -->
          <div class="card">
            <div class="profile-card-header">
              <h3>Competencies & Skills</h3>
              <button class="btn btn-sm btn-outline" id="btn-add-skill-modal">
                <i data-lucide="plus"></i> Add
              </button>
            </div>
            <div class="skills-tags-wrap">
              ${skills.length === 0 ? '<p class="form-hint">No skills added yet.</p>' : ''}
              ${skills.map(s => `
                <div class="skill-tag">
                  <span class="level-dot ${s.level.toLowerCase()}"></span>
                  <span>${s.name}</span>
                  <span style="font-size:0.7rem; color:var(--text-muted); font-weight:normal;">(${s.level})</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Areas of Interest -->
          <div class="card">
            <div class="profile-card-header">
              <h3>Areas of Interest</h3>
              <button class="btn btn-sm btn-outline" id="btn-add-interest-prompt">
                <i data-lucide="plus"></i> Add
              </button>
            </div>
            <div class="skills-tags-wrap">
              ${interests.length === 0 ? '<p class="form-hint">No interests added yet.</p>' : ''}
              ${interests.map(int => `
                <span class="badge badge-primary">${int}</span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: Qualifications & Work Experience -->
        <div class="flex-col gap-lg flex">
          <!-- Qualifications Card -->
          <div class="card">
            <div class="profile-card-header">
              <div>
                <h3>Academic & Professional Qualifications</h3>
                <p class="section-subtitle">Degrees, diplomas, and accredited credentials</p>
              </div>
              <button class="btn btn-sm btn-primary" id="btn-add-qual-modal">
                <i data-lucide="plus"></i> Add Qualification
              </button>
            </div>

            <div class="timeline-list">
              ${qualifications.length === 0 ? '<p class="form-hint">No qualifications listed.</p>' : ''}
              ${qualifications.map(q => `
                <div class="timeline-item">
                  <div class="timeline-title">${q.degree}</div>
                  <div class="timeline-sub">${q.institution}</div>
                  <div class="timeline-date"><i data-lucide="calendar"></i> Class of ${q.year}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Work Experience Timeline -->
          <div class="card">
            <div class="profile-card-header">
              <div>
                <h3>Work Experience</h3>
                <p class="section-subtitle">Career history, organizational roles, and responsibilities</p>
              </div>
              <button class="btn btn-sm btn-primary" id="btn-add-exp-modal">
                <i data-lucide="plus"></i> Add Experience
              </button>
            </div>

            <div class="timeline-list">
              ${experience.length === 0 ? '<p class="form-hint">No work experience listed.</p>' : ''}
              ${experience.map(e => `
                <div class="timeline-item">
                  <div class="timeline-title">${e.role}</div>
                  <div class="timeline-sub">${e.organization}</div>
                  <div class="timeline-date">${e.period}</div>
                  <div class="timeline-desc">${e.description}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // 2. Enrolled Courses Tab
  renderCoursesTab(user) {
    const enrollments = store.getEnrollmentsForUser(user.id);
    const allCourses = store.getCourses();

    if (enrollments.length === 0) {
      return `
        <div class="card text-center" style="padding: 48px;">
          <div style="width:64px; height:64px; border-radius:50%; background:var(--brand-accent-subtle); color:var(--brand-accent); display:flex; align-items:center; justify-content:center; margin: 0 auto 16px auto;">
            <i data-lucide="book-open" style="width:32px; height:32px;"></i>
          </div>
          <h3>No Enrolled Courses Yet</h3>
          <p style="margin: 8px auto 24px auto; max-width: 440px;">
            Start building your competencies today by enrolling in our executive learning tracks and masterclasses.
          </p>
          <button class="btn btn-primary" onclick="App.navigateTo('courses')">Browse Course Catalog</button>
        </div>
      `;
    }

    return `
      <div class="grid grid-cols-2 gap-lg" style="grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));">
        ${enrollments.map(enr => {
          const course = allCourses.find(c => c.id === enr.courseId);
          if (!course) return '';
          return `
            <div class="course-card">
              <div class="course-thumb" style="background: ${course.imageBg};">
                <div class="course-thumb-content">
                  <span class="badge ${enr.progress === 100 ? 'badge-success' : 'badge-primary'}">
                    ${enr.progress === 100 ? 'Completed' : 'In Progress'}
                  </span>
                  <span style="color:#fff; font-size:0.75rem; font-weight:600;"><i data-lucide="clock"></i> ${course.duration}</span>
                </div>
              </div>
              <div class="course-body">
                <div class="course-subject">${course.subject}</div>
                <h4 class="course-title">${course.title}</h4>
                <div class="course-trainer">
                  <span>Instructor: ${course.trainerName}</span>
                </div>
                <div style="margin: 14px 0 6px 0;">
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:600;">
                    <span>Course Progress</span>
                    <span>${enr.progress}%</span>
                  </div>
                  <div class="progress-container">
                    <div class="progress-bar" style="width: ${enr.progress}%;"></div>
                  </div>
                </div>
              </div>
              <div class="course-footer" style="flex-wrap:wrap; gap:8px;">
                <button class="btn btn-sm btn-primary" onclick="TraineeView.openCoursePlayer('${course.id}')">
                  <i data-lucide="play-circle"></i> ${enr.progress === 100 ? 'Review Track' : 'Continue Learning'}
                </button>
                <button class="btn btn-sm btn-outline" onclick="TraineeView.openCourseDetailModal('${course.id}')">
                  <i data-lucide="eye"></i> Syllabus
                </button>
                <button class="btn btn-sm btn-outline" onclick="TraineeView.openFeedbackModal('${course.id}')">
                  <i data-lucide="star"></i> Feedback
                </button>
                <button class="btn btn-sm btn-ghost" onclick="TraineeView.unenroll('${course.id}')" title="Unenroll">
                  <i data-lucide="log-out"></i>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // 3. Trainer Library Access Tab
  renderResourcesTab(user) {
    const resources = store.getResources();

    return `
      <div>
        <div class="section-header">
          <div>
            <h3>Trainer Library & Learning Resources</h3>
            <p class="section-subtitle">Access recorded lectures, presentation slide decks, and enterprise study guides</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <select class="form-select" id="resource-type-filter" style="width: 180px;">
              <option value="all">All Resource Types</option>
              <option value="video">Recorded Lectures</option>
              <option value="presentation">Slide Presentations</option>
              <option value="document">Study Guides & PDFs</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-md" id="resources-grid" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          ${resources.map(res => this.renderResourceCard(res)).join('')}
        </div>
      </div>
    `;
  },

  renderResourceCard(res) {
    let icon = 'file-text';
    let iconClass = 'document';
    let typeLabel = 'Document (PDF)';

    if (res.type === 'video') {
      icon = 'video';
      iconClass = 'video';
      typeLabel = `Lecture (${res.duration || '45m'})`;
    } else if (res.type === 'presentation') {
      icon = 'presentation';
      iconClass = 'presentation';
      typeLabel = `Presentation (${res.slideCount || '30'} slides)`;
    }

    return `
      <div class="resource-card">
        <div class="resource-icon ${iconClass}">
          <i data-lucide="${icon}"></i>
        </div>
        <div class="resource-details">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <span class="badge badge-info" style="font-size:0.675rem;">${res.subject}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">${typeLabel}</span>
          </div>
          <div class="resource-title" style="margin-top: 6px;">${res.title}</div>
          <p style="font-size:0.8rem; margin: 4px 0 8px 0; color:var(--text-secondary);">${res.description}</p>
          <div class="resource-meta">
            <span><i data-lucide="user"></i> ${res.trainerName}</span>
            <span><i data-lucide="download"></i> ${res.downloads || 0} downloads</span>
          </div>
          <div style="margin-top: 10px;">
            <button class="btn btn-sm btn-primary" onclick="TraineeView.openResourceViewer('${res.id}')">
              <i data-lucide="${res.type === 'video' ? 'play-circle' : 'external-link'}"></i>
              ${res.type === 'video' ? 'Watch Lecture' : (res.type === 'presentation' ? 'View Slides' : 'Open Document')}
            </button>
          </div>
        </div>
      </div>
    `;
  },

  // 4. Assessments & MCQ Tests Tab
  renderAssessmentsTab(user) {
    const assessments = store.getAssessments();
    const attempts = store.getAllAttempts().filter(a => a.traineeId === user.id);

    return `
      <div>
        <div class="section-header">
          <div>
            <h3>Subject-Wise MCQ Assessments</h3>
            <p class="section-subtitle">Timed evaluation exams to test domain knowledge and earn certified credentials</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-lg" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          ${assessments.map(asm => {
            const userAttempt = attempts.find(att => att.assessmentId === asm.id);
            return `
              <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 8px;">
                  <span class="badge badge-primary">${asm.subject}</span>
                  <span style="font-size:0.8rem; color:var(--text-muted);"><i data-lucide="clock"></i> ${asm.timeLimitMinutes} Mins</span>
                </div>
                <h4 style="margin-bottom: 6px;">${asm.title}</h4>
                <p style="font-size:0.825rem; margin-bottom: 12px;">${asm.description}</p>
                <div style="display:flex; gap:16px; font-size:0.775rem; color:var(--text-muted); margin-bottom: 16px;">
                  <span><strong>Questions:</strong> ${asm.questions ? asm.questions.length : 5}</span>
                  <span><strong>Pass Score:</strong> ${asm.passingScore}%</span>
                  <span><strong>Deadline:</strong> ${asm.deadline}</span>
                </div>

                ${userAttempt ? `
                  <div style="background: ${userAttempt.passed ? 'var(--color-success-bg)' : 'var(--color-danger-bg)'}; border:1px solid ${userAttempt.passed ? 'var(--color-success-border)' : 'var(--color-danger-border)'}; padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 14px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                      <span style="font-weight:700; color:${userAttempt.passed ? 'var(--color-success)' : 'var(--color-danger)'};">
                        ${userAttempt.passed ? 'Passed with ' + userAttempt.score + '%' : 'Attempted (' + userAttempt.score + '%)'}
                      </span>
                      <div style="font-size:0.725rem; color:var(--text-secondary);">Taken on ${userAttempt.submittedAt}</div>
                    </div>
                    <span class="badge ${userAttempt.passed ? 'badge-success' : 'badge-danger'}">
                      ${userAttempt.passed ? 'Certified' : 'Retry Allowed'}
                    </span>
                  </div>
                ` : ''}

                <div style="display:flex; gap:8px;">
                  <button class="btn btn-primary w-full" onclick="AssessmentView.startAssessment('${asm.id}')">
                    <i data-lucide="play"></i> ${userAttempt ? 'Retake Assessment' : 'Start Assessment'}
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },

  // 5. Certificates Tab
  renderCertificatesTab(user) {
    const certificates = user.certificates || [];

    if (certificates.length === 0) {
      return `
        <div class="card text-center" style="padding: 48px;">
          <div style="width:64px; height:64px; border-radius:50%; background:var(--color-warning-bg); color:var(--color-warning); display:flex; align-items:center; justify-content:center; margin: 0 auto 16px auto;">
            <i data-lucide="award" style="width:32px; height:32px;"></i>
          </div>
          <h3>No Certificates Earned Yet</h3>
          <p style="margin: 8px auto 24px auto; max-width: 460px;">
            Complete your enrolled courses and pass the subject MCQ benchmark assessments with 70%+ score to earn verifiable certificates.
          </p>
          <button class="btn btn-primary" onclick="TraineeView.switchTab('assessments')">View Available Assessments</button>
        </div>
      `;
    }

    return `
      <div>
        <div class="section-header">
          <div>
            <h3>Your Earned Credentials & Certificates</h3>
            <p class="section-subtitle">Verified by Capacity Connect Directorate and certifying instructors</p>
          </div>
        </div>

        <div class="certificate-grid">
          ${certificates.map(cert => `
            <div class="cert-card">
              <div class="cert-card-ribbon">
                <i data-lucide="award" style="width:28px; height:28px;"></i>
              </div>
              <span class="badge badge-warning" style="align-self:flex-start; margin-bottom:8px;">Credential</span>
              <h4>${cert.courseTitle}</h4>
              <div class="cert-card-issuer">Trainer: ${cert.trainerName}</div>
              <div style="font-size:0.8rem; margin-bottom: 8px;">
                <strong>Score Achieved:</strong> ${cert.score}% Distinction
              </div>
              <div class="cert-card-footer">
                <span>Issued: ${cert.issueDate}</span>
                <button class="btn btn-sm btn-outline" onclick="CertificateView.openModal('${cert.id}')">
                  <i data-lucide="eye"></i> View & Print
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  bindTabEvents(user) {
    document.querySelectorAll('[data-trainee-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-trainee-tab');
        this.switchTab(tab);
      });
    });

    const addQualBtn = document.getElementById('btn-add-qual-modal');
    if (addQualBtn) addQualBtn.addEventListener('click', () => this.openAddQualModal());

    const addExpBtn = document.getElementById('btn-add-exp-modal');
    if (addExpBtn) addExpBtn.addEventListener('click', () => this.openAddExpModal());

    const addSkillBtn = document.getElementById('btn-add-skill-modal');
    if (addSkillBtn) addSkillBtn.addEventListener('click', () => this.openAddSkillModal());

    const addInterestBtn = document.getElementById('btn-add-interest-prompt');
    if (addInterestBtn) addInterestBtn.addEventListener('click', () => this.promptAddInterest());

    const browseBtn = document.getElementById('btn-browse-catalog');
    if (browseBtn) browseBtn.addEventListener('click', () => App.navigateTo('courses'));

    const takeAsmBtn = document.getElementById('btn-view-assessments-tab');
    if (takeAsmBtn) takeAsmBtn.addEventListener('click', () => this.switchTab('assessments'));

    // Resource Filter
    const resFilter = document.getElementById('resource-type-filter');
    if (resFilter) {
      resFilter.addEventListener('change', (e) => {
        const filterVal = e.target.value;
        const allRes = store.getResources();
        const filtered = filterVal === 'all' ? allRes : allRes.filter(r => r.type === filterVal);
        const grid = document.getElementById('resources-grid');
        if (grid) {
          grid.innerHTML = filtered.map(r => this.renderResourceCard(r)).join('');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }
  },

  switchTab(tabName) {
    this.activeTab = tabName;
    this.render();
  },

  unenroll(courseId) {
    const user = store.getCurrentUser();
    if (confirm("Are you sure you want to unenroll from this course?")) {
      store.unenrollCourse(courseId, user.id);
      App.showToast("Unenrolled", "You have been removed from the course roster.", "info");
      this.render();
    }
  },

  // Modal Openers
  openAddQualModal() {
    const modal = document.getElementById('modal-add-qual');
    if (modal) modal.classList.add('active');
  },

  openAddExpModal() {
    const modal = document.getElementById('modal-add-exp');
    if (modal) modal.classList.add('active');
  },

  openAddSkillModal() {
    const modal = document.getElementById('modal-add-skill');
    if (modal) modal.classList.add('active');
  },

  promptAddInterest() {
    const interest = prompt("Enter your area of interest (e.g. Generative AI, Cloud Security, Agile Coaching):");
    if (interest && interest.trim()) {
      const user = store.getCurrentUser();
      if (!user.interests) user.interests = [];
      user.interests.push(interest.trim());
      store.saveData();
      App.showToast("Interest Added", `${interest.trim()} added to your profile.`, "success");
      this.render();
    }
  },

  currentSlideIndex: 0,
  currentResource: null,
  isVideoPlaying: false,

  openResourceViewer(resId) {
    const res = store.getResources().find(r => r.id === resId);
    if (!res) return;

    this.currentResource = res;
    this.currentSlideIndex = 0;
    this.isVideoPlaying = false;

    const modal = document.getElementById('modal-resource-viewer');
    const title = document.getElementById('resource-viewer-title');
    const body = document.getElementById('resource-viewer-body');

    if (!modal || !title || !body) return;

    title.textContent = res.title;
    this.renderResourceContent();
    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  renderResourceContent() {
    const res = this.currentResource;
    const body = document.getElementById('resource-viewer-body');
    if (!res || !body) return;

    if (res.type === 'presentation') {
      const slides = [
        {
          title: "Executive Framework & Architectural Pillars",
          subtitle: `Strategic overview of ${res.subject} for modern enterprise platforms`,
          bullets: [
            "Decoupling legacy monoliths into resilient, self-healing microservice clusters",
            "Establishing continuous automated compliance and zero-trust verification boundary",
            "Multi-region high-availability failover topology with sub-second RPO/RTO"
          ],
          diagram: "Client Gateway ➔ API Ingress Controller ➔ Service Mesh Clusters ➔ Distributed Data Lake"
        },
        {
          title: "Core Protocols & Distributed State Orchestration",
          subtitle: "Handling eventual consistency, distributed transactions, and messaging",
          bullets: [
            "Event-driven architecture using Kafka partitions and asynchronous pub/sub channels",
            "Saga pattern implementation to manage distributed compensating transactions",
            "Idempotency tokens preventing duplicate execution across network partitions"
          ],
          diagram: "Producer ➔ Ingress Broker (TLS 1.3) ➔ Consumer Group Worker ➔ Immutable Audit Log"
        },
        {
          title: "Resilience Engineering & Circuit Breaking",
          subtitle: "Fault isolation and preventing cascading microservice failures",
          bullets: [
            "Adaptive rate-limiting with exponential backoff and jitter algorithms",
            "Chaos engineering automation: simulating pod eviction and latency spikes",
            "Graceful degradation: fallback caches ensuring 99.99% critical service uptime"
          ],
          diagram: "Upstream Request ➔ Circuit Breaker (CLOSED) ➔ Fast Fallback Cache ➔ Telemetry Alert"
        },
        {
          title: "Security Hardening & Enterprise Governance",
          subtitle: "Zero-Trust authentication, automated secrets rotation, and auditability",
          bullets: [
            "mTLS certificate injection via service mesh sidecars with 24-hour expiry",
            "Role-Based Access Control (RBAC) integrated with enterprise Identity Providers",
            "Static and dynamic vulnerability scanning in continuous delivery pipelines"
          ],
          diagram: "Identity Provider ➔ JWT Assertion ➔ OIDC Policy Enforcer ➔ Protected Microservice"
        },
        {
          title: "Implementation Roadmap & Key Takeaways",
          subtitle: "Operational checklist for organizational capacity rollout",
          bullets: [
            "Phase 1: Foundation containerization & telemetry observability baseline",
            "Phase 2: Automated chaos drills, circuit breakers, and canary deployments",
            "Phase 3: Formal benchmark assessment and internal certification mastery"
          ],
          diagram: "Design Spec ➔ Sandbox Prototype ➔ Directorate Benchmark ➔ Enterprise Production"
        }
      ];

      const currentSlide = slides[this.currentSlideIndex] || slides[0];

      body.innerHTML = `
        <div class="slide-player-container">
          <div class="slide-glow-circle"></div>
          
          <div class="slide-header-bar">
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-primary">${res.subject}</span>
              <span style="font-size:0.8rem; color:#94A3B8;">Trainer: ${res.trainerName}</span>
            </div>
            <div class="slide-counter-badge">
              Slide ${this.currentSlideIndex + 1} of ${slides.length}
            </div>
          </div>

          <div class="slide-content-pane">
            <h3 style="margin-bottom:6px;">${currentSlide.title}</h3>
            <p style="color:#94A3B8; font-size:0.9rem; margin-bottom:20px;">${currentSlide.subtitle}</p>

            <div style="background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:var(--radius-md); padding:16px 20px; margin-bottom:20px; font-family:var(--font-mono); font-size:0.85rem; color:#60A5FA; display:flex; align-items:center; gap:10px;">
              <i data-lucide="git-commit" style="width:18px; height:18px; flex-shrink:0;"></i>
              <span>${currentSlide.diagram}</span>
            </div>

            <ul class="slide-bullets-list">
              ${currentSlide.bullets.map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>

          <div class="slide-controls-footer">
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sm btn-outline" style="color:#fff; border-color:rgba(255,255,255,0.25);" id="btn-slide-prev" ${this.currentSlideIndex === 0 ? 'disabled' : ''}>
                <i data-lucide="chevron-left"></i> Previous Slide
              </button>
              <button class="btn btn-sm btn-primary" id="btn-slide-next" ${this.currentSlideIndex === slides.length - 1 ? 'disabled' : ''}>
                Next Slide <i data-lucide="chevron-right"></i>
              </button>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
              <span style="font-size:0.75rem; color:#94A3B8;">Deck size: ${res.fileSize || '18 MB'}</span>
              <button class="btn btn-sm btn-outline" style="color:#fff; border-color:rgba(255,255,255,0.25);" onclick="App.showToast('Download Started', 'Downloading presentation slides (.PDF)...', 'success')">
                <i data-lucide="download"></i> Download Deck
              </button>
            </div>
          </div>
        </div>
      `;

      // Attach slide navigation listeners
      const prevBtn = document.getElementById('btn-slide-prev');
      const nextBtn = document.getElementById('btn-slide-next');
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
            this.renderResourceContent();
          }
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (this.currentSlideIndex < slides.length - 1) {
            this.currentSlideIndex++;
            this.renderResourceContent();
          }
        });
      }

    } else if (res.type === 'video') {
      body.innerHTML = `
        <div style="background:#0F172A; border-radius:var(--radius-lg); overflow:hidden; aspect-ratio:16/9; display:flex; flex-direction:column; justify-content:space-between; padding:24px; position:relative; box-shadow:var(--shadow-xl); border:1px solid #1E293B;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="badge badge-primary">${res.subject} Video Masterclass</span>
            <span style="color:#94A3B8; font-size:0.8rem;"><i data-lucide="clock" style="width:14px; height:14px; display:inline;"></i> ${res.duration || '45 mins'}</span>
          </div>

          <div style="text-align:center; color:#fff; cursor:pointer;" id="video-canvas-toggle">
            <div style="width:68px; height:68px; border-radius:50%; background:${this.isVideoPlaying ? '#10B981' : 'var(--brand-accent)'}; display:flex; align-items:center; justify-content:center; margin:0 auto 12px auto; box-shadow:0 0 24px rgba(37,99,235,0.5); transition:all 0.2s ease;">
              <i data-lucide="${this.isVideoPlaying ? 'pause' : 'play'}" style="width:32px; height:32px; color:#fff; ${!this.isVideoPlaying ? 'margin-left:3px;' : ''}"></i>
            </div>
            <h3 style="color:#fff; font-size:1.25rem;">${res.title}</h3>
            <p style="color:#94A3B8; font-size:0.85rem; margin-top:4px;">Lead Instructor: ${res.trainerName}</p>
            ${this.isVideoPlaying ? '<span class="badge badge-success" style="margin-top:6px; animation:pulse 2s infinite;">Live Simulated Stream Active</span>' : ''}
          </div>

          <!-- Video Playback Scrubber Bar -->
          <div style="background:rgba(255,255,255,0.1); border-radius:var(--radius-full); height:6px; overflow:hidden; position:relative;">
            <div style="width:${this.isVideoPlaying ? '48%' : '15%'}; height:100%; background:var(--brand-accent); transition:width 1s ease;"></div>
          </div>
        </div>

        <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-sm btn-primary" id="btn-toggle-video">
              <i data-lucide="${this.isVideoPlaying ? 'pause' : 'play'}"></i> ${this.isVideoPlaying ? 'Pause Stream' : 'Play Lecture'}
            </button>
            <span style="font-size:0.85rem; color:var(--text-muted);">${this.isVideoPlaying ? '14:20 / 45:00' : '00:00 / 45:00'}</span>
          </div>

          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-outline" onclick="App.showToast('Speed Set', 'Playback speed set to 1.0x', 'info')">1.0x</button>
            <button class="btn btn-sm btn-outline" onclick="App.showToast('Speed Set', 'Playback speed set to 1.25x', 'info')">1.25x</button>
            <button class="btn btn-sm btn-outline" onclick="App.showToast('Speed Set', 'Playback speed set to 1.5x', 'info')">1.5x</button>
            <button class="btn btn-sm btn-primary" onclick="App.showToast('Offline Mode', 'Lecture cached for offline viewing.', 'success')">
              <i data-lucide="download"></i> Save Offline
            </button>
          </div>
        </div>

        <!-- Lecture Chapter Jumps -->
        <div style="margin-top:16px; background:var(--bg-surface-alt); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
          <h5 style="margin-bottom:8px;">Chapter Timestamps & Executive Syllabus</h5>
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; font-size:0.825rem; padding:6px 8px; border-radius:var(--radius-xs); background:var(--bg-surface); cursor:pointer;" onclick="App.showToast('Chapter Jump', 'Jumped to 00:00 - Introduction & Foundations', 'info')">
              <span><strong>00:00</strong> Introduction & Organizational Objectives</span>
              <span class="badge badge-info">Chapter 1</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.825rem; padding:6px 8px; border-radius:var(--radius-xs); background:var(--bg-surface); cursor:pointer;" onclick="App.showToast('Chapter Jump', 'Jumped to 12:40 - Architectural Patterns', 'info')">
              <span><strong>12:40</strong> System Topology & Resilient Design</span>
              <span class="badge badge-info">Chapter 2</span>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:0.825rem; padding:6px 8px; border-radius:var(--radius-xs); background:var(--bg-surface); cursor:pointer;" onclick="App.showToast('Chapter Jump', 'Jumped to 28:15 - Security Hardening & Zero-Trust', 'info')">
              <span><strong>28:15</strong> Security Protocols, Audits & Production Deployments</span>
              <span class="badge badge-info">Chapter 3</span>
            </div>
          </div>
        </div>
      `;

      const playToggle = document.getElementById('btn-toggle-video');
      const canvasToggle = document.getElementById('video-canvas-toggle');
      const toggleFn = () => {
        this.isVideoPlaying = !this.isVideoPlaying;
        this.renderResourceContent();
      };
      if (playToggle) playToggle.addEventListener('click', toggleFn);
      if (canvasToggle) canvasToggle.addEventListener('click', toggleFn);

    } else {
      // Document Study Guide Reader
      body.innerHTML = `
        <div style="background:var(--bg-surface-alt); border-radius:var(--radius-md); padding:28px 24px; border:1px solid var(--border-color);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
            <div>
              <span class="badge badge-primary">${res.subject}</span>
              <h3 style="margin-top:6px;">${res.title}</h3>
              <p style="color:var(--text-secondary); font-size:0.875rem;">Accredited study material authored by ${res.trainerName}</p>
            </div>
            <button class="btn btn-primary" onclick="App.showToast('Download Complete', 'Study Guide downloaded as verified PDF.', 'success')">
              <i data-lucide="download"></i> Download PDF (${res.fileSize || '8 MB'})
            </button>
          </div>

          <div style="background:var(--bg-surface); padding:20px; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:16px;">
            <h4 style="margin-bottom:8px;">Executive Summary & Study Guide Outline</h4>
            <p style="color:var(--text-secondary); font-size:0.9rem; line-height:1.6; margin-bottom:16px;">
              ${res.description}
            </p>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.85rem;">
              <div style="padding:10px; background:var(--bg-surface-alt); border-radius:var(--radius-xs);">
                <strong>Section 1:</strong> Foundational Terminology & Standard Operating Framework
              </div>
              <div style="padding:10px; background:var(--bg-surface-alt); border-radius:var(--radius-xs);">
                <strong>Section 2:</strong> Implementation Checklists & Reference Topologies
              </div>
              <div style="padding:10px; background:var(--bg-surface-alt); border-radius:var(--radius-xs);">
                <strong>Section 3:</strong> Failure Modes, Recovery Protocols & Runbooks
              </div>
              <div style="padding:10px; background:var(--bg-surface-alt); border-radius:var(--radius-xs);">
                <strong>Section 4:</strong> Assessment Preparation & Examination Rubric
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; color:var(--text-muted);">
            <span>Format: ${res.format || 'PDF Document'} | Verified: ISO/IEC 27001</span>
            <span>Total Pages: 48 Pages | Published: ${res.uploadDate}</span>
          </div>
        </div>
      `;
    }

    if (window.lucide) window.lucide.createIcons();
  },

  openFeedbackModal(courseId) {
    const course = store.getCourseById(courseId);
    if (!course) return;

    const modal = document.getElementById('modal-feedback');
    const courseNameEl = document.getElementById('feedback-course-name');
    const courseIdInput = document.getElementById('feedback-course-id');

    if (modal && courseNameEl && courseIdInput) {
      courseNameEl.textContent = course.title;
      courseIdInput.value = course.id;
      modal.classList.add('active');
    }
  },

  openCourseDetailModal(courseId) {
    const course = store.getCourseById(courseId);
    if (!course) return;

    const modal = document.getElementById('modal-course-detail');
    const body = document.getElementById('course-detail-body');

    if (!modal || !body) return;

    const feedbacks = store.getFeedbackForCourse(courseId);

    body.innerHTML = `
      <div style="margin-bottom:16px;">
        <span class="badge badge-primary">${course.subject}</span>
        <h2 style="margin: 8px 0 4px 0;">${course.title}</h2>
        <p style="color:var(--text-muted); font-size:0.9rem;">Instructor: ${course.trainerName} | Duration: ${course.duration} | Level: ${course.level}</p>
      </div>
      <p style="margin-bottom:20px;">${course.description}</p>
      
      <div style="background:var(--bg-surface-alt); padding:16px; border-radius:var(--radius-md); margin-bottom:24px; border:1px solid var(--border-color);">
        <h4 style="margin-bottom:8px;">Prerequisites</h4>
        <p style="font-size:0.875rem;">${course.prerequisites || 'None specified.'}</p>
      </div>

      <h4 style="margin-bottom:12px;">Course Syllabus & Modules</h4>
      <div class="timeline-list" style="margin-bottom:24px;">
        ${(course.syllabus || []).map(s => `
          <div class="timeline-item">
            <div class="timeline-title">Week ${s.week}: ${s.title}</div>
          </div>
        `).join('')}
      </div>

      <h4 style="margin-bottom:12px;">Participant Reviews & Feedback (${feedbacks.length})</h4>
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${feedbacks.length === 0 ? '<p class="form-hint">No reviews submitted yet. Be the first to review!</p>' : ''}
        ${feedbacks.map(f => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm);">
            <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
              <span style="font-weight:600; font-size:0.875rem;">${f.traineeName}</span>
              <span style="color:#F59E0B;">★ ${f.rating}/5</span>
            </div>
            <p style="font-size:0.825rem; color:var(--text-secondary);">${f.comment}</p>
          </div>
        `).join('')}
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  activeCourseId: null,
  activeModuleIndex: 0,
  revealedFlashcards: new Set(),

  openCoursePlayer(courseId, moduleIndex = 0) {
    const user = store.getCurrentUser();
    if (!user) {
      App.showToast("Sign In Required", "Please sign in as Trainee to access course classroom.", "warning");
      App.openLoginModal();
      return;
    }

    // Auto-enroll if not yet enrolled
    let enr = store.getEnrollment(courseId, user.id);
    if (!enr) {
      const res = store.enrollInCourse(courseId, user.id);
      enr = res.enrollment;
    }

    const course = store.getCourseById(courseId);
    if (!course) return;

    this.activeCourseId = courseId;
    this.activeModuleIndex = moduleIndex;
    this.revealedFlashcards = new Set();

    const modal = document.getElementById('modal-course-player');
    const subjEl = document.getElementById('player-course-subject');
    const titleEl = document.getElementById('player-course-title');

    if (subjEl) subjEl.textContent = course.subject;
    if (titleEl) titleEl.textContent = course.title;

    this.renderCoursePlayerContent();
    if (modal) modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  renderCoursePlayerContent() {
    const user = store.getCurrentUser();
    const course = store.getCourseById(this.activeCourseId);
    if (!user || !course) return;

    const enr = store.getEnrollment(course.id, user.id) || { progress: 0, completedModules: [] };
    const syllabus = course.syllabus || [];
    const currentModule = syllabus[this.activeModuleIndex] || syllabus[0] || { week: 1, title: "Course Introduction" };
    const isCompleted = (enr.completedModules || []).includes(this.activeModuleIndex);
    const relatedAssessment = store.getAssessments().find(a => a.courseId === course.id || a.subject === course.subject);

    const body = document.getElementById('player-classroom-body');
    if (!body) return;

    const keyTakeaways = [
      `Architectural isolation ensuring faults do not cascade across service boundaries`,
      `Zero-Trust cryptographic authentication between service mesh sidecars`,
      `Continuous benchmark telemetry monitoring against organizational KPIs`
    ];

    body.innerHTML = `
      <div class="classroom-layout">
        <!-- Sidebar Syllabus Navigation -->
        <div class="classroom-sidebar">
          <div style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; margin-bottom:6px;">
              <span>Overall Track Progress</span>
              <span style="color:var(--brand-accent);">${enr.progress}%</span>
            </div>
            <div class="progress-container">
              <div class="progress-bar" style="width: ${enr.progress}%;"></div>
            </div>
          </div>

          <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:var(--text-muted); margin-top:8px;">
            Curriculum Modules (${syllabus.length})
          </div>

          <div class="classroom-syllabus-list">
            ${syllabus.map((mod, idx) => {
              const modDone = (enr.completedModules || []).includes(idx);
              const isActive = idx === this.activeModuleIndex;
              return `
                <button type="button" class="classroom-module-btn ${isActive ? 'active' : ''} ${modDone ? 'completed' : ''}" onclick="TraineeView.switchPlayerModule(${idx})">
                  <div class="module-check-icon">
                    <i data-lucide="${modDone ? 'check' : 'circle'}" style="width:14px; height:14px;"></i>
                  </div>
                  <div>
                    <div style="font-size:0.75rem; color:var(--text-muted);">Week ${mod.week}</div>
                    <div style="font-size:0.85rem; font-weight:600; line-height:1.2;">${mod.title}</div>
                  </div>
                </button>
              `;
            }).join('')}
          </div>

          ${relatedAssessment ? `
            <div style="margin-top:auto; padding-top:16px; border-top:1px solid var(--border-color);">
              <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:6px;">Final Benchmark</div>
              <button class="btn btn-sm btn-outline w-full" onclick="App.closeAllModals(); AssessmentView.startAssessment('${relatedAssessment.id}')">
                <i data-lucide="award"></i> Take Benchmark Test
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Main Lesson Content Pane -->
        <div class="classroom-main">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
            <div>
              <span class="badge badge-info" style="margin-bottom:6px;">Week ${currentModule.week} Module</span>
              <h2 style="font-size:1.4rem; margin:0 0 4px 0;">${currentModule.title}</h2>
              <div style="font-size:0.8rem; color:var(--text-muted);">
                <span>Instructor: ${course.trainerName}</span> • <span>Est. Study Time: 45 Mins</span> • 
                <span class="badge ${isCompleted ? 'badge-success' : 'badge-warning'}" style="font-size:0.7rem;">
                  ${isCompleted ? 'Module Completed' : 'In Progress'}
                </span>
              </div>
            </div>
            <div>
              ${isCompleted ? `
                <span class="badge badge-success" style="padding:6px 12px; font-size:0.85rem;">
                  <i data-lucide="check-circle" style="width:16px; height:16px; display:inline;"></i> Completed
                </span>
              ` : `
                <button class="btn btn-sm btn-primary" onclick="TraineeView.markCurrentModuleComplete()">
                  <i data-lucide="check"></i> Mark Complete & Proceed
                </button>
              `}
            </div>
          </div>

          <!-- Video Stream Lecture Simulation -->
          <div style="background:#0F172A; border-radius:var(--radius-md); padding:20px; color:#fff; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-md);">
            <div style="display:flex; align-items:center; gap:16px;">
              <div style="width:48px; height:48px; border-radius:50%; background:var(--brand-accent); display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="App.showToast('Lecture Stream', 'Playing recorded audio lecture...', 'info')">
                <i data-lucide="play" style="width:24px; height:24px; color:#fff; margin-left:2px;"></i>
              </div>
              <div>
                <div style="font-weight:700; font-size:0.95rem; color:#fff;">Interactive Audio/Video Lecture: ${currentModule.title}</div>
                <div style="font-size:0.8rem; color:#94A3B8;">35 mins • High-Definition Stream with Subtitles</div>
              </div>
            </div>
            <button class="btn btn-sm btn-outline" style="color:#fff; border-color:rgba(255,255,255,0.25);" onclick="App.showToast('Lecture Notes', 'Module study notes downloaded.', 'success')">
              <i data-lucide="file-text"></i> Lesson Notes
            </button>
          </div>

          <!-- Executive Learning Takeaways -->
          <h4 style="margin-bottom:10px;">Executive Conceptual Takeaways</h4>
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:20px;">
            ${keyTakeaways.map(t => `
              <div style="display:flex; align-items:flex-start; gap:10px; font-size:0.875rem; background:var(--bg-surface-alt); padding:10px 14px; border-radius:var(--radius-sm);">
                <i data-lucide="check-circle-2" style="color:var(--color-success); width:18px; height:18px; flex-shrink:0; margin-top:2px;"></i>
                <span>${t}</span>
              </div>
            `).join('')}
          </div>

          <!-- Active Recall Flashcard Drill -->
          <div class="classroom-flashcard" onclick="TraineeView.toggleFlashcard('card-${this.activeModuleIndex}')">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="badge badge-primary"><i data-lucide="sparkles" style="width:12px; height:12px; display:inline;"></i> Active Recall Concept Drill</span>
              <span style="font-size:0.75rem; color:var(--brand-accent); font-weight:600;">Click to Reveal / Flip</span>
            </div>
            <div style="font-weight:600; font-size:0.95rem; margin-bottom:6px;">
              Question: What is the primary operational metric evaluated when testing fault-tolerance in ${currentModule.title}?
            </div>
            <div id="flashcard-answer-card-${this.activeModuleIndex}" style="display:${this.revealedFlashcards.has('card-' + this.activeModuleIndex) ? 'block' : 'none'}; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-color); color:var(--color-success); font-weight:600; font-size:0.875rem;">
              <i data-lucide="check" style="width:14px; height:14px; display:inline;"></i> Answer: Recovery Point Objective (RPO) and Recovery Time Objective (RTO) under automated chaos failure injection.
            </div>
          </div>

          <!-- Hands-on Lab Briefing -->
          <div class="classroom-lab-task">
            <h5 style="margin-bottom:4px; display:flex; align-items:center; gap:6px;">
              <i data-lucide="terminal" style="width:16px; height:16px;"></i> Hands-On Laboratory Exercise
            </h5>
            <p style="font-size:0.825rem; color:var(--text-secondary); margin:0 0 10px 0;">
              Configure a 3-node cluster simulation using the provided configuration templates and verify automatic failover within 500ms.
            </p>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-xs btn-outline" onclick="App.showToast('Lab Environment', 'Launching ephemeral sandbox terminal...', 'info')">
                <i data-lucide="play"></i> Launch Web Terminal
              </button>
              <button class="btn btn-xs btn-outline" onclick="App.showToast('Code Snippets', 'Starter config files copied to clipboard.', 'success')">
                <i data-lucide="copy"></i> Copy Lab Templates
              </button>
            </div>
          </div>

          <!-- Bottom Lesson Navigation Buttons -->
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:16px; border-top:1px solid var(--border-color);">
            <button class="btn btn-outline btn-sm" id="btn-player-prev-mod" ${this.activeModuleIndex === 0 ? 'disabled' : ''} onclick="TraineeView.switchPlayerModule(${this.activeModuleIndex - 1})">
              <i data-lucide="arrow-left"></i> Previous Module
            </button>

            <div style="display:flex; gap:8px;">
              ${!isCompleted ? `
                <button class="btn btn-primary btn-sm" onclick="TraineeView.markCurrentModuleComplete()">
                  <i data-lucide="check"></i> Mark Complete & Next
                </button>
              ` : (this.activeModuleIndex < syllabus.length - 1 ? `
                <button class="btn btn-primary btn-sm" onclick="TraineeView.switchPlayerModule(${this.activeModuleIndex + 1})">
                  Next Module <i data-lucide="arrow-right"></i>
                </button>
              ` : `
                <button class="btn btn-success btn-sm" onclick="App.closeAllModals(); AssessmentView.startAssessment('${relatedAssessment ? relatedAssessment.id : 'asm-01'}')">
                  <i data-lucide="award"></i> Take Final Certification Exam
                </button>
              `)}
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  switchPlayerModule(idx) {
    this.activeModuleIndex = idx;
    this.renderCoursePlayerContent();
  },

  toggleFlashcard(cardId) {
    if (this.revealedFlashcards.has(cardId)) {
      this.revealedFlashcards.delete(cardId);
    } else {
      this.revealedFlashcards.add(cardId);
    }
    const el = document.getElementById('flashcard-answer-' + cardId);
    if (el) {
      el.style.display = this.revealedFlashcards.has(cardId) ? 'block' : 'none';
      if (window.lucide) window.lucide.createIcons();
    }
  },

  markCurrentModuleComplete() {
    const user = store.getCurrentUser();
    const course = store.getCourseById(this.activeCourseId);
    if (!user || !course) return;

    const syllabus = course.syllabus || [];
    const enr = store.getEnrollment(course.id, user.id);
    const completedSet = new Set(enr ? enr.completedModules || [] : []);
    completedSet.add(this.activeModuleIndex);

    const newProgress = Math.round((completedSet.size / syllabus.length) * 100);
    store.updateEnrollmentProgress(course.id, user.id, newProgress, this.activeModuleIndex);

    App.showToast("Module Completed!", `Week ${this.activeModuleIndex + 1} marked as complete. Progress: ${newProgress}%`, "success");

    if (newProgress >= 100 && window.confetti) {
      window.confetti({ particleCount: 100, spread: 60 });
      App.showToast("Course Curriculum Finished!", "All modules mastered! Take the benchmark assessment to earn your accredited certificate.", "success");
    }

    if (this.activeModuleIndex < syllabus.length - 1) {
      this.activeModuleIndex++;
    }
    this.renderCoursePlayerContent();
    this.render();
  }
};
