/**
 * CAPACITY CONNECT - CERTIFICATE OF COMPLETION CONTROLLER
 * Authenticated certificate generator with verification ID and print view.
 */

const CertificateView = {
  openModal(certId) {
    const user = store.getCurrentUser();
    if (!user) return;

    let cert = (user.certificates || []).find(c => c.id === certId);
    if (!cert) {
      // Check all users
      for (const u of store.getUsers()) {
        const found = (u.certificates || []).find(c => c.id === certId);
        if (found) {
          cert = found;
          break;
        }
      }
    }

    if (!cert) {
      App.showToast("Certificate Not Found", "Invalid credential ID", "error");
      return;
    }

    this.renderCertificate(cert, user);
  },

  openLatestCertificate() {
    const user = store.getCurrentUser();
    if (user && user.certificates && user.certificates.length > 0) {
      this.openModal(user.certificates[0].id);
    } else {
      App.showToast("No Certificate", "No certificates earned yet.", "info");
    }
  },

  renderCertificate(cert, user) {
    const modal = document.getElementById('modal-certificate');
    const container = document.getElementById('certificate-render-container');

    if (!modal || !container) return;

    container.innerHTML = `
      <div class="certificate-document" id="printable-certificate">
        <div class="cert-inner-border">
          <div class="cert-crest">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>

          <div class="cert-header-tag">Executive Capacity Development Directorate</div>
          <div class="cert-main-title">Certificate of Competency</div>

          <div class="cert-presented-to">This certifies that</div>
          <div class="cert-recipient-name">${user.name}</div>

          <div class="cert-reason">
            has successfully fulfilled all curriculum requirements, continuous hands-on laboratory exercises, and passed the rigorous benchmark assessment with <strong>${cert.score}% Distinction</strong> in
            <div class="cert-course-name" style="margin-top: 6px; font-size: 1.25rem;">${cert.courseTitle}</div>
          </div>

          <div class="cert-signatures">
            <div>
              <div class="cert-signature-line"></div>
              <div class="cert-signer-name">${cert.trainerName || 'Dr. Marcus Vance'}</div>
              <div class="cert-signer-title">Principal Certifying Instructor</div>
            </div>

            <div class="cert-seal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:2px;">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Verified</span>
              <span style="font-size:0.55rem;">Official Seal</span>
            </div>

            <div>
              <div class="cert-signature-line"></div>
              <div class="cert-signer-name">Eleanor Vance</div>
              <div class="cert-signer-title">Chief Capacity Officer & Admin</div>
            </div>
          </div>

          <div class="cert-footer-meta">
            <span><strong>Credential ID:</strong> ${cert.id}</span>
            <span><strong>Date Issued:</strong> ${cert.issueDate}</span>
            <span><strong>Verification Code:</strong> ${cert.verificationCode || 'CC-VERIFIED-2026'}</span>
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:center; gap:12px; margin-top:24px;">
        <button class="btn btn-outline" onclick="App.closeAllModals()">
          <i data-lucide="x"></i> Close
        </button>
        <button class="btn btn-primary" onclick="window.print()">
          <i data-lucide="printer"></i> Print / Save as PDF
        </button>
      </div>
    `;

    modal.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }
};
