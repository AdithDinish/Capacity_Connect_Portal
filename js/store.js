/**
 * CAPACITY CONNECT - REACTIVE LOCAL STORAGE STORE
 * Centralized state management for all portal entities.
 */

const STORAGE_KEY = "capacity_connect_v1_data";
const CURRENT_USER_KEY = "capacity_connect_v1_auth_user";

class Store {
  constructor() {
    this.listeners = [];
    this.data = this.loadData();
    this.currentUser = this.loadCurrentUser();
  }

  loadData() {
    let loaded = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        loaded = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error reading localStorage, using mock data", e);
    }
    if (!loaded) {
      loaded = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    }

    // Ensure all courses have up-to-date imageUrl and imageBg from INITIAL_MOCK_DATA
    if (loaded && loaded.courses) {
      INITIAL_MOCK_DATA.courses.forEach(initialCourse => {
        const existing = loaded.courses.find(c => c.id === initialCourse.id);
        if (existing) {
          if (!existing.imageUrl || existing.imageUrl !== initialCourse.imageUrl) {
            existing.imageUrl = initialCourse.imageUrl;
          }
          if (!existing.imageBg) {
            existing.imageBg = initialCourse.imageBg;
          }
        }
      });
    }

    if (!loaded.notifications) {
      loaded.notifications = [
        {
          id: "notif-1",
          title: "New Benchmark Assessment",
          desc: "Dr. Marcus Vance published the Cloud Architecture Evaluation.",
          time: "10 mins ago",
          type: "assessment",
          icon: "award",
          color: "#2563EB",
          bg: "#EFF6FF",
          unread: true
        },
        {
          id: "notif-2",
          title: "Certificate Issued",
          desc: "Your Cloud Architecture certification is ready to download.",
          time: "2 hours ago",
          type: "certificate",
          icon: "check-circle-2",
          color: "#059669",
          bg: "#ECFDF5",
          unread: true
        },
        {
          id: "notif-3",
          title: "Directorate Town Hall",
          desc: "Q4 Enterprise Skill Drive starts next Monday.",
          time: "1 day ago",
          type: "announcement",
          icon: "megaphone",
          color: "#D97706",
          bg: "#FEF3C7",
          unread: false
        }
      ];
    }
    this.saveData(loaded);
    return loaded;
  }

  saveData(data = this.data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      this.notifyListeners();
    } catch (e) {
      console.error("Error saving data to localStorage", e);
    }
  }

  resetToInitial() {
    const initial = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    initial.notifications = [
      {
        id: "notif-1",
        title: "New Benchmark Assessment",
        desc: "Dr. Marcus Vance published the Cloud Architecture Evaluation.",
        time: "10 mins ago",
        type: "assessment",
        icon: "award",
        color: "#2563EB",
        bg: "#EFF6FF",
        unread: true
      },
      {
        id: "notif-2",
        title: "Certificate Issued",
        desc: "Your Cloud Architecture certification is ready to download.",
        time: "2 hours ago",
        type: "certificate",
        icon: "check-circle-2",
        color: "#059669",
        bg: "#ECFDF5",
        unread: true
      },
      {
        id: "notif-3",
        title: "Directorate Town Hall",
        desc: "Q4 Enterprise Skill Drive starts next Monday.",
        time: "1 day ago",
        type: "announcement",
        icon: "megaphone",
        color: "#D97706",
        bg: "#FEF3C7",
        unread: false
      }
    ];
    this.data = initial;
    this.saveData(initial);
    return initial;
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notifyListeners() {
    if (this.listeners && this.listeners.length > 0) {
      this.listeners.forEach(fn => {
        try {
          fn(this.data);
        } catch (e) {
          console.error("Store listener error:", e);
        }
      });
    }
  }

  // --- Auth & User State ---
  loadCurrentUser() {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
    } catch (e) {
      console.warn("Error reading auth state", e);
    }
    return null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
    this.notifyListeners();
  }

  getCurrentUser() {
    // Refresh with latest data from user table if present
    if (this.currentUser) {
      const fresh = this.data.users.find(u => u.id === this.currentUser.id);
      if (fresh) {
        this.currentUser = fresh;
      }
    }
    return this.currentUser;
  }

  login(email, password) {
    const user = this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: "User account not found." };
    }
    if (user.password !== password) {
      return { success: false, message: "Invalid password credentials." };
    }
    if (user.status === "pending_approval") {
      return { success: false, message: "Account is pending Admin approval. Please contact portal administrator." };
    }
    if (user.status === "suspended") {
      return { success: false, message: "This account has been deactivated. Please reach out to L&D." };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  registerUser(userData) {
    const exists = this.data.users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (exists) {
      return { success: false, message: "An account with this email address already exists." };
    }

    const newUser = {
      id: "usr-" + Date.now().toString(36),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || "trainee",
      // Trainers and Admins require Admin approval by default; Trainees can also be verified
      status: userData.role === "trainee" ? "active" : "pending_approval",
      avatar: userData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      department: userData.department || "Enterprise Workforce",
      title: userData.title || (userData.role === "trainer" ? "Subject Matter Instructor" : "Professional Trainee"),
      joinedDate: new Date().toISOString().split("T")[0],
      bio: userData.bio || "Engaged member of Capacity Connect digital learning community.",
      interests: userData.interests || [],
      skills: userData.skills || [],
      qualifications: userData.qualifications || [],
      experience: userData.experience || [],
      certificates: []
    };

    if (userData.role === "trainer") {
      newUser.rating = 5.0;
      newUser.studentsTaught = 0;
      newUser.competencies = userData.competencies || [];
    }

    this.data.users.push(newUser);
    this.saveData();

    // If active immediately, sign them in
    if (newUser.status === "active") {
      this.setCurrentUser(newUser);
    }

    return {
      success: true,
      user: newUser,
      pendingApproval: newUser.status === "pending_approval"
    };
  }

  // --- Admin User Actions ---
  getUsers() {
    return this.data.users;
  }

  updateUserStatus(userId, status) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      this.saveData();
      return true;
    }
    return false;
  }

  updateUserRole(userId, newRole) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Course Operations ---
  getCourses() {
    return this.data.courses;
  }

  getCourseById(courseId) {
    return this.data.courses.find(c => c.id === courseId);
  }

  getEnrollmentsForUser(traineeId) {
    return this.data.enrollments.filter(e => e.traineeId === traineeId);
  }

  enrollInCourse(courseId, traineeId) {
    const existing = this.data.enrollments.find(e => e.courseId === courseId && e.traineeId === traineeId);
    if (existing) {
      return { success: false, message: "Already enrolled in this course track." };
    }

    const course = this.getCourseById(courseId);
    if (course) {
      course.enrolledCount = (course.enrolledCount || 0) + 1;
    }

    const enrollment = {
      id: "enr-" + Date.now().toString(36),
      traineeId,
      courseId,
      enrolledDate: new Date().toISOString().split("T")[0],
      progress: 0,
      status: "in_progress",
      completedDate: null,
      finalScore: null
    };

    this.data.enrollments.push(enrollment);
    this.saveData();
    return { success: true, enrollment };
  }

  unenrollCourse(courseId, traineeId) {
    this.data.enrollments = this.data.enrollments.filter(
      e => !(e.courseId === courseId && e.traineeId === traineeId)
    );
    const course = this.getCourseById(courseId);
    if (course && course.enrolledCount > 0) {
      course.enrolledCount -= 1;
    }
    this.saveData();
    return { success: true };
  }

  // --- Trainee Profile Updates ---
  addQualification(traineeId, qual) {
    const user = this.data.users.find(u => u.id === traineeId);
    if (user) {
      if (!user.qualifications) user.qualifications = [];
      user.qualifications.push(qual);
      this.saveData();
      return true;
    }
    return false;
  }

  addExperience(traineeId, exp) {
    const user = this.data.users.find(u => u.id === traineeId);
    if (user) {
      if (!user.experience) user.experience = [];
      user.experience.unshift(exp);
      this.saveData();
      return true;
    }
    return false;
  }

  addSkill(traineeId, skill) {
    const user = this.data.users.find(u => u.id === traineeId);
    if (user) {
      if (!user.skills) user.skills = [];
      user.skills.push(skill);
      this.saveData();
      return true;
    }
    return false;
  }

  // --- Assessments & Tests ---
  getAssessments() {
    return this.data.assessments;
  }

  getAssessmentById(id) {
    return this.data.assessments.find(a => a.id === id);
  }

  createAssessment(assessmentData) {
    const newAssessment = {
      id: "asm-" + Date.now().toString(36),
      courseId: assessmentData.courseId || "crs-custom",
      subject: assessmentData.subject,
      title: assessmentData.title,
      trainerId: assessmentData.trainerId,
      trainerName: assessmentData.trainerName,
      timeLimitMinutes: parseInt(assessmentData.timeLimitMinutes) || 15,
      passingScore: parseInt(assessmentData.passingScore) || 70,
      deadline: assessmentData.deadline || "2026-12-31",
      totalAttempts: 0,
      avgScore: 0,
      description: assessmentData.description,
      questions: assessmentData.questions
    };

    this.data.assessments.unshift(newAssessment);
    this.saveData();
    return newAssessment;
  }

  recordAssessmentAttempt(attempt) {
    const newAttempt = {
      id: "att-" + Date.now().toString(36),
      assessmentId: attempt.assessmentId,
      traineeId: attempt.traineeId,
      traineeName: attempt.traineeName,
      subject: attempt.subject,
      score: attempt.score,
      passed: attempt.passed,
      submittedAt: new Date().toLocaleString(),
      timeTakenMinutes: attempt.timeTakenMinutes || 5
    };

    this.data.assessmentAttempts.unshift(newAttempt);

    // Update assessment stats
    const assessment = this.getAssessmentById(attempt.assessmentId);
    if (assessment) {
      assessment.totalAttempts = (assessment.totalAttempts || 0) + 1;
      const allSubjectAttempts = this.data.assessmentAttempts.filter(a => a.assessmentId === attempt.assessmentId);
      const totalScore = allSubjectAttempts.reduce((acc, curr) => acc + curr.score, 0);
      assessment.avgScore = Math.round(totalScore / allSubjectAttempts.length);
    }

    // If passed, issue verifiable certificate to trainee profile!
    if (attempt.passed) {
      const user = this.data.users.find(u => u.id === attempt.traineeId);
      if (user) {
        if (!user.certificates) user.certificates = [];
        const certId = "CAP-2026-" + attempt.subject.substring(0, 4).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000);
        const cert = {
          id: certId,
          courseId: assessment ? assessment.courseId : "crs-gen",
          courseTitle: assessment ? assessment.title : attempt.subject + " Competency Certification",
          trainerName: assessment ? assessment.trainerName : "Certified Master Trainer",
          issueDate: new Date().toISOString().split("T")[0],
          score: attempt.score,
          verificationCode: "CC-CERT-" + Math.floor(100000 + Math.random() * 900000)
        };
        user.certificates.unshift(cert);
        this.addNotification({
          title: "New Certificate Issued!",
          desc: `Accreditation earned for ${cert.courseTitle} with ${cert.score}% Distinction.`,
          type: "success",
          icon: "award",
          color: "#059669",
          bg: "#ECFDF5"
        });
      }
    }

    this.saveData();
    return newAttempt;
  }

  getAttemptsForTrainer(trainerId) {
    const trainerAssessments = this.data.assessments
      .filter(a => a.trainerId === trainerId)
      .map(a => a.id);
    return this.data.assessmentAttempts.filter(att => trainerAssessments.includes(att.assessmentId));
  }

  getAllAttempts() {
    return this.data.assessmentAttempts;
  }

  // --- Trainer Library Resources ---
  getResources() {
    return this.data.resources;
  }

  addResource(resourceData) {
    const newRes = {
      id: "res-" + Date.now().toString(36),
      trainerId: resourceData.trainerId,
      trainerName: resourceData.trainerName,
      subject: resourceData.subject,
      courseId: resourceData.courseId || "crs-01",
      type: resourceData.type, // 'video', 'presentation', 'document'
      title: resourceData.title,
      description: resourceData.description || "",
      uploadDate: new Date().toISOString().split("T")[0],
      downloads: 0,
      duration: resourceData.duration || null,
      slideCount: resourceData.slideCount || null,
      format: resourceData.format || (resourceData.type === 'document' ? 'PDF' : null),
      fileSize: resourceData.fileSize || "12 MB",
      url: resourceData.url || ""
    };

    this.data.resources.unshift(newRes);
    this.saveData();
    return newRes;
  }

  deleteResource(resId) {
    this.data.resources = this.data.resources.filter(r => r.id !== resId);
    this.saveData();
  }

  // --- Feedback System ---
  addFeedback(feedback) {
    const newFb = {
      id: "fb-" + Date.now().toString(36),
      courseId: feedback.courseId,
      traineeId: feedback.traineeId,
      traineeName: feedback.traineeName,
      rating: feedback.rating,
      ratingsBreakdown: feedback.ratingsBreakdown,
      comment: feedback.comment,
      date: new Date().toISOString().split("T")[0]
    };
    this.data.feedbacks.unshift(newFb);
    this.saveData();
    return newFb;
  }

  getFeedbackForCourse(courseId) {
    return this.data.feedbacks.filter(fb => fb.courseId === courseId);
  }

  // --- Announcements & Achievements (Admin CMS) ---
  getAnnouncements() {
    return this.data.announcements;
  }

  addAnnouncement(ann) {
    const newAnn = {
      id: "ann-" + Date.now().toString(36),
      title: ann.title,
      type: ann.type || "URGENT",
      badge: ann.badge || "Notice",
      date: new Date().toISOString().split("T")[0],
      target: ann.target || "All Staff",
      content: ann.content
    };
    this.data.announcements.unshift(newAnn);
    this.addNotification({
      title: `Notice: ${newAnn.title}`,
      desc: newAnn.content.length > 80 ? newAnn.content.slice(0, 80) + '...' : newAnn.content,
      type: "info",
      icon: "megaphone",
      color: "#2563EB",
      bg: "#EFF6FF"
    });
    this.saveData();
    return newAnn;
  }

  getAchievements() {
    return this.data.achievements;
  }

  addAchievement(ach) {
    const newAch = {
      id: "ach-" + Date.now().toString(36),
      recipientName: ach.recipientName,
      department: ach.department,
      awardTitle: ach.awardTitle,
      score: ach.score || "Honor Distinction",
      date: ach.date || "2026",
      avatar: ach.recipientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      testimonial: ach.testimonial
    };
    this.data.achievements.unshift(newAch);
    this.saveData();
    return newAch;
  }

  // --- Competency Mapping Engine ---
  getCompetencyMatrix() {
    return this.data.competencyMatrix;
  }

  findTrainersForSubject(subjectName) {
    const trainers = this.data.users.filter(u => u.role === "trainer");
    const matches = [];

    trainers.forEach(trainer => {
      const comp = (trainer.competencies || []).find(c => c.subject.toLowerCase() === subjectName.toLowerCase());
      if (comp) {
        matches.push({
          trainer,
          proficiency: comp.proficiency,
          certified: comp.certified,
          matchScore: comp.proficiency * 20
        });
      } else {
        // Base match
        matches.push({
          trainer,
          proficiency: 2,
          certified: false,
          matchScore: 40
        });
      }
    });

    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }

  addCompetencyDomain(domainData) {
    const newDomain = {
      id: "comp-" + Date.now().toString(36),
      subject: domainData.subject,
      category: domainData.category || "Strategic Capability",
      requiredSkillLevel: domainData.requiredSkillLevel || "Level 4 (Advanced)",
      organizationDemand: domainData.organizationDemand || "High",
      traineesEnrolled: parseInt(domainData.traineesEnrolled) || 0,
      trainerCoverageStatus: domainData.trainerCoverageStatus || "adequate",
      trainersQualified: domainData.trainersQualified || []
    };
    this.data.competencyMatrix.push(newDomain);
    this.saveData();
    return newDomain;
  }

  // --- Course Progress & Enrollment Helpers ---
  getEnrollment(courseId, traineeId) {
    return this.data.enrollments.find(e => e.courseId === courseId && e.traineeId === traineeId);
  }

  updateEnrollmentProgress(courseId, traineeId, progressDelta, completedModuleIndex = null) {
    let enr = this.getEnrollment(courseId, traineeId);
    if (!enr) return null;

    if (!enr.completedModules) enr.completedModules = [];
    if (completedModuleIndex !== null && !enr.completedModules.includes(completedModuleIndex)) {
      enr.completedModules.push(completedModuleIndex);
    }

    enr.progress = Math.min(100, Math.max(enr.progress, progressDelta));
    if (enr.progress >= 100) {
      enr.status = "completed";
      enr.completedDate = new Date().toISOString().split("T")[0];
    }

    this.saveData();
    return enr;
  }

  addCourse(courseData) {
    const newCourse = {
      id: "crs-" + Date.now().toString(36),
      title: courseData.title,
      subject: courseData.subject,
      trainerId: courseData.trainerId,
      trainerName: courseData.trainerName,
      duration: courseData.duration || "8 Weeks",
      level: courseData.level || "Intermediate",
      enrolledCount: 0,
      rating: 5.0,
      reviewCount: 0,
      imageUrl: courseData.imageUrl || "images/courses/course-cloud-architecture.jpg",
      imageBg: courseData.imageBg || "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
      description: courseData.description,
      prerequisites: courseData.prerequisites || "Open to all enterprise trainees.",
      syllabus: courseData.syllabus || [
        { week: 1, title: "Foundations & Executive Architecture" },
        { week: 2, title: "Core Protocols & Distributed Systems" },
        { week: 3, title: "Operational Governance & Production Readiness" },
        { week: 4, title: "Capstone Laboratory Project" }
      ],
      isFeatured: courseData.isFeatured || false,
      isNew: true
    };

    this.data.courses.unshift(newCourse);
    this.addNotification({
      title: `New Track Published: ${newCourse.title}`,
      desc: `${newCourse.duration} track in ${newCourse.subject} by ${newCourse.trainerName}.`,
      type: "info",
      icon: "book-open",
      color: "#7C3AED",
      bg: "#F5F3FF"
    });
    this.saveData();
    return newCourse;
  }

  adminCreateUser(userData) {
    const newUser = {
      id: "usr-" + Date.now().toString(36),
      name: userData.name,
      email: userData.email,
      password: userData.password || "password123",
      role: userData.role || "trainee",
      status: "active",
      avatar: userData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      department: userData.department || "Enterprise Directorate",
      title: userData.title || (userData.role === "trainer" ? "Principal Instructor" : "Strategic Trainee"),
      joinedDate: new Date().toISOString().split("T")[0],
      bio: userData.bio || "Dedicated member of Capacity Connect workforce.",
      interests: userData.interests || [],
      skills: userData.skills || [],
      qualifications: [],
      experience: [],
      certificates: []
    };

    if (userData.role === "trainer") {
      newUser.rating = 5.0;
      newUser.studentsTaught = 0;
      newUser.competencies = userData.competencies || [
        { subject: "Cloud Architecture", proficiency: 4, certified: true }
      ];
    }

    this.data.users.unshift(newUser);
    this.saveData();
    return newUser;
  }

  // --- Credential Authenticity Verification ---
  verifyCertificate(certId) {
    const cleanId = (certId || "").trim().toUpperCase();
    if (!cleanId) return null;

    for (const u of this.data.users) {
      if (u.certificates) {
        const found = u.certificates.find(c => (c.id || "").toUpperCase() === cleanId || (c.verificationCode || "").toUpperCase() === cleanId);
        if (found) {
          return {
            isValid: true,
            certificate: found,
            recipient: {
              id: u.id,
              name: u.name,
              email: u.email,
              department: u.department,
              title: u.title
            }
          };
        }
      }
    }
    return { isValid: false, certificate: null, recipient: null };
  }

  // --- Dynamic Notifications System ---
  getNotifications() {
    return this.data.notifications || [];
  }

  markNotificationRead(notifId) {
    const notif = (this.data.notifications || []).find(n => n.id === notifId);
    if (notif) {
      notif.unread = false;
      this.saveData();
    }
  }

  markAllNotificationsRead() {
    (this.data.notifications || []).forEach(n => {
      n.unread = false;
    });
    this.saveData();
  }

  addNotification(notif) {
    if (!this.data.notifications) this.data.notifications = [];
    const newNotif = {
      id: "notif-" + Date.now().toString(36),
      title: notif.title,
      desc: notif.desc,
      time: "Just now",
      type: notif.type || "info",
      icon: notif.icon || "bell",
      color: notif.color || "#2563EB",
      bg: notif.bg || "#EFF6FF",
      unread: true
    };
    this.data.notifications.unshift(newNotif);
    this.saveData();
    return newNotif;
  }
}

// Global store singleton
const store = new Store();
