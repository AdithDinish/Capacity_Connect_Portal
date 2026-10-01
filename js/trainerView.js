/**
 * CAPACITY CONNECT - TRAINER PORTAL CONTROLLER
 * Questionnaires creation with deadlines, trainee performance monitoring,
 * and Trainer Library resource uploads (lectures, presentations, study materials).
 */

const TrainerView = {
  activeTab: 'monitoring',

  init() {
    // Trainer controller ready
  },

  render() {
    const user = store.getCurrentUser();
    if (!user || user.role !== 'trainer') {
      return;
    }

    const container = document.getElementById('trainer-portal-view');
    if (!container) return;

    const myAttempts = store.getAttemptsForTrainer(user.id);
    const myResources = store.getResources().filter(r => r.trainerId === user.id);
    const myCourses = store.getCourses().filter(c => c.trainerId === user.id);

    container.innerHTML = `
      <div class="container">
        <!-- Trainer Banner -->
        <div class="dashboard-banner">
          <div class="user-banner-profile">
            <div class="user-banner-avatar" style="background:var(--role-trainer-bg); color:var(--role-trainer);">
              ${user.avatar || user.name.slice(0, 2).toUpperCase()}
            </div>
            <div class="user-banner-info">
              <h2>${user.name}</h2>
              <div class="user-banner-meta">
                <span class="badge badge-trainer"><i data-lucide="award"></i> Certified Trainer</span>
                <span><i data-lucide="briefcase"></i> ${user.department || 'Training Faculty'}</span>
                <span><i data-lucide="star" style="color:#F59E0B;"></i> ${user.rating || '4.9'} Rating (${user.studentsTaught || 320}+ Students)</span>
              </div>
            </div>
          </div>
          <div class="dashboard-banner-actions">
            <button class="btn btn-outline" id="btn-open-upload-resource">
              <i data-lucide="upload-cloud"></i> Upload Resource
            </button>
            <button class="btn btn-primary" id="btn-open-create-assessment">
              <i data-lucide="plus-circle"></i> Create Questionnaire
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="metrics-grid">
          <div class="metric-card">
            <div>
              <div class="metric-label">Active Courses</div>
              <div class="metric-value">${myCourses.length}</div>
              <div class="metric-change positive"><i data-lucide="trending-up"></i> High engagement</div>
            </div>
            <div class="metric-icon-box" style="background:#EFF6FF; color:#2563EB;">
              <i data-lucide="book-open"></i>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-label">Assessment Submissions</div>
              <div class="metric-value">${myAttempts.length}</div>
              <div class="metric-change positive"><i data-lucide="check"></i> 100% evaluated</div>
            </div>
            <div class="metric-icon-box" style="background:#ECFDF5; color:#059669;">
              <i data-lucide="file-check"></i>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-label">Library Assets Uploaded</div>
              <div class="metric-value">${myResources.length}</div>
              <div class="metric-change positive"><i data-lucide="download"></i> ${myResources.reduce((a, c) => a + (c.downloads || 0), 0)} downloads</div>
            </div>
            <div class="metric-icon-box" style="background:#FEF3C7; color:#D97706;">
              <i data-lucide="folder"></i>
            </div>
          </div>

          <div class="metric-card">
            <div>
              <div class="metric-label">Average Trainee Score</div>
              <div class="metric-value">
                ${myAttempts.length > 0 ? Math.round(myAttempts.reduce((a, c) => a + c.score, 0) / myAttempts.length) : 85}%
              </div>
              <div class="metric-change positive"><i data-lucide="award"></i> Above benchmark</div>
            </div>
            <div class="metric-icon-box" style="background:#F5F3FF; color:#7C3AED;">
              <i data-lucide="pie-chart"></i>
            </div>
          </div>
        </div>

        <!-- Trainer Navigation Tabs -->
        <div class="tabs-nav" id="trainer-tabs">
          <button class="tab-btn ${this.activeTab === 'monitoring' ? 'active' : ''}" data-trainer-tab="monitoring">
            <i data-lucide="users"></i> Trainee Participation & Performance
          </button>
          <button class="tab-btn ${this.activeTab === 'library' ? 'active' : ''}" data-trainer-tab="library">
            <i data-lucide="archive"></i> Trainer Library Management (${myResources.length})
          </button>
          <button class="tab-btn ${this.activeTab === 'questionnaires' ? 'active' : ''}" data-trainer-tab="questionnaires">
            <i data-lucide="help-circle"></i> Questionnaires & Deadlines
          </button>
          <button class="tab-btn ${this.activeTab === 'profile' ? 'active' : ''}" data-trainer-tab="profile">
            <i data-lucide="shield"></i> Competencies & Bio
          </button>
        </div>

        <!-- Tab Content -->
        <div id="trainer-tab-content">
          ${this.renderActiveTabContent(user, myAttempts, myResources, myCourses)}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindTabEvents(user);
  },

  renderActiveTabContent(user, attempts, resources, courses) {
    switch (this.activeTab) {
      case 'monitoring':
        return this.renderMonitoringTab(attempts);
      case 'library':
        return this.renderLibraryTab(resources);
      case 'questionnaires':
        return this.renderQuestionnairesTab(user);
      case 'profile':
        return this.renderProfileTab(user);
      default:
        return this.renderMonitoringTab(attempts);
    }
  },

  // 1. Trainee Monitoring & Performance
  renderMonitoringTab(attempts) {
    return `
      <div class="table-container">
        <div class="table-toolbar">
          <div>
            <h3>Trainee Assessment Submissions & Results</h3>
            <p class="section-subtitle">Real-time performance metrics and passing records for your courses</p>
          </div>
          <div class="table-search-box">
            <i data-lucide="search" class="search-icon"></i>
            <input type="text" class="form-input" id="trainer-trainee-search" placeholder="Search trainee name or subject...">
          </div>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Trainee Name</th>
              <th>Assessment Subject</th>
              <th>Score</th>
              <th>Result Status</th>
              <th>Time Taken</th>
              <th>Submitted Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody id="trainer-attempts-tbody">
            ${attempts.length === 0 ? `
              <tr>
                <td colspan="7" style="text-align:center; padding:32px; color:var(--text-muted);">
                  No trainee attempts recorded yet.
                </td>
              </tr>
            ` : attempts.map(att => `
              <tr>
                <td>
                  <div class="table-user-cell">
                    <div class="table-avatar">${att.traineeName.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <div style="font-weight:600;">${att.traineeName}</div>
                      <div style="font-size:0.75rem; color:var(--text-muted);">${att.traineeId}</div>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-primary">${att.subject}</span></td>
                <td>
                  <strong style="font-size:1.05rem; color:${att.passed ? 'var(--color-success)' : 'var(--color-danger)'};">
                    ${att.score}%
                  </strong>
                </td>
                <td>
                  <span class="badge ${att.passed ? 'badge-success' : 'badge-danger'}">
                    ${att.passed ? 'Passed' : 'Needs Review'}
                  </span>
                </td>
                <td>${att.timeTakenMinutes || 10} mins</td>
                <td>${att.submittedAt}</td>
                <td>
                  <button class="btn btn-sm btn-outline" onclick="TrainerView.openAttemptDetailModal('${att.id}')">
                    <i data-lucide="eye"></i> Details
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // 2. Trainer Library Management
  renderLibraryTab(resources) {
    return `
      <div>
        <div class="section-header">
          <div>
            <h3>Your Uploaded Learning Assets</h3>
            <p class="section-subtitle">Lectures, presentations, and study guides available to all enrolled trainees</p>
          </div>
          <button class="btn btn-primary" onclick="TrainerView.openUploadModal()">
            <i data-lucide="plus"></i> Upload New Resource
          </button>
        </div>

        <div class="grid grid-cols-2 gap-md" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          ${resources.length === 0 ? '<p class="form-hint">No resources uploaded yet.</p>' : ''}
          ${resources.map(res => `
            <div class="resource-card">
              <div class="resource-icon ${res.type}">
                <i data-lucide="${res.type === 'video' ? 'video' : (res.type === 'presentation' ? 'presentation' : 'file-text')}"></i>
              </div>
              <div class="resource-details">
                <div style="display:flex; justify-content:space-between;">
                  <span class="badge badge-info" style="font-size:0.675rem;">${res.subject}</span>
                  <span style="font-size:0.75rem; color:var(--text-muted);">${res.fileSize}</span>
                </div>
                <div class="resource-title" style="margin-top:6px;">${res.title}</div>
                <p style="font-size:0.8rem; margin:4px 0 8px 0; color:var(--text-secondary);">${res.description}</p>
                <div class="resource-meta">
                  <span>Uploaded: ${res.uploadDate}</span>
                  <span><i data-lucide="download"></i> ${res.downloads || 0} downloads</span>
                </div>
                <div style="margin-top:10px; display:flex; gap:8px;">
                  <button class="btn btn-sm btn-outline" onclick="TraineeView.openResourceViewer('${res.id}')">
                    <i data-lucide="eye"></i> Preview
                  </button>
                  <button class="btn btn-sm btn-ghost" style="color:var(--color-danger);" onclick="TrainerView.deleteResource('${res.id}')">
                    <i data-lucide="trash-2"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 3. Questionnaires & Assessment Deadlines
  renderQuestionnairesTab(user) {
    const assessments = store.getAssessments().filter(a => a.trainerId === user.id);

    return `
      <div>
        <div class="section-header">
          <div>
            <h3>Assessment Questionnaires with Deadlines</h3>
            <p class="section-subtitle">Manage subject MCQs, time durations, and submission cut-offs</p>
          </div>
          <button class="btn btn-primary" onclick="TrainerView.openCreateAssessmentModal()">
            <i data-lucide="plus"></i> New Questionnaire
          </button>
        </div>

        <div class="grid grid-cols-2 gap-lg" style="grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));">
          ${assessments.length === 0 ? '<p class="form-hint">No questionnaires authored yet.</p>' : ''}
          ${assessments.map(asm => `
            <div class="card">
              <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span class="badge badge-primary">${asm.subject}</span>
                <span style="font-size:0.775rem; color:var(--text-muted);"><i data-lucide="clock"></i> ${asm.timeLimitMinutes} Mins</span>
              </div>
              <h4 style="margin-bottom:6px;">${asm.title}</h4>
              <p style="font-size:0.825rem; margin-bottom:12px;">${asm.description}</p>
              
              <div style="background:var(--bg-surface-alt); padding:10px; border-radius:var(--radius-sm); margin-bottom:14px; font-size:0.8rem;">
                <div><strong>Submission Deadline:</strong> <span style="color:var(--color-danger); font-weight:600;">${asm.deadline}</span></div>
                <div><strong>Passing Benchmark:</strong> ${asm.passingScore}%</div>
                <div><strong>Total Submissions:</strong> ${asm.totalAttempts || 0} attempts (Avg: ${asm.avgScore || 0}%)</div>
                <div><strong>Questions Included:</strong> ${asm.questions ? asm.questions.length : 0} items</div>
              </div>

              <div style="display:flex; gap:8px;">
                <button class="btn btn-sm btn-outline w-full" onclick="TrainerView.openQuestionnaireReviewModal('${asm.id}')">
                  <i data-lucide="list"></i> Review Questions
                </button>
                <button class="btn btn-sm btn-primary w-full" onclick="AssessmentView.startAssessment('${asm.id}')">
                  <i data-lucide="play"></i> Test Exam
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 4. Trainer Profile & Competencies
  renderProfileTab(user) {
    const competencies = user.competencies || [];

    return `
      <div class="profile-grid">
        <div class="card">
          <h3>Trainer Information</h3>
          <p style="margin: 8px 0 16px 0;">${user.bio}</p>
          <div style="font-size:0.85rem; color:var(--text-muted); display:flex; flex-direction:column; gap:6px;">
            <div><strong>Department:</strong> ${user.department}</div>
            <div><strong>Email:</strong> ${user.email}</div>
            <div><strong>Total Trainees Coached:</strong> ${user.studentsTaught || 320}+</div>
            <div><strong>Student Rating:</strong> ★ ${user.rating || '4.9'} / 5.0</div>
          </div>
        </div>

        <div class="card">
          <div class="profile-card-header">
            <div>
              <h3>Domain Competencies & Proficiency</h3>
              <p class="section-subtitle">Used by Admin Competency Mapping engine for subject matching</p>
            </div>
          </div>

          <div style="display:flex; flex-direction:column; gap:16px;">
            ${competencies.map(c => `
              <div style="border-bottom:1px solid var(--border-color-subtle); padding-bottom:12px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <strong style="font-size:0.95rem;">${c.subject}</strong>
                  <span style="font-size:0.85rem; font-weight:700; color:var(--brand-accent);">
                    Proficiency: Level ${c.proficiency} / 5
                  </span>
                </div>
                <div class="progress-container">
                  <div class="progress-bar" style="width:${(c.proficiency / 5) * 100}%;"></div>
                </div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">
                  Status: ${c.certified ? 'Verified & Certified Subject Matter Specialist' : 'Standard Faculty Assessment'}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bindTabEvents(user) {
    document.querySelectorAll('[data-trainer-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tab = e.currentTarget.getAttribute('data-trainer-tab');
        this.activeTab = tab;
        this.render();
      });
    });

    const createAsmBtn = document.getElementById('btn-open-create-assessment');
    if (createAsmBtn) createAsmBtn.addEventListener('click', () => this.openCreateAssessmentModal());

    const uploadResBtn = document.getElementById('btn-open-upload-resource');
    if (uploadResBtn) uploadResBtn.addEventListener('click', () => this.openUploadModal());

    // Search input in monitoring table
    const searchInput = document.getElementById('trainer-trainee-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('#trainer-attempts-tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }
  },

  openUploadModal() {
    const modal = document.getElementById('modal-upload-resource');
    if (modal) modal.classList.add('active');
  },

  builderQuestions: [
    {
      question: "How is continuous high-availability ensured in distributed cloud services?",
      options: [
        "A) High availability with automated failover and multi-region replication",
        "B) Manual deployment on single workstation without health checks",
        "C) Unencrypted transmission across public networks",
        "D) Static non-scalable message queues"
      ],
      correctIndex: 0,
      explanation: "Ensures robust resilience and continuous service continuity across infrastructure failures."
    },
    {
      question: "What is the primary role of zero-trust mutual authentication in microservices?",
      options: [
        "A) Continuous cryptographic verification of service identities via mTLS",
        "B) Skipping network access audits",
        "C) Sharing hardcoded credentials across pods",
        "D) Disabling ingress firewall filters"
      ],
      correctIndex: 0,
      explanation: "Zero-Trust enforces mutual TLS authentication and continuous policy authorization."
    }
  ],

  openCreateAssessmentModal() {
    const modal = document.getElementById('modal-create-assessment');
    if (!modal) return;

    this.renderBuilderQuestions();

    const addBtn = document.getElementById('btn-add-builder-q');
    if (addBtn && !addBtn.dataset.bound) {
      addBtn.dataset.bound = "true";
      addBtn.addEventListener('click', () => {
        this.addBuilderQuestion();
      });
    }

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  renderBuilderQuestions() {
    const container = document.getElementById('asm-questions-builder-container');
    if (!container) return;

    container.innerHTML = this.builderQuestions.map((q, qIdx) => `
      <div class="question-builder-item">
        <div class="question-builder-header">
          <strong>Question ${qIdx + 1}</strong>
          ${this.builderQuestions.length > 1 ? `
            <button type="button" class="btn btn-xs btn-ghost" style="color:var(--color-danger);" onclick="TrainerView.removeBuilderQuestion(${qIdx})">
              <i data-lucide="trash-2" style="width:14px; height:14px;"></i> Remove
            </button>
          ` : ''}
        </div>
        <div class="form-group" style="margin-bottom:8px;">
          <input type="text" class="form-input builder-q-text" data-q-idx="${qIdx}" value="${q.question}" placeholder="Enter question text..." required>
        </div>
        <div class="options-builder-grid">
          ${q.options.map((opt, optIdx) => `
            <div style="display:flex; align-items:center; gap:8px;">
              <input type="radio" name="builder-correct-${qIdx}" value="${optIdx}" ${q.correctIndex === optIdx ? 'checked' : ''} onchange="TrainerView.builderQuestions[${qIdx}].correctIndex = ${optIdx}">
              <input type="text" class="form-input form-input-sm builder-q-opt" data-q-idx="${qIdx}" data-opt-idx="${optIdx}" value="${opt}" placeholder="Option ${optIdx + 1}" required>
            </div>
          `).join('')}
        </div>
        <div class="form-group" style="margin-bottom:0; margin-top:8px;">
          <label class="form-label" style="font-size:0.75rem;">Trainer Explanation / Key Takeaway</label>
          <input type="text" class="form-input form-input-sm builder-q-exp" data-q-idx="${qIdx}" value="${q.explanation}" placeholder="Explanation revealed during exam review...">
        </div>
      </div>
    `).join('');

    // Bind real-time inputs
    container.querySelectorAll('.builder-q-text').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.qIdx);
        this.builderQuestions[idx].question = e.target.value;
      });
    });
    container.querySelectorAll('.builder-q-opt').forEach(input => {
      input.addEventListener('input', (e) => {
        const qIdx = parseInt(e.target.dataset.qIdx);
        const optIdx = parseInt(e.target.dataset.optIdx);
        this.builderQuestions[qIdx].options[optIdx] = e.target.value;
      });
    });
    container.querySelectorAll('.builder-q-exp').forEach(input => {
      input.addEventListener('input', (e) => {
        const idx = parseInt(e.target.dataset.qIdx);
        this.builderQuestions[idx].explanation = e.target.value;
      });
    });

    if (window.lucide) window.lucide.createIcons();
  },

  addBuilderQuestion() {
    this.builderQuestions.push({
      question: "What is an essential operational best practice for enterprise systems?",
      options: [
        "A) Automated health probes and continuous observability telemetry",
        "B) Ignoring production latency metrics",
        "C) Deploying untracked binaries",
        "D) Disabling backup checkpoints"
      ],
      correctIndex: 0,
      explanation: "Continuous observability enables rapid incident response and high availability."
    });
    this.renderBuilderQuestions();
  },

  removeBuilderQuestion(idx) {
    if (this.builderQuestions.length > 1) {
      this.builderQuestions.splice(idx, 1);
      this.renderBuilderQuestions();
    }
  },

  openQuestionnaireReviewModal(assessmentId) {
    const asm = store.getAssessmentById(assessmentId);
    if (!asm) return;

    const modal = document.getElementById('modal-view-questionnaire');
    const subjEl = document.getElementById('view-q-subject');
    const titleEl = document.getElementById('view-q-title');
    const body = document.getElementById('view-q-body');

    if (!modal || !subjEl || !titleEl || !body) return;

    subjEl.textContent = asm.subject;
    titleEl.textContent = asm.title;

    body.innerHTML = `
      <div style="background:var(--bg-surface-alt); padding:16px; border-radius:var(--radius-md); margin-bottom:20px; border:1px solid var(--border-color); display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div><strong>Time Limit:</strong> ${asm.timeLimitMinutes} Mins</div>
        <div><strong>Passing Benchmark:</strong> ${asm.passingScore}%</div>
        <div><strong>Deadline:</strong> ${asm.deadline}</div>
        <div><strong>Submissions:</strong> ${asm.totalAttempts || 0} attempts</div>
      </div>

      <h4 style="margin-bottom:14px;">Questionnaire Examination Key (${asm.questions ? asm.questions.length : 0} Items)</h4>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${(asm.questions || []).map((q, idx) => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong>Question ${idx + 1}</strong>
              <span class="badge badge-primary">MCQ</span>
            </div>
            <p style="font-weight:600; margin-bottom:12px;">${q.question}</p>
            <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:12px;">
              ${q.options.map((opt, optIdx) => `
                <div style="padding:8px 12px; border-radius:var(--radius-xs); font-size:0.85rem; ${optIdx === q.correctIndex ? 'background:var(--color-success-bg); border:1px solid var(--color-success-border); font-weight:600; color:var(--color-success);' : 'background:var(--bg-surface-alt);'}">
                  ${opt} ${optIdx === q.correctIndex ? '✓ (Correct Answer Key)' : ''}
                </div>
              `).join('')}
            </div>
            <div style="font-size:0.8rem; color:var(--text-secondary); background:var(--bg-surface-alt); padding:8px 12px; border-radius:var(--radius-xs); border-left:3px solid var(--brand-accent);">
              <strong>Pedagogical Explanation:</strong> ${q.explanation}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="modal-footer" style="padding:20px 0 0 0; background:none; border:none; justify-content:flex-end;">
        <button class="btn btn-outline" data-close-modal>Close Key</button>
        <button class="btn btn-primary" onclick="AssessmentView.startAssessment('${asm.id}')"><i data-lucide="play"></i> Test Exam Simulator</button>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  openAttemptDetailModal(attemptId) {
    const attempts = store.getAllAttempts();
    const att = attempts.find(a => a.id === attemptId);
    if (!att) return;

    const modal = document.getElementById('modal-attempt-detail');
    const body = document.getElementById('attempt-detail-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid var(--border-color);">
        <div style="display:flex; align-items:center; gap:12px;">
          <div class="table-avatar" style="width:48px; height:48px; font-size:1.1rem;">
            ${att.traineeName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 style="margin:0;">${att.traineeName}</h3>
            <span style="font-size:0.8rem; color:var(--text-muted);">${att.subject} • Submitted: ${att.submittedAt}</span>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.6rem; font-weight:800; color:${att.passed ? 'var(--color-success)' : 'var(--color-danger)'};">
            ${att.score}%
          </div>
          <span class="badge ${att.passed ? 'badge-success' : 'badge-danger'}">${att.passed ? 'Passed Competency' : 'Needs Review'}</span>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-md" style="margin-bottom:20px;">
        <div style="background:var(--bg-surface-alt); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Duration</div>
          <div style="font-size:1.1rem; font-weight:700;">${att.timeTakenMinutes || 10} Mins</div>
        </div>
        <div style="background:var(--bg-surface-alt); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Mastery Threshold</div>
          <div style="font-size:1.1rem; font-weight:700;">70% Required</div>
        </div>
        <div style="background:var(--bg-surface-alt); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
          <div style="font-size:0.75rem; color:var(--text-muted);">Credential Status</div>
          <div style="font-size:1.1rem; font-weight:700; color:${att.passed ? 'var(--color-success)' : 'var(--text-secondary)'};">
            ${att.passed ? 'Issued' : 'Pending Retake'}
          </div>
        </div>
      </div>

      <div style="background:var(--bg-surface-alt); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-color);">
        <h5 style="margin-bottom:6px;">Trainer Recommendations & Notes</h5>
        <p style="font-size:0.875rem; color:var(--text-secondary); margin:0;">
          ${att.passed
            ? "Trainee demonstrated high domain proficiency and passed with organizational distinction. Recommended for advanced architecture assignments."
            : "Trainee is advised to review the recorded lecture stream and review failure recovery runbooks before retaking the assessment."}
        </p>
      </div>

      <div class="modal-footer" style="padding:20px 0 0 0; background:none; border:none; justify-content:flex-end;">
        <button class="btn btn-outline" data-close-modal>Close</button>
        <button class="btn btn-primary" onclick="App.showToast('Feedback Sent', 'Direct feedback notification transmitted to trainee.', 'success'); App.closeAllModals();">
          <i data-lucide="send"></i> Send Notes to Trainee
        </button>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  },

  deleteResource(resId) {
    if (confirm("Are you sure you want to delete this resource from the Trainer Library?")) {
      store.deleteResource(resId);
      App.showToast("Resource Deleted", "The item was removed from the library.", "info");
      this.render();
    }
  }
};
