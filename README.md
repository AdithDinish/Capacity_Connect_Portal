# CAPACITY CONNECT - Digital Capacity Building & Learning Management Portal

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Vanilla JS](https://img.shields.io/badge/ES6%2B-Vanilla%20JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An enterprise-grade digital capacity building and competency orchestration platform developed for high-impact workforce upskilling. **CAPACITY CONNECT** seamlessly connects **Strategic Trainees**, **Certified Faculty Trainers**, and **Directorate Administrators**.

---

## 🌟 Key Features

### 🎓 1. Trainee Experience & Interactive Classroom
- **Interactive Course Classroom:** Syllabus checklist, video lecture simulation, executive takeaways, and hands-on lab environment launcher.
- **Active Recall Drills:** Flashcard system with click-to-flip principle reveals.
- **Progress Tracking:** Automatic progress calculation, module completion markers, celebration confetti on course completion, and direct exam unlocking.
- **Timed MCQ Examination Engine:** Timed test interface with question palette, answer flagging, auto-grading, and pedagogical explanations.
- **Verifiable Digital Credentials:** Authenticated Certificate of Competency generator with official directorate seal and verification IDs.

### 🧑‍🏫 2. Trainer Studio
- **Dynamic Questionnaire Builder:** Author questions dynamically with radio-selected correct answers, deadlines, and pedagogical rationales.
- **Library Resource Repository:** Upload and manage slide decks, video lectures, and operational runbooks.
- **Trainee Performance Monitoring:** Detailed attempt drill-downs, score analysis, and personalized feedback notes dispatch.
- **Examination Key Review:** Review full answer keys with explanations.

### 🏛️ 3. Directorate Admin Center & Governance
- **Executive Telemetry:** Interactive Chart.js visualizations for cumulative enrollment velocity, subject scores vs benchmarks, and competency coverage.
- **Talent Lifecycle Management:** One-click account approvals, rejections, suspensions, and role promotions.
- **Direct User Onboarding:** Streamlined onboarding of faculty and workforce learners.
- **Curriculum & CMS Publishing:** Publish new course tracks, broadcast homepage urgency tickers, and showcase Spotlight Hall of Fame achievements.

### 🧠 4. Strategic Competency Matrix & Faculty Matchmaker
- **Organizational Coverage Triage:** Identifies domain coverage states (*Adequate*, *Gap*, *Surplus*) across 6 enterprise competencies.
- **Faculty Matchmaker Algorithm:** Recommends optimal instructors based on proficiency, certifications, and availability.
- **Personal Trainee Gap Analysis:** Benchmarks individual trainee proficiency against Enterprise Level 4 benchmarks with one-click course bridge buttons.
- **Strategic Domain Registration:** Register new emerging technology domains directly into the matrix.

### 🔍 5. Global Quick Search & Credential Verification
- **Global Instant Search (`Ctrl+K` / `Cmd+K`):** Real-time search across courses, library resources, competency domains, and faculty.
- **Official Credential Verification Engine:** Public authenticity registry to cryptographically validate certificate IDs (e.g. `CAP-2026-CLOUD-9841`).
- **Dynamic Notifications System:** Real-time notification drawer with unread counters and reactive event triggers.

---

## 🚀 Quickstart Guide

### Prerequisites
- Node.js (version 16 or later)

### Running Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/AdithDinish/Capacity_Connect_Portal.git
   cd Capacity_Connect_Portal
   ```

2. Start the local server:
   ```bash
   node server.js
   # or
   npm start
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 👥 Demo Accounts & Credentials

The portal features an instant **Role Switcher** in the top navigation bar, or you can log in with:

| Role | Name | Email | Password | Highlights |
| :--- | :--- | :--- | :--- | :--- |
| **Trainee** | **Priya Sharma** | `priya.sharma@capacityconnect.org` | `password123` | Senior Business & Data Analyst. Holds Cloud Distinction Certificate (`CAP-2026-CLOUD-9841`). |
| **Trainer** | **Dr. Marcus Vance** | `marcus.vance@capacityconnect.org` | `password123` | Lead Cloud Architect. Authors MCQ assessments and uploads slide decks. |
| **Trainer** | **Elena Rostova** | `elena.rostova@capacityconnect.org` | `password123` | Senior Cybersecurity Specialist. CISSP certified. |
| **Admin** | **Eleanor Vance** | `admin@capacityconnect.org` | `password123` | Chief Capacity Officer. Direct user onboarding, analytics, and CMS. |
| **Public Visitor** | *Guest* | *Signed Out* | *None* | Search courses and verify credentials on public registry. |

---

## 🏗️ Project Architecture

```
Capacity_Connect_Portal/
├── index.html                   # Semantic HTML5 single-page application with 21 accessible modals
├── server.js                    # Native Node.js HTTP server (serving port 3000)
├── package.json                 # Project descriptor
├── .gitignore                   # Ignored files
├── README.md                    # Project documentation
├── css/
│   ├── variables.css            # Enterprise design tokens (HSL colors, dark mode, typography)
│   ├── base.css                 # CSS reset, responsive container, utility grid
│   ├── components.css           # Navigation, cards, buttons, badges, modals, flashcards
│   ├── dashboard.css            # Role banners, metric KPI cards, tables, avatars, notifications drawer
│   ├── assessment.css           # Examination screen, question palette, timer badge, score circle
│   ├── competency.css           # Matrix table, coverage status pills, matchmaker cards, gap widgets
│   └── responsive.css           # Breakpoint adaptations and mobile drawer
└── js/
    ├── mockData.js              # Comprehensive enterprise dataset (users, courses, matrix, resources)
    ├── store.js                 # Reactive LocalStorage state store with pub/sub event listeners
    ├── auth.js                  # Demo role switcher, session persistence, and login/register controller
    ├── traineeView.js           # Trainee dashboard, profile tabs, classroom player, flashcards
    ├── trainerView.js           # Trainer studio, dynamic questionnaire builder, attempt inspector
    ├── adminView.js             # Directorate admin center, Chart.js telemetry, user approvals
    ├── competencyView.js        # Strategic competency mapping, trainer matchmaker, personal gap analysis
    ├── assessmentView.js        # Timed MCQ engine, question palette, automated grading, confetti
    ├── certificateView.js       # Printable certificate generator with official seal and signatures
    └── app.js                   # Application coordinator, routing, toast system, search, and global events
```

---

## 📄 License
This project is licensed under the MIT License.
