/**
 * CAPACITY CONNECT - MCQ ASSESSMENT ENGINE
 * Interactive timed examination suite, question palette,
 * auto-grading, instructor explanations, and certificate generation.
 */

const AssessmentView = {
  currentAssessment: null,
  currentIndex: 0,
  userAnswers: {},
  flaggedQuestions: new Set(),
  timerInterval: null,
  secondsRemaining: 0,
  startTime: null,

  startAssessment(assessmentId) {
    const user = store.getCurrentUser();
    if (!user) {
      App.showToast("Sign In Required", "Please sign in to attempt assessments.", "warning");
      App.openLoginModal();
      return;
    }

    const assessment = store.getAssessmentById(assessmentId);
    if (!assessment) {
      App.showToast("Assessment Not Found", "Invalid assessment identifier.", "error");
      return;
    }

    this.currentAssessment = assessment;
    this.currentIndex = 0;
    this.userAnswers = {};
    this.flaggedQuestions = new Set();
    this.secondsRemaining = (assessment.timeLimitMinutes || 15) * 60;
    this.startTime = Date.now();

    App.navigateTo('assessment-active');
    this.renderActiveExam();
    this.startTimer();
  },

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.secondsRemaining--;
      this.updateTimerDisplay();

      if (this.secondsRemaining <= 0) {
        clearInterval(this.timerInterval);
        App.showToast("Time Expired", "Assessment time limit reached. Submitting answers automatically.", "warning");
        this.submitAssessment();
      }
    }, 1000);
  },

  updateTimerDisplay() {
    const timerEl = document.getElementById('exam-timer');
    if (!timerEl) return;

    const mins = Math.floor(this.secondsRemaining / 60);
    const secs = this.secondsRemaining % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    timerEl.innerHTML = `<i data-lucide="clock"></i> ${formatted}`;
    if (this.secondsRemaining <= 120) {
      timerEl.className = 'assessment-timer-badge urgent';
    } else {
      timerEl.className = 'assessment-timer-badge';
    }
    if (window.lucide) window.lucide.createIcons();
  },

  renderActiveExam() {
    const container = document.getElementById('assessment-active-view');
    if (!container || !this.currentAssessment) return;

    const asm = this.currentAssessment;
    const questions = asm.questions || [];
    const q = questions[this.currentIndex];

    container.innerHTML = `
      <div class="container">
        <!-- Exam Header -->
        <div class="assessment-header">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span class="badge badge-primary">${asm.subject}</span>
              <span style="font-size:0.8rem; color:var(--text-muted);">Pass Requirement: ${asm.passingScore}%</span>
            </div>
            <h3 style="margin-top:4px;">${asm.title}</h3>
          </div>
          <div style="display:flex; align-items:center; gap:16px;">
            <div id="exam-timer" class="assessment-timer-badge">
              <i data-lucide="clock"></i> --:--
            </div>
            <button class="btn btn-danger btn-sm" id="btn-submit-exam-early">
              <i data-lucide="send"></i> Submit Exam
            </button>
          </div>
        </div>

        <!-- Exam Layout: Question + Palette -->
        <div class="assessment-layout">
          <div>
            <!-- Question Box -->
            <div class="question-card">
              <div class="question-meta">
                <span>Question ${this.currentIndex + 1} of ${questions.length}</span>
                <button class="btn btn-sm btn-ghost" id="btn-flag-question" style="color:${this.flaggedQuestions.has(this.currentIndex) ? 'var(--color-warning)' : 'var(--text-muted)'};">
                  <i data-lucide="flag"></i> ${this.flaggedQuestions.has(this.currentIndex) ? 'Flagged for Review' : 'Flag Question'}
                </button>
              </div>

              <div class="question-text">${q.question}</div>

              <!-- Options List -->
              <div class="options-list">
                ${q.options.map((opt, optIdx) => {
                  const isSelected = this.userAnswers[this.currentIndex] === optIdx;
                  return `
                    <label class="option-item ${isSelected ? 'selected' : ''}" data-option-index="${optIdx}">
                      <input type="radio" name="exam-option" class="option-radio" value="${optIdx}" ${isSelected ? 'checked' : ''}>
                      <span class="option-label">${opt}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Action Controls -->
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <button class="btn btn-outline" id="btn-prev-q" ${this.currentIndex === 0 ? 'disabled' : ''}>
                <i data-lucide="arrow-left"></i> Previous Question
              </button>

              <div style="display:flex; gap:10px;">
                ${this.currentIndex < questions.length - 1 ? `
                  <button class="btn btn-primary" id="btn-next-q">
                    Next Question <i data-lucide="arrow-right"></i>
                  </button>
                ` : `
                  <button class="btn btn-success" id="btn-finish-exam">
                    <i data-lucide="check-circle-2"></i> Review & Submit
                  </button>
                `}
              </div>
            </div>
          </div>

          <!-- Question Palette Sidebar -->
          <div class="question-palette">
            <h4 style="margin-bottom:8px;">Question Navigator</h4>
            <p style="font-size:0.775rem; color:var(--text-muted); margin-bottom:12px;">Jump directly to any item</p>

            <div class="palette-grid">
              ${questions.map((_, idx) => {
                const isCurrent = idx === this.currentIndex;
                const isAnswered = this.userAnswers[idx] !== undefined;
                const isFlagged = this.flaggedQuestions.has(idx);

                let cls = 'palette-btn';
                if (isCurrent) cls += ' current';
                if (isAnswered) cls += ' answered';
                if (isFlagged) cls += ' flagged';

                return `
                  <button class="${cls}" data-jump-to="${idx}">${idx + 1}</button>
                `;
              }).join('')}
            </div>

            <div class="palette-legend">
              <div class="legend-item">
                <span class="legend-dot" style="background:var(--brand-accent);"></span>
                <span>Answered</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background:var(--color-warning);"></span>
                <span>Flagged</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot" style="background:var(--border-color);"></span>
                <span>Unattempted</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
    this.updateTimerDisplay();
    this.bindExamControls();
  },

  bindExamControls() {
    const questions = this.currentAssessment.questions || [];

    // Select Option
    document.querySelectorAll('.option-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const optIdx = parseInt(e.currentTarget.getAttribute('data-option-index'));
        this.userAnswers[this.currentIndex] = optIdx;
        this.renderActiveExam();
      });
    });

    // Next
    const nextBtn = document.getElementById('btn-next-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.currentIndex < questions.length - 1) {
          this.currentIndex++;
          this.renderActiveExam();
        }
      });
    }

    // Prev
    const prevBtn = document.getElementById('btn-prev-q');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.renderActiveExam();
        }
      });
    }

    // Flag
    const flagBtn = document.getElementById('btn-flag-question');
    if (flagBtn) {
      flagBtn.addEventListener('click', () => {
        if (this.flaggedQuestions.has(this.currentIndex)) {
          this.flaggedQuestions.delete(this.currentIndex);
        } else {
          this.flaggedQuestions.add(this.currentIndex);
        }
        this.renderActiveExam();
      });
    }

    // Jump
    document.querySelectorAll('[data-jump-to]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetIdx = parseInt(e.currentTarget.getAttribute('data-jump-to'));
        this.currentIndex = targetIdx;
        this.renderActiveExam();
      });
    });

    // Submit
    const submitBtn = document.getElementById('btn-finish-exam') || document.getElementById('btn-submit-exam-early');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const unansweredCount = questions.length - Object.keys(this.userAnswers).length;
        if (unansweredCount > 0) {
          if (!confirm(`You have ${unansweredCount} unanswered questions. Are you sure you want to finalize and submit?`)) {
            return;
          }
        } else {
          if (!confirm("Submit your answers for automated grading?")) return;
        }
        this.submitAssessment();
      });
    }
  },

  submitAssessment() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    const user = store.getCurrentUser();
    const asm = this.currentAssessment;
    const questions = asm.questions || [];

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (this.userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= (asm.passingScore || 70);
    const elapsedMinutes = Math.max(1, Math.round((Date.now() - this.startTime) / 60000));

    // Record attempt into central store
    const attempt = store.recordAssessmentAttempt({
      assessmentId: asm.id,
      traineeId: user.id,
      traineeName: user.name,
      subject: asm.subject,
      score,
      passed,
      timeTakenMinutes: elapsedMinutes
    });

    // Confetti celebration if passed!
    if (passed && window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    this.renderResults(score, passed, correctCount, questions.length, elapsedMinutes);
  },

  renderResults(score, passed, correct, total, timeTaken) {
    const container = document.getElementById('assessment-active-view');
    if (!container || !this.currentAssessment) return;

    const asm = this.currentAssessment;
    const questions = asm.questions || [];

    container.innerHTML = `
      <div class="container" style="max-width: 860px; padding: 48px 16px;">
        <div class="assessment-results-card">
          <div class="score-circle ${passed ? 'passed' : 'failed'}">
            <div class="score-percentage">${score}%</div>
            <div class="score-label">${passed ? 'Passed' : 'Needs Review'}</div>
          </div>

          <h2 style="margin-bottom:8px;">${passed ? 'Congratulations! Competency Benchmark Passed' : 'Assessment Completed'}</h2>
          <p style="color:var(--text-secondary); max-width:540px; margin:0 auto 24px auto;">
            ${passed 
              ? `You have satisfied the organizational mastery benchmark (${asm.passingScore}%) for ${asm.subject}. An accredited certificate has been issued to your profile.`
              : `Your score is below the ${asm.passingScore}% passing threshold. Review the explanations below and refresh your concepts via the Trainer Library before retrying.`}
          </p>

          <div style="display:flex; justify-content:center; gap:24px; font-size:0.9rem; margin-bottom:28px;">
            <div><strong>Correct:</strong> ${correct} / ${total}</div>
            <div><strong>Time:</strong> ${timeTaken} mins</div>
            <div><strong>Required:</strong> ${asm.passingScore}%</div>
          </div>

          <div style="display:flex; justify-content:center; gap:12px; margin-bottom:36px; flex-wrap:wrap;">
            <button class="btn btn-outline" onclick="App.navigateTo('trainee-portal')">
              <i data-lucide="layout-dashboard"></i> Back to Trainee Hub
            </button>
            ${passed ? `
              <button class="btn btn-primary" onclick="CertificateView.openLatestCertificate()">
                <i data-lucide="award"></i> View & Print Certificate
              </button>
            ` : `
              <button class="btn btn-primary" onclick="AssessmentView.startAssessment('${asm.id}')">
                <i data-lucide="rotate-ccw"></i> Retry Assessment
              </button>
            `}
          </div>

          <!-- Question-by-Question Detailed Review -->
          <div style="text-align:left; border-top:1px solid var(--border-color); padding-top:24px;">
            <h3 style="margin-bottom:16px;">Detailed Assessment Review & Explanations</h3>
            <div style="display:flex; flex-direction:column; gap:16px;">
              ${questions.map((q, idx) => {
                const userChoice = this.userAnswers[idx];
                const isCorrect = userChoice === q.correctIndex;
                return `
                  <div style="background:var(--bg-surface-alt); border:1px solid ${isCorrect ? 'var(--color-success-border)' : 'var(--color-danger-border)'}; border-radius:var(--radius-md); padding:16px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                      <strong>Question ${idx + 1}</strong>
                      <span class="badge ${isCorrect ? 'badge-success' : 'badge-danger'}">
                        ${isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <p style="font-weight:600; margin-bottom:10px;">${q.question}</p>
                    <div style="font-size:0.85rem; margin-bottom:6px;">
                      <div><strong>Your Answer:</strong> ${userChoice !== undefined ? q.options[userChoice] : 'Unanswered'}</div>
                      ${!isCorrect ? `<div style="color:var(--color-success);"><strong>Correct Answer:</strong> ${q.options[q.correctIndex]}</div>` : ''}
                    </div>
                    <div style="background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-xs); border-left:3px solid var(--brand-accent); font-size:0.8rem; color:var(--text-secondary); margin-top:8px;">
                      <strong>Trainer Explanation:</strong> ${q.explanation}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};
