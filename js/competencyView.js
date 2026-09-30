/**
 * CAPACITY CONNECT - COMPETENCY MAPPING & TRAINER MATCHING ENGINE
 * Maps organizational subject demands, identifies skill gaps,
 * and provides algorithmic matchmaking for suitable trainers.
 */

const CompetencyView = {
  selectedSubject: 'Cloud Architecture',
  minProficiency: 4,

  init() {
    this.bindEvents();
  },

  render() {
    const container = document.getElementById('competency-view');
    if (!container) return;

    const matrix = store.getCompetencyMatrix();
    const user = store.getCurrentUser();
    const subjects = matrix.map(m => m.subject);

    container.innerHTML = `
      <div class="container">
        <!-- Competency Engine Header -->
        <div class="competency-header">
          <span class="badge badge-info" style="margin-bottom: 8px;">Capacity Framework</span>
          <h2>Organizational Competency Mapping Engine</h2>
          <p>
            Systematically analyze enterprise skill demand, identify strategic trainer coverage gaps, and automatically match qualified subject-matter experts for targeted learning interventions.
          </p>
        </div>

        <!-- Optional: Personal Competency Gap Analysis for Trainees -->
        ${user && user.role === 'trainee' ? this.renderTraineeGapAnalysis(user, matrix) : ''}

        <!-- Interactive Trainer Matchmaker -->
        <div class="matchmaker-card">
          <div style="margin-bottom: 16px;">
            <h3><i data-lucide="sparkles" style="color:var(--brand-accent);"></i> Algorithmic Trainer Matchmaker</h3>
            <p class="section-subtitle">Select a subject requirement to calculate trainer suitability scores based on certified credentials and proficiency.</p>
          </div>

          <div class="matchmaker-controls">
            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Subject / Learning Domain</label>
              <select class="form-select" id="match-subject-select">
                ${subjects.map(s => `
                  <option value="${s}" ${s === this.selectedSubject ? 'selected' : ''}>${s}</option>
                `).join('')}
              </select>
            </div>

            <div class="form-group" style="margin-bottom:0;">
              <label class="form-label">Min. Competency Level</label>
              <select class="form-select" id="match-proficiency-select">
                <option value="3" ${this.minProficiency === 3 ? 'selected' : ''}>Level 3+ (Intermediate)</option>
                <option value="4" ${this.minProficiency === 4 ? 'selected' : ''}>Level 4+ (Advanced)</option>
                <option value="5" ${this.minProficiency === 5 ? 'selected' : ''}>Level 5 (Master / Principal)</option>
              </select>
            </div>

            <button class="btn btn-primary" id="btn-run-matchmaker" style="height: 42px;">
              <i data-lucide="target"></i> Match Suitable Trainers
            </button>
          </div>

          <!-- Match Results Grid -->
          <div class="match-results-grid" id="matchmaker-results">
            ${this.renderMatchResults(this.selectedSubject, this.minProficiency)}
          </div>
        </div>

        <!-- Subject Demand vs Trainer Capacity Matrix Table -->
        <div class="table-container" style="margin-top: 32px;">
          <div class="table-toolbar">
            <div>
              <h3>Enterprise Subject Competency & Coverage Matrix</h3>
              <p class="section-subtitle">Real-time organizational demand vs qualified trainer availability</p>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
              ${user && user.role === 'admin' ? `
                <button class="btn btn-sm btn-primary" onclick="CompetencyView.openAddDomainModal()">
                  <i data-lucide="plus"></i> Add Domain
                </button>
              ` : ''}
              <span class="matrix-status-chip surplus"><i data-lucide="check"></i> Surplus Coverage</span>
              <span class="matrix-status-chip adequate"><i data-lucide="check-circle"></i> Adequate Coverage</span>
              <span class="matrix-status-chip gap"><i data-lucide="alert-triangle"></i> Strategic Gap</span>
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Subject & Category</th>
                <th>Required Competency</th>
                <th>Enterprise Demand</th>
                <th>Learners Enrolled</th>
                <th>Coverage Status</th>
                <th>Qualified Trainers Available</th>
              </tr>
            </thead>
            <tbody>
              ${matrix.map(row => `
                <tr>
                  <td>
                    <strong>${row.subject}</strong>
                    <div style="font-size:0.75rem; color:var(--text-muted);">${row.category}</div>
                  </td>
                  <td>
                    <span class="badge badge-primary">${row.requiredSkillLevel}</span>
                  </td>
                  <td>
                    <strong style="color:${row.organizationDemand === 'Critical' ? 'var(--color-danger)' : (row.organizationDemand === 'High' ? 'var(--color-warning)' : 'var(--text-primary)')};">
                      ${row.organizationDemand}
                    </strong>
                  </td>
                  <td>${row.traineesEnrolled} Trainees</td>
                  <td>
                    <span class="matrix-status-chip ${row.trainerCoverageStatus}">
                      ${row.trainerCoverageStatus.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                      ${row.trainersQualified.map(t => `
                        <div style="font-size:0.8rem; display:flex; align-items:center; gap:6px;">
                          <span>• <strong>${t.trainerName}</strong></span>
                          <span style="color:#F59E0B; font-size:0.75rem;">(Lvl ${t.proficiency}/5)</span>
                          <span style="font-size:0.7rem; color:var(--brand-accent); font-weight:700;">${t.matchScore}% Match</span>
                        </div>
                      `).join('')}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.bindControls();
  },

  renderMatchResults(subject, minProf) {
    const matrix = store.getCompetencyMatrix();
    const item = matrix.find(m => m.subject.toLowerCase() === subject.toLowerCase());
    if (!item) return '<p class="form-hint">No mapped data for this subject.</p>';

    const filteredTrainers = item.trainersQualified.filter(t => t.proficiency >= minProf);

    if (filteredTrainers.length === 0) {
      return `
        <div style="grid-column: 1 / -1; padding: 32px; background:var(--color-warning-bg); border:1px solid var(--color-warning-border); border-radius:var(--radius-md); text-align:center;">
          <h4 style="color:var(--color-warning); margin-bottom:6px;"><i data-lucide="alert-triangle"></i> Strategic Trainer Coverage Gap Detected</h4>
          <p style="color:#92400E; max-width:540px; margin:0 auto;">
            No currently available trainers satisfy the Level ${minProf} competency threshold for <strong>${subject}</strong>.
            Recommendation: Admin should approve external trainer certifications or cross-train adjacent faculty.
          </p>
        </div>
      `;
    }

    return filteredTrainers.map((t, idx) => `
      <div class="trainer-match-card">
        <span class="match-rank-ribbon ${idx === 0 ? 'top-match' : ''}">
          ${idx === 0 ? 'Top Recommendation' : 'Qualified Match'}
        </span>

        <div class="trainer-card-bio">
          <div class="trainer-card-avatar">${t.trainerName.slice(0, 2).toUpperCase()}</div>
          <div>
            <div class="trainer-card-name">${t.trainerName}</div>
            <div class="trainer-card-dept">${t.experienceYears} Years Enterprise Domain Experience</div>
          </div>
        </div>

        <div class="match-score-bar-wrap">
          <div class="match-score-header">
            <span>Subject Suitability Score</span>
            <span style="color:var(--brand-accent);">${t.matchScore}%</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${t.matchScore}%;"></div>
          </div>
        </div>

        <div style="margin: 8px 0; font-size:0.8rem;">
          <strong>Verified Certifications:</strong>
          <div class="competency-tags">
            ${(t.certifications || []).map(cert => `
              <span class="competency-tag-pill"><i data-lucide="check-circle" style="width:12px; height:12px; display:inline;"></i> ${cert}</span>
            `).join('')}
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto; padding-top:12px; border-top:1px solid var(--border-color-subtle);">
          <span style="font-size:0.775rem; color:var(--text-muted);"><i data-lucide="calendar"></i> Status: ${t.availability}</span>
          <button class="btn btn-sm btn-primary" onclick="App.showToast('Trainer Assigned', '${t.trainerName} has been designated as primary instructor for ${subject} cohort.', 'success')">
            <i data-lucide="user-plus"></i> Assign Cohort
          </button>
        </div>
      </div>
    `).join('');
  },

  renderTraineeGapAnalysis(user, matrix) {
    const userSkills = user.skills || [];
    const enrollments = store.getEnrollmentsForUser(user.id);
    const courses = store.getCourses();

    // Map strategic domains to trainee's current level
    const analysisItems = matrix.slice(0, 4).map(dom => {
      let currentLvl = 2; // baseline
      let matchedSkill = userSkills.find(s => s.name.toLowerCase().includes(dom.subject.toLowerCase().split(' ')[0]));
      if (matchedSkill) {
        if (matchedSkill.level === 'Expert') currentLvl = 5;
        else if (matchedSkill.level === 'Advanced') currentLvl = 4;
        else if (matchedSkill.level === 'Intermediate') currentLvl = 3;
      }
      // Check certificates
      if ((user.certificates || []).some(c => c.courseTitle.toLowerCase().includes(dom.subject.toLowerCase().split(' ')[0]))) {
        currentLvl = Math.max(currentLvl, 5);
      }

      const targetLvl = 4; // Enterprise benchmark
      const gap = Math.max(0, targetLvl - currentLvl);
      const matchingCourse = courses.find(c => c.subject.toLowerCase() === dom.subject.toLowerCase());
      const isEnrolled = enrollments.some(e => matchingCourse && e.courseId === matchingCourse.id);

      return {
        subject: dom.subject,
        currentLvl,
        targetLvl,
        gap,
        matchingCourse,
        isEnrolled
      };
    });

    return `
      <div class="gap-analysis-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <span class="badge badge-primary"><i data-lucide="crosshair" style="width:12px; height:12px; display:inline;"></i> Personalized Analysis</span>
            <h3 style="margin-top:6px;">Your Strategic Competency Readiness vs Enterprise Benchmarks</h3>
            <p class="section-subtitle">Real-time gap evaluation comparing your current credentials against organizational Level 4 target standards</p>
          </div>
          <span class="badge badge-info">${user.title || 'Professional Trainee'}</span>
        </div>

        <div style="display:flex; flex-direction:column; gap:4px;">
          ${analysisItems.map(item => `
            <div class="gap-skill-row">
              <div style="width:220px;">
                <strong>${item.subject}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted);">Enterprise Target: Level ${item.targetLvl}</div>
              </div>

              <div class="gap-bar-track">
                <div class="gap-bar-fill" style="width:${(item.currentLvl / 5) * 100}%; background:${item.gap === 0 ? 'var(--color-success)' : 'var(--brand-accent)'};"></div>
              </div>

              <div style="width:140px; font-size:0.85rem;">
                <span style="font-weight:700;">Level ${item.currentLvl} / 5</span>
                ${item.gap === 0 ? `
                  <span class="badge badge-success" style="margin-left:6px; font-size:0.7rem;">Target Met</span>
                ` : `
                  <span class="badge badge-warning" style="margin-left:6px; font-size:0.7rem;">-${item.gap} Lvl Gap</span>
                `}
              </div>

              <div style="width:180px; text-align:right;">
                ${item.gap === 0 ? `
                  <span style="color:var(--color-success); font-size:0.8rem; font-weight:600;"><i data-lucide="check" style="width:14px; height:14px; display:inline;"></i> Certified</span>
                ` : (item.isEnrolled ? `
                  <button class="btn btn-xs btn-outline" onclick="App.navigateTo('trainee-portal'); TraineeView.switchTab('courses');">
                    <i data-lucide="play-circle"></i> In Training
                  </button>
                ` : (item.matchingCourse ? `
                  <button class="btn btn-xs btn-primary" onclick="App.handleEnrollClick('${item.matchingCourse.id}')">
                    <i data-lucide="plus"></i> Bridge Gap Track
                  </button>
                ` : '<span>Track in authoring</span>'))}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  openAddDomainModal() {
    const modal = document.getElementById('modal-add-competency-domain');
    if (modal) modal.classList.add('active');
  },

  bindControls() {
    const btn = document.getElementById('btn-run-matchmaker');
    const subjSelect = document.getElementById('match-subject-select');
    const profSelect = document.getElementById('match-proficiency-select');

    if (btn && subjSelect && profSelect) {
      btn.addEventListener('click', () => {
        this.selectedSubject = subjSelect.value;
        this.minProficiency = parseInt(profSelect.value);
        const resultsContainer = document.getElementById('matchmaker-results');
        if (resultsContainer) {
          resultsContainer.innerHTML = this.renderMatchResults(this.selectedSubject, this.minProficiency);
          if (window.lucide) window.lucide.createIcons();
          App.showToast("Matchmaking Calculated", `Ranked suitable instructors for ${this.selectedSubject}`, "info");
        }
      });
    }
  },

  bindEvents() {
    const form = document.getElementById('form-add-competency-domain');
    if (form && !form.dataset.bound) {
      form.dataset.bound = "true";
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const subject = document.getElementById('dom-subject').value.trim();
        const category = document.getElementById('dom-category').value;
        const requiredSkillLevel = document.getElementById('dom-skill-level').value;
        const organizationDemand = document.getElementById('dom-demand').value;
        const traineesEnrolled = document.getElementById('dom-target').value;

        store.addCompetencyDomain({
          subject,
          category,
          requiredSkillLevel,
          organizationDemand,
          traineesEnrolled,
          trainerCoverageStatus: 'gap',
          trainersQualified: []
        });

        App.showToast("Strategic Domain Registered", `${subject} added to Organizational Competency Matrix.`, "success");
        App.closeAllModals();
        form.reset();
        this.render();
      });
    }
  }
};
