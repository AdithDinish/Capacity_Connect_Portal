/**
 * CAPACITY CONNECT - MOCK DATA REPOSITORY
 * Comprehensive enterprise dataset for Trainees, Trainers, Admin, Courses,
 * Assessments, Competency Matrix, Resources, and Announcements.
 */

const INITIAL_MOCK_DATA = {
  users: [
    {
      id: "usr-admin-01",
      name: "Eleanor Vance",
      email: "admin@capacityconnect.org",
      password: "password123",
      role: "admin",
      status: "active",
      avatar: "EV",
      department: "Enterprise Talent & Organizational Capacity Directorate",
      title: "Chief Capacity & L&D Officer",
      joinedDate: "2024-01-15",
      bio: "15+ years orchestrating digital transformations, capacity development frameworks, and enterprise competency mapping across global teams."
    },
    {
      id: "usr-trainer-01",
      name: "Dr. Marcus Vance",
      email: "marcus.vance@capacityconnect.org",
      password: "password123",
      role: "trainer",
      status: "active",
      avatar: "MV",
      department: "Cloud Architecture & Emerging Systems",
      title: "Lead Cloud Architect & Principal Instructor",
      joinedDate: "2024-03-10",
      rating: 4.9,
      studentsTaught: 340,
      bio: "Ph.D. in Distributed Systems with 12 years building hyperscale cloud topologies and enterprise machine learning platforms.",
      competencies: [
        { subject: "Cloud Architecture", proficiency: 5, certified: true },
        { subject: "Artificial Intelligence", proficiency: 5, certified: true },
        { subject: "DevSecOps", proficiency: 4, certified: true },
        { subject: "Data Governance", proficiency: 3, certified: false }
      ]
    },
    {
      id: "usr-trainer-02",
      name: "Elena Rostova",
      email: "elena.rostova@capacityconnect.org",
      password: "password123",
      role: "trainer",
      status: "active",
      avatar: "ER",
      department: "Cyber Defense & Infrastructure Integrity",
      title: "Senior Cybersecurity Consultant & Defense Specialist",
      joinedDate: "2024-04-12",
      rating: 4.8,
      studentsTaught: 285,
      bio: "Former CISO advisor specializing in Zero-Trust architectures, threat modeling, and defensive cyber readiness training.",
      competencies: [
        { subject: "Cybersecurity", proficiency: 5, certified: true },
        { subject: "DevSecOps", proficiency: 5, certified: true },
        { subject: "Cloud Architecture", proficiency: 4, certified: true },
        { subject: "Data Governance", proficiency: 4, certified: true }
      ]
    },
    {
      id: "usr-trainer-03",
      name: "David Kim",
      email: "david.kim@capacityconnect.org",
      password: "password123",
      role: "trainer",
      status: "active",
      avatar: "DK",
      department: "Strategic Transformation & Agile Frameworks",
      title: "Agile Enterprise Coach & Management Strategist",
      joinedDate: "2024-05-18",
      rating: 4.7,
      studentsTaught: 220,
      bio: "Certified Scrum Master and Lean Transformation consultant helping engineering and operational teams deliver with agility.",
      competencies: [
        { subject: "Agile Leadership", proficiency: 5, certified: true },
        { subject: "Data Governance", proficiency: 4, certified: true },
        { subject: "Cloud Architecture", proficiency: 3, certified: false },
        { subject: "Artificial Intelligence", proficiency: 3, certified: false }
      ]
    },
    {
      id: "usr-trainee-01",
      name: "Priya Sharma",
      email: "priya.sharma@capacityconnect.org",
      password: "password123",
      role: "trainee",
      status: "active",
      avatar: "PS",
      department: "Enterprise Analytics Division",
      title: "Senior Business & Data Analyst",
      joinedDate: "2025-01-20",
      bio: "Passionate about transforming operational data into strategic capacity insights, cloud migration, and modern analytics.",
      interests: ["Cloud Infrastructure", "Applied AI", "Predictive Analytics", "DevOps Foundations"],
      skills: [
        { name: "SQL & Relational Databases", level: "Expert" },
        { name: "Python for Data Analysis", level: "Advanced" },
        { name: "Cloud Computing Basics", level: "Intermediate" },
        { name: "Tableau & PowerBI", level: "Advanced" },
        { name: "Cybersecurity Essentials", level: "Intermediate" }
      ],
      qualifications: [
        { degree: "B.Tech in Computer Science & Engineering", institution: "National Institute of Technology", year: "2020" },
        { degree: "Postgraduate Diploma in Business Analytics", institution: "Indian Institute of Management", year: "2022" }
      ],
      experience: [
        { role: "Senior Data Analyst", organization: "Global Tech Solutions", period: "2022 - Present", description: "Spearheaded operational reporting pipelines and predictive KPI dashboards for 12 enterprise departments." },
        { role: "Associate Analytics Consultant", organization: "FinCore Systems", period: "2020 - 2022", description: "Designed automated ETL pipelines and supported cross-functional stakeholder training sessions." }
      ],
      certificates: [
        {
          id: "CAP-2026-CLOUD-9841",
          courseId: "crs-01",
          courseTitle: "Enterprise Cloud Architecture & Microservices",
          trainerName: "Dr. Marcus Vance",
          issueDate: "2026-08-15",
          score: 92,
          verificationCode: "CC-CERT-CLOUD-98412",
          badgeUrl: "cloud-architect.png"
        },
        {
          id: "CAP-2026-AGILE-7712",
          courseId: "crs-04",
          courseTitle: "Agile Leadership & Organizational Scalability",
          trainerName: "David Kim",
          issueDate: "2026-07-22",
          score: 88,
          verificationCode: "CC-CERT-AGILE-77128",
          badgeUrl: "agile-leader.png"
        }
      ]
    },
    {
      id: "usr-trainee-02",
      name: "Alexandre Mercier",
      email: "alex.mercier@capacityconnect.org",
      password: "password123",
      role: "trainee",
      status: "active",
      avatar: "AM",
      department: "Infrastructure Operations",
      title: "Systems & Security Specialist",
      joinedDate: "2025-02-14",
      bio: "Focusing on hardening microservices, vulnerability triage, and zero-trust perimeter implementations.",
      interests: ["Cybersecurity", "Zero-Trust", "Kubernetes Hardening"],
      skills: [
        { name: "Linux Administration", level: "Expert" },
        { name: "Network Firewalls", level: "Advanced" },
        { name: "Docker & Container Security", level: "Intermediate" }
      ],
      qualifications: [
        { degree: "B.S. in Information Systems", institution: "Sorbonne University", year: "2021" }
      ],
      experience: [
        { role: "Systems Engineer", organization: "EuroCloud Net", period: "2021 - Present", description: "Managing hybrid infrastructure and continuous integration security gates." }
      ],
      certificates: []
    },
    {
      id: "usr-trainee-03",
      name: "Fatima Al-Mansoor",
      email: "fatima.mansoor@capacityconnect.org",
      password: "password123",
      role: "trainee",
      status: "pending_approval",
      avatar: "FM",
      department: "Data Governance & Strategy",
      title: "Compliance Officer",
      joinedDate: "2026-09-28",
      bio: "Registered recently for enterprise regulatory compliance and data security capacity cohort.",
      interests: ["Data Governance", "Enterprise Compliance", "AI Ethics"],
      skills: [
        { name: "GDPR / Regulatory Compliance", level: "Advanced" },
        { name: "Risk Assessment", level: "Advanced" }
      ],
      qualifications: [
        { degree: "Master of Public Policy", institution: "Georgetown University", year: "2023" }
      ],
      experience: [],
      certificates: []
    }
  ],

  courses: [
    {
      id: "crs-01",
      title: "Enterprise Cloud Architecture & Microservices",
      subject: "Cloud Architecture",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      duration: "12 Weeks",
      level: "Advanced",
      enrolledCount: 68,
      rating: 4.9,
      reviewCount: 34,
      imageUrl: "images/courses/course-cloud-architecture.jpg",
      imageBg: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)",
      description: "Master modern distributed systems, resilient container orchestration, API gateways, and multi-region failover paradigms tailored for organizational scale.",
      prerequisites: "Familiarity with networking concepts and basic containerization.",
      syllabus: [
        { week: 1, title: "Cloud Foundations & Virtual Private Clouds" },
        { week: 2, title: "Containerization with Docker & Podman" },
        { week: 3, title: "Kubernetes Cluster Architecture & Ingress" },
        { week: 4, title: "Microservices Communication & Event-Driven Brokers" },
        { week: 5, title: "Fault-Tolerance, Circuit Breakers, & Chaos Engineering" }
      ],
      isFeatured: true,
      isNew: false
    },
    {
      id: "crs-02",
      title: "Applied AI & LLM Systems for Enterprise",
      subject: "Artificial Intelligence",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      duration: "8 Weeks",
      level: "Intermediate to Advanced",
      enrolledCount: 84,
      rating: 4.95,
      reviewCount: 42,
      imageUrl: "images/courses/course-applied-ai.jpg",
      imageBg: "linear-gradient(135deg, #4338CA 0%, #6366F1 100%)",
      description: "Design and implement production-ready Agentic AI systems, Retrieval Augmented Generation (RAG), vector databases, and enterprise governance frameworks.",
      prerequisites: "Python programming and basic machine learning intuition.",
      syllabus: [
        { week: 1, title: "Generative AI Foundations & Embeddings" },
        { week: 2, title: "Vector Databases & Semantic Search" },
        { week: 3, title: "Retrieval-Augmented Generation (RAG) Architectures" },
        { week: 4, title: "Agentic Tool Execution & Safety Guardrails" }
      ],
      isFeatured: true,
      isNew: true
    },
    {
      id: "crs-03",
      title: "Cyber Defense & Threat Intelligence Mastery",
      subject: "Cybersecurity",
      trainerId: "usr-trainer-02",
      trainerName: "Elena Rostova",
      duration: "10 Weeks",
      level: "Intermediate",
      enrolledCount: 52,
      rating: 4.85,
      reviewCount: 29,
      imageUrl: "images/courses/course-cyber-defense.jpg",
      imageBg: "linear-gradient(135deg, #065F46 0%, #10B981 100%)",
      description: "Defend organizational assets against advanced persistent threats (APTs), implement zero-trust access controls, and automate incident response.",
      prerequisites: "Basic networking protocols and Linux shell navigation.",
      syllabus: [
        { week: 1, title: "Threat Landscape & MITRE ATT&CK Framework" },
        { week: 2, title: "Zero Trust Architecture Principles" },
        { week: 3, title: "Identity, Credential Access Management (ICAM)" },
        { week: 4, title: "Security Operations & Automated Triage Playbooks" }
      ],
      isFeatured: true,
      isNew: false
    },
    {
      id: "crs-04",
      title: "Agile Leadership & Organizational Scalability",
      subject: "Agile Leadership",
      trainerId: "usr-trainer-03",
      trainerName: "David Kim",
      duration: "6 Weeks",
      level: "Foundational to Intermediate",
      enrolledCount: 73,
      rating: 4.8,
      reviewCount: 38,
      imageUrl: "images/courses/course-agile-leadership.jpg",
      imageBg: "linear-gradient(135deg, #9A3412 0%, #F97316 100%)",
      description: "Lead agile transformations across large teams, cultivate high-performing psychological safety, and streamline value-stream delivery models.",
      prerequisites: "None; designed for team leads, project managers, and aspiring coaches.",
      syllabus: [
        { week: 1, title: "The Agile Mindset & Value Stream Mapping" },
        { week: 2, title: "Scrum & Kanban in Matrixed Organizations" },
        { week: 3, title: "Servant Leadership & Removing Systemic Blockers" },
        { week: 4, title: "Scaling Agile Across Enterprise Business Units" }
      ],
      isFeatured: false,
      isNew: false
    },
    {
      id: "crs-05",
      title: "Enterprise Data Governance & Regulatory Compliance",
      subject: "Data Governance",
      trainerId: "usr-trainer-03",
      trainerName: "David Kim",
      duration: "8 Weeks",
      level: "Intermediate",
      enrolledCount: 39,
      rating: 4.65,
      reviewCount: 19,
      imageUrl: "images/courses/course-data-governance.jpg",
      imageBg: "linear-gradient(135deg, #155E75 0%, #06B6D4 100%)",
      description: "Establish metadata cataloging, data lineage, privacy by design, and strict audit compliance under GDPR, HIPAA, and ISO/IEC 27001.",
      prerequisites: "Understanding of database systems and enterprise data flows.",
      syllabus: [
        { week: 1, title: "Data Lineage & Modern Metadata Catalogs" },
        { week: 2, title: "Privacy Engineering & Consent Management" },
        { week: 3, title: "Data Quality Metrics & Automated Auditing" },
        { week: 4, title: "Governing Machine Learning Models & Training Data" }
      ],
      isFeatured: false,
      isNew: true
    },
    {
      id: "crs-06",
      title: "Full-Stack DevSecOps & CI/CD Pipeline Automation",
      subject: "DevSecOps",
      trainerId: "usr-trainer-02",
      trainerName: "Elena Rostova",
      duration: "8 Weeks",
      level: "Advanced",
      enrolledCount: 46,
      rating: 4.8,
      reviewCount: 22,
      imageUrl: "images/courses/course-devsecops.jpg",
      imageBg: "linear-gradient(135deg, #3730A3 0%, #4F46E5 100%)",
      description: "Embed automated static analysis (SAST), software composition analysis (SCA), and dynamic testing (DAST) directly into git workflows.",
      prerequisites: "Git proficiency and familiarity with script automation.",
      syllabus: [
        { week: 1, title: "Shift-Left Security & Infrastructure as Code (Terraform)" },
        { week: 2, title: "Automated Vulnerability Scanning & SBOM Generation" },
        { week: 3, title: "Secrets Management with HashiCorp Vault" },
        { week: 4, title: "Continuous Verification & Compliance Monitoring" }
      ],
      isFeatured: false,
      isNew: true
    }
  ],

  enrollments: [
    {
      id: "enr-01",
      traineeId: "usr-trainee-01",
      courseId: "crs-01",
      enrolledDate: "2026-06-01",
      progress: 100,
      status: "completed",
      completedDate: "2026-08-15",
      finalScore: 92
    },
    {
      id: "enr-02",
      traineeId: "usr-trainee-01",
      courseId: "crs-02",
      enrolledDate: "2026-09-01",
      progress: 65,
      status: "in_progress",
      completedDate: null,
      finalScore: null
    },
    {
      id: "enr-03",
      traineeId: "usr-trainee-01",
      courseId: "crs-04",
      enrolledDate: "2026-06-15",
      progress: 100,
      status: "completed",
      completedDate: "2026-07-22",
      finalScore: 88
    },
    {
      id: "enr-04",
      traineeId: "usr-trainee-02",
      courseId: "crs-03",
      enrolledDate: "2026-08-10",
      progress: 45,
      status: "in_progress",
      completedDate: null,
      finalScore: null
    }
  ],

  assessments: [
    {
      id: "asm-01",
      courseId: "crs-01",
      subject: "Cloud Architecture",
      title: "Enterprise Cloud Architecture Benchmark Examination",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      timeLimitMinutes: 15,
      passingScore: 70,
      deadline: "2026-10-31",
      totalAttempts: 48,
      avgScore: 82,
      description: "Comprehensive MCQ assessment covering distributed fault tolerance, microservice communication, container orchestration, and multi-region resilience.",
      questions: [
        {
          id: "q1",
          question: "Which pattern is primarily utilized to prevent cascading service failures in a distributed microservices topology when a downstream dependency times out?",
          options: [
            "A) CQRS (Command Query Responsibility Segregation)",
            "B) Circuit Breaker Pattern",
            "C) Two-Phase Commit Protocol",
            "D) Saga Orchestration Pattern"
          ],
          correctIndex: 1,
          explanation: "The Circuit Breaker pattern detects failures and encapsulates the logic of preventing a failure from constantly recurring during maintenance, temporary external system failure or unexpected system difficulties."
        },
        {
          id: "q2",
          question: "When architecting an Active-Active multi-region deployment on AWS/GCP, what is the primary consideration regarding database write replication?",
          options: [
            "A) CAP theorem tradeoffs: Eventual Consistency vs Latency and Split-Brain conflicts",
            "B) Microservices cannot span across availability zones",
            "C) DNS latency renders Active-Active writes impossible",
            "D) Stateless services require centralized sticky session cookies"
          ],
          correctIndex: 0,
          explanation: "In multi-region active-active architectures, data synchronization must navigate the CAP theorem: synchronous cross-region writes incur significant latency, while asynchronous writes risk conflict resolution and eventual consistency."
        },
        {
          id: "q3",
          question: "What is the primary architectural function of an Ingress Controller in a Kubernetes enterprise cluster?",
          options: [
            "A) To manage container storage volumes on physical host nodes",
            "B) To act as a specialized reverse proxy routing external HTTP/HTTPS traffic to cluster services based on rules",
            "C) To schedule cron jobs across worker nodes",
            "D) To encrypt etcd key-value pairs at rest"
          ],
          correctIndex: 1,
          explanation: "An Ingress Controller fulfills Ingress configurations by configuring a Layer 7 load balancer (like Envoy or NGINX) to route external traffic to internal Kubernetes Service objects."
        },
        {
          id: "q4",
          question: "In asynchronous event-driven architectures, which guarantee ensures that a consumer processes every single message even under transient network disconnects?",
          options: [
            "A) At-least-once delivery with idempotent consumer handling",
            "B) Zero-allocation FIFO streaming without acknowledgments",
            "C) Synchronous REST Webhooks",
            "D) Polling with random exponential backoff without persistence"
          ],
          correctIndex: 0,
          explanation: "At-least-once delivery combined with idempotent message processing guarantees that events are not lost and duplicate deliveries do not corrupt system state."
        },
        {
          id: "q5",
          question: "Which metric is the golden standard indicator of system health under Google's Site Reliability Engineering (SRE) principles?",
          options: [
            "A) Raw CPU utilization spikes",
            "B) Four Golden Signals: Latency, Traffic, Errors, and Saturation",
            "C) Number of pull requests merged per sprint",
            "D) Total bytes written to backup storage"
          ],
          correctIndex: 1,
          explanation: "The four golden signals of monitoring are latency, traffic, errors, and saturation. Measuring these provides direct insight into user experience and system capacity."
        }
      ]
    },
    {
      id: "asm-02",
      courseId: "crs-02",
      subject: "Artificial Intelligence",
      title: "Applied AI & RAG Enterprise Architecture Assessment",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      timeLimitMinutes: 15,
      passingScore: 70,
      deadline: "2026-11-15",
      totalAttempts: 56,
      avgScore: 85,
      description: "Evaluates knowledge of embedding generation, vector indexing strategies (HNSW, IVF), chunking heuristics, and Agent tool guardrails.",
      questions: [
        {
          id: "q2_1",
          question: "In a Retrieval-Augmented Generation (RAG) system, why is semantic chunking often superior to fixed-token character chunking?",
          options: [
            "A) It eliminates the need for vector databases entirely",
            "B) It preserves coherent logical context, sentence boundaries, and topic transitions within embeddings",
            "C) It decreases LLM token costs by a fixed 50%",
            "D) It converts unformatted text into relational SQL tables"
          ],
          correctIndex: 1,
          explanation: "Semantic chunking breaks documents based on semantic shifts and structural boundaries rather than arbitrary character lengths, leading to higher retrieval precision."
        },
        {
          id: "q2_2",
          question: "What is the primary role of a 'Re-ranking' stage (e.g., Cohere Rerank or BGE Reranker) following initial bi-encoder vector similarity search?",
          options: [
            "A) Cross-encoder scoring to evaluate deep token-level relevance between query and retrieved context",
            "B) To compress retrieved chunks into gzip format",
            "C) To execute prompt caching inside the client browser",
            "D) To replace vector embeddings with BM25 keyword matching"
          ],
          correctIndex: 0,
          explanation: "Bi-encoders retrieve top candidates quickly via approximate nearest neighbor search; cross-encoder re-rankers perform full attention across query and passage pairs to dramatically improve relevance ranking."
        },
        {
          id: "q2_3",
          question: "Which safety mechanism prevents an Agentic AI workflow from executing unauthorized arbitrary database deletion commands?",
          options: [
            "A) Prompting the model with 'Please do not delete data'",
            "B) Strict Tool Parameter Schema Validation, Least-Privilege IAM execution roles, and Human-in-the-Loop confirmation checkpoints",
            "C) Increasing model temperature to 1.0",
            "D) Using a larger context window"
          ],
          correctIndex: 1,
          explanation: "Deterministic guardrails, least privilege system permissions, and mandatory human confirmation gates for destructive actions are fundamental enterprise safety standards."
        },
        {
          id: "q2_4",
          question: "What index data structure is most widely adopted by modern vector databases (Milvus, Pinecone, Qdrant) for high-recall Approximate Nearest Neighbor search?",
          options: [
            "A) B-Tree",
            "B) HNSW (Hierarchical Navigable Small World)",
            "C) Red-Black Tree",
            "D) Linear Hash Table"
          ],
          correctIndex: 1,
          explanation: "HNSW builds multi-layer proximity graphs providing logarithmic search complexity and very high recall for high-dimensional vector embeddings."
        },
        {
          id: "q2_5",
          question: "In enterprise LLM deployment, what is 'Hallucination Mitigation' primarily achieved through?",
          options: [
            "A) Fine-tuning exclusively on synthetic data",
            "B) Grounding generation in verified enterprise knowledge retrieval with citation attribution and output validation",
            "C) Running the prompt three times and choosing the longest output",
            "D) Removing all system instructions"
          ],
          correctIndex: 1,
          explanation: "Retrieval grounding, strict context adherence prompts, and automated citation checking ensure model responses remain factually tethered to trusted corporate documents."
        }
      ]
    },
    {
      id: "asm-03",
      courseId: "crs-03",
      subject: "Cybersecurity",
      title: "Zero-Trust Infrastructure & Threat Modeling Evaluation",
      trainerId: "usr-trainer-02",
      trainerName: "Elena Rostova",
      timeLimitMinutes: 15,
      passingScore: 75,
      deadline: "2026-10-25",
      totalAttempts: 39,
      avgScore: 78,
      description: "Assess competencies in zero-trust perimeter enforcement, micro-segmentation, identity verification, and MITRE ATT&CK mitigation.",
      questions: [
        {
          id: "q3_1",
          question: "What is the foundational principle underlying the Zero Trust Security Model (NIST SP 800-207)?",
          options: [
            "A) Trust internal network entities once past the perimeter firewall",
            "B) Never trust, always verify every request regardless of origin",
            "C) Restrict all access exclusively to VPN tunnels",
            "D) Store all passwords in hashed files on local endpoints"
          ],
          correctIndex: 1,
          explanation: "Zero Trust assumes no implicit trust granted to assets or user accounts based solely on physical or network location. Continuous authentication and least-privilege access are required."
        },
        {
          id: "q3_2",
          question: "What does the technique of 'Micro-segmentation' accomplish within enterprise data centers?",
          options: [
            "A) Splits large hard drives into smaller logical partitions",
            "B) Creates granular security zones and restricts lateral movement of attackers across workloads",
            "C) Reduces the size of TCP packets to save bandwidth",
            "D) Backs up server images every hour"
          ],
          correctIndex: 1,
          explanation: "Micro-segmentation isolates workloads from one another and applies security policies per workload, preventing threat actors from moving laterally if one machine is compromised."
        },
        {
          id: "q3_3",
          question: "In the MITRE ATT&CK framework, what is the key difference between a Tactic and a Technique?",
          options: [
            "A) Tactics represent adversary goals (the 'Why'), while Techniques represent the specific mechanism (the 'How')",
            "B) Tactics are for software developers; Techniques are for legal teams",
            "C) Tactics apply only to Linux, while Techniques apply only to Windows",
            "D) Tactics are hardware-based, while Techniques are software-based"
          ],
          correctIndex: 0,
          explanation: "Tactics describe the tactical objective of an adversary (e.g., Initial Access, Persistence), whereas Techniques describe the exact technical method used to achieve that tactic."
        },
        {
          id: "q3_4",
          question: "What cryptographic property ensures that past communications cannot be decrypted even if the server's private key is compromised in the future?",
          options: [
            "A) Symmetric DES encryption",
            "B) Forward Secrecy (Perfect Forward Secrecy / PFS via Ephemeral Diffie-Hellman)",
            "C) MD5 Checksumming",
            "D) Base64 Encoding"
          ],
          correctIndex: 1,
          explanation: "Forward Secrecy uses ephemeral session keys during the TLS handshake so that compromise of long-term server private keys does not reveal historical intercepted traffic."
        },
        {
          id: "q3_5",
          question: "Which of the following is considered an effective mitigation against Software Supply Chain attacks (e.g., SolarWinds style)?",
          options: [
            "A) Relying solely on open source public repositories without checks",
            "B) Implementing Software Bill of Materials (SBOM), cryptographic artifact signing (Sigstore/Cosign), and reproducible builds",
            "C) Turning off package managers completely",
            "D) Sharing root credentials with package authors"
          ],
          correctIndex: 1,
          explanation: "Maintaining an SBOM, verifying package signatures, scanning for known CVEs, and pinning build dependencies prevents malicious tampering in build pipelines."
        }
      ]
    },
    {
      id: "asm-04",
      courseId: "crs-04",
      subject: "Agile Leadership",
      title: "Agile Frameworks & Organizational Scalability Exam",
      trainerId: "usr-trainer-03",
      trainerName: "David Kim",
      timeLimitMinutes: 10,
      passingScore: 65,
      deadline: "2026-11-20",
      totalAttempts: 64,
      avgScore: 88,
      description: "Tests mastery of sprint retrospectives, WIP limits, cross-functional velocity measurement, and psychological safety.",
      questions: [
        {
          id: "q4_1",
          question: "In Kanban systems, what is the primary objective of enforcing explicit Work-In-Progress (WIP) limits?",
          options: [
            "A) To ensure team members work overtime",
            "B) To expose process bottlenecks, reduce multitasking, and maximize overall throughput of completed value",
            "C) To limit the number of clients an organization can serve",
            "D) To enforce rigid 2-week calendar deadlines"
          ],
          correctIndex: 1,
          explanation: "Limiting WIP prevents overburdening team capacity, reduces context switching, and exposes system impediments so work flows smoothly from start to finish."
        },
        {
          id: "q4_2",
          question: "What is the primary purpose of the Sprint Retrospective in the Scrum framework?",
          options: [
            "A) To showcase finished software features to executive stakeholders",
            "B) For the Scrum Team to inspect itself regarding individuals, interactions, processes, and tools, and adapt with actionable improvements",
            "C) To calculate billable hours and financial payroll",
            "D) To assign individual blame for missed sprint backlog tasks"
          ],
          correctIndex: 1,
          explanation: "The Retrospective provides a structured, blameless inspection of team collaboration and processes to continuously adapt and increase team effectiveness."
        },
        {
          id: "q4_3",
          question: "What characterizes an effective Servant Leader in an agile organizational environment?",
          options: [
            "A) Dictating daily tasks and micro-managing commit logs",
            "B) Empowering team autonomy, clearing organizational impediments, and fostering psychological safety",
            "C) Eliminating all communication between engineers and customers",
            "D) Preventing changes to specifications once agreed upon"
          ],
          correctIndex: 1,
          explanation: "Servant leaders focus on serving team members by removing organizational roadblocks, fostering psychological safety, and coaching self-organizing teams."
        }
      ]
    }
  ],

  assessmentAttempts: [
    {
      id: "att-01",
      assessmentId: "asm-01",
      traineeId: "usr-trainee-01",
      traineeName: "Priya Sharma",
      subject: "Cloud Architecture",
      score: 92,
      passed: true,
      submittedAt: "2026-08-15 14:32",
      timeTakenMinutes: 11
    },
    {
      id: "att-02",
      assessmentId: "asm-04",
      traineeId: "usr-trainee-01",
      traineeName: "Priya Sharma",
      subject: "Agile Leadership",
      score: 88,
      passed: true,
      submittedAt: "2026-07-22 10:15",
      timeTakenMinutes: 8
    },
    {
      id: "att-03",
      assessmentId: "asm-03",
      traineeId: "usr-trainee-02",
      traineeName: "Alexandre Mercier",
      subject: "Cybersecurity",
      score: 82,
      passed: true,
      submittedAt: "2026-09-12 16:45",
      timeTakenMinutes: 13
    }
  ],

  resources: [
    {
      id: "res-01",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      subject: "Cloud Architecture",
      courseId: "crs-01",
      type: "video",
      title: "Masterclass: Multi-Region Active-Active Cloud Architecture",
      duration: "45 mins",
      fileSize: "720 MB",
      uploadDate: "2026-08-01",
      url: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
      description: "Deep dive into cross-region data replication, quorum consistency, latency mitigation, and routing topologies.",
      downloads: 142
    },
    {
      id: "res-02",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      subject: "Artificial Intelligence",
      courseId: "crs-02",
      type: "presentation",
      title: "Agentic AI Architectures & Vector Store Design Deck",
      slideCount: 42,
      fileSize: "18.5 MB",
      uploadDate: "2026-08-20",
      description: "Comprehensive slide deck detailing bi-encoder embeddings, cross-encoder rerankers, and LangGraph agent topologies.",
      downloads: 210
    },
    {
      id: "res-03",
      trainerId: "usr-trainer-01",
      trainerName: "Dr. Marcus Vance",
      subject: "Cloud Architecture",
      courseId: "crs-01",
      type: "document",
      title: "Kubernetes Production Hardening & Disaster Recovery Playbook",
      format: "PDF",
      fileSize: "4.2 MB",
      uploadDate: "2026-08-10",
      description: "Official enterprise standard operating procedure for etcd snapshots, cluster upgrades, and pod security admission standards.",
      downloads: 320
    },
    {
      id: "res-04",
      trainerId: "usr-trainer-02",
      trainerName: "Elena Rostova",
      subject: "Cybersecurity",
      courseId: "crs-03",
      type: "video",
      title: "Zero Trust Architecture: Identity as the New Perimeter",
      duration: "52 mins",
      fileSize: "840 MB",
      uploadDate: "2026-08-25",
      description: "Technical walk-through of micro-segmentation, continuous authentication policies, and mutual TLS enforcement.",
      downloads: 178
    },
    {
      id: "res-05",
      trainerId: "usr-trainer-02",
      trainerName: "Elena Rostova",
      subject: "DevSecOps",
      courseId: "crs-06",
      type: "document",
      title: "CI/CD Pipeline Security Checklist & Policy as Code Guide",
      format: "PDF",
      fileSize: "2.8 MB",
      uploadDate: "2026-09-02",
      description: "Practical reference implementation for automated Open Policy Agent (OPA) checks and Cosign artifact verification.",
      downloads: 265
    },
    {
      id: "res-06",
      trainerId: "usr-trainer-03",
      trainerName: "David Kim",
      subject: "Agile Leadership",
      courseId: "crs-04",
      type: "presentation",
      title: "Scaling Agile in Matrixed Enterprise Organizations",
      slideCount: 36,
      fileSize: "14.2 MB",
      uploadDate: "2026-07-15",
      description: "Strategic frameworks for executive alignment, team topology design, and cross-department dependency tracking.",
      downloads: 195
    }
  ],

  competencyMatrix: [
    {
      subject: "Cloud Architecture",
      category: "Engineering & Infrastructure",
      requiredSkillLevel: "Expert",
      organizationDemand: "High",
      traineesEnrolled: 68,
      trainerCoverageStatus: "adequate",
      trainersQualified: [
        {
          trainerId: "usr-trainer-01",
          trainerName: "Dr. Marcus Vance",
          proficiency: 5,
          experienceYears: 12,
          certifications: ["AWS Solutions Architect Pro", "Google Cloud Fellow"],
          availability: "Available",
          matchScore: 98
        },
        {
          trainerId: "usr-trainer-02",
          trainerName: "Elena Rostova",
          proficiency: 4,
          experienceYears: 10,
          certifications: ["Certified Kubernetes Security Specialist"],
          availability: "Available",
          matchScore: 86
        },
        {
          trainerId: "usr-trainer-03",
          trainerName: "David Kim",
          proficiency: 3,
          experienceYears: 7,
          certifications: ["Cloud Practitioner"],
          availability: "Limited",
          matchScore: 68
        }
      ]
    },
    {
      subject: "Artificial Intelligence",
      category: "Emerging Tech & Data Science",
      requiredSkillLevel: "Expert",
      organizationDemand: "Critical",
      traineesEnrolled: 84,
      trainerCoverageStatus: "gap",
      trainersQualified: [
        {
          trainerId: "usr-trainer-01",
          trainerName: "Dr. Marcus Vance",
          proficiency: 5,
          experienceYears: 11,
          certifications: ["Ph.D. Distributed AI", "DeepLearning.AI Certified"],
          availability: "Available",
          matchScore: 99
        },
        {
          trainerId: "usr-trainer-03",
          trainerName: "David Kim",
          proficiency: 3,
          experienceYears: 4,
          certifications: ["AI Product Strategy"],
          availability: "Available",
          matchScore: 64
        }
      ]
    },
    {
      subject: "Cybersecurity",
      category: "Security & Risk Management",
      requiredSkillLevel: "Expert",
      organizationDemand: "High",
      traineesEnrolled: 52,
      trainerCoverageStatus: "adequate",
      trainersQualified: [
        {
          trainerId: "usr-trainer-02",
          trainerName: "Elena Rostova",
          proficiency: 5,
          experienceYears: 13,
          certifications: ["CISSP", "CISM", "GIAC Security Expert"],
          availability: "Available",
          matchScore: 99
        },
        {
          trainerId: "usr-trainer-01",
          trainerName: "Dr. Marcus Vance",
          proficiency: 4,
          experienceYears: 9,
          certifications: ["Cloud Security Specialist"],
          availability: "Limited",
          matchScore: 82
        }
      ]
    },
    {
      subject: "Agile Leadership",
      category: "Management & Transformation",
      requiredSkillLevel: "Advanced",
      organizationDemand: "Moderate",
      traineesEnrolled: 73,
      trainerCoverageStatus: "surplus",
      trainersQualified: [
        {
          trainerId: "usr-trainer-03",
          trainerName: "David Kim",
          proficiency: 5,
          experienceYears: 14,
          certifications: ["Certified Scrum Trainer (CST)", "SAFe Program Consultant"],
          availability: "Available",
          matchScore: 97
        },
        {
          trainerId: "usr-trainer-02",
          trainerName: "Elena Rostova",
          proficiency: 3,
          experienceYears: 6,
          certifications: ["Agile Project Lead"],
          availability: "Available",
          matchScore: 72
        }
      ]
    },
    {
      subject: "Data Governance",
      category: "Governance & Compliance",
      requiredSkillLevel: "Advanced",
      organizationDemand: "Critical",
      traineesEnrolled: 39,
      trainerCoverageStatus: "gap",
      trainersQualified: [
        {
          trainerId: "usr-trainer-02",
          trainerName: "Elena Rostova",
          proficiency: 4,
          experienceYears: 8,
          certifications: ["CIPP/E Data Privacy Professional"],
          availability: "Limited",
          matchScore: 85
        },
        {
          trainerId: "usr-trainer-03",
          trainerName: "David Kim",
          proficiency: 4,
          experienceYears: 7,
          certifications: ["Enterprise Governance Frameworks"],
          availability: "Available",
          matchScore: 84
        }
      ]
    },
    {
      subject: "DevSecOps",
      category: "Engineering & Infrastructure",
      requiredSkillLevel: "Expert",
      organizationDemand: "High",
      traineesEnrolled: 46,
      trainerCoverageStatus: "adequate",
      trainersQualified: [
        {
          trainerId: "usr-trainer-02",
          trainerName: "Elena Rostova",
          proficiency: 5,
          experienceYears: 10,
          certifications: ["DevSecOps Professional", "HashiCorp Vault Certified"],
          availability: "Available",
          matchScore: 98
        },
        {
          trainerId: "usr-trainer-01",
          trainerName: "Dr. Marcus Vance",
          proficiency: 4,
          experienceYears: 8,
          certifications: ["Docker & Kubernetes Certified"],
          availability: "Available",
          matchScore: 87
        }
      ]
    }
  ],

  announcements: [
    {
      id: "ann-01",
      title: "Q4 2026 Enterprise Digital Competency Drive Launched",
      type: "URGENT",
      badge: "Priority",
      date: "2026-09-29",
      target: "All Staff",
      content: "All engineering and analytics divisions are invited to enroll in the newly updated Cloud Architecture and Applied AI certification pathways. Cohort deadlines close Oct 31."
    },
    {
      id: "ann-02",
      title: "New Zero-Trust Assessment Suite Added to Trainer Library",
      type: "NEW_CONTENT",
      badge: "Learning Update",
      date: "2026-09-25",
      target: "Trainees",
      content: "Trainer Elena Rostova has published the interactive Zero-Trust evaluation framework with practical micro-segmentation scenarios."
    },
    {
      id: "ann-03",
      title: "Quarterly Capacity Building Forum & Trainer Town Hall",
      type: "EVENT",
      badge: "Live Event",
      date: "2026-10-14",
      target: "Trainers & Admins",
      content: "Join the executive panel discussing organizational competency mapping, skill gap triage, and AI-assisted curriculum authoring."
    }
  ],

  achievements: [
    {
      id: "ach-01",
      recipientName: "Priya Sharma",
      department: "Enterprise Analytics Division",
      awardTitle: "Distinguished Cloud Capacity Champion",
      score: "92% Score",
      date: "August 2026",
      avatar: "PS",
      testimonial: "The structured microservices curriculum and assessment feedback enabled our team to redesign our data pipeline with zero downtime."
    },
    {
      id: "ach-02",
      recipientName: "Alexandre Mercier",
      department: "Infrastructure Operations",
      awardTitle: "Excellence in Defensive Cyber Readiness",
      score: "82% Score",
      date: "September 2026",
      avatar: "AM",
      testimonial: "The practical threat modeling scenarios prepared our operations group for rigorous SOC 2 Type II audit readiness."
    },
    {
      id: "ach-03",
      recipientName: "Kavita Reddy",
      department: "Product Transformation Unit",
      awardTitle: "Agile Scalability Pioneer",
      score: "95% Score",
      date: "July 2026",
      avatar: "KR",
      testimonial: "Implementing WIP limits and value-stream retrospectives boosted sprint velocity across our 4 cross-functional squads by 35%."
    }
  ],

  feedbacks: [
    {
      id: "fb-01",
      courseId: "crs-01",
      traineeId: "usr-trainee-01",
      traineeName: "Priya Sharma",
      rating: 5,
      ratingsBreakdown: {
        instructorClarity: 5,
        courseDepth: 5,
        practicalApplicability: 5
      },
      comment: "Dr. Vance presents complex distributed concepts with crystal clarity. The practical labs on circuit breakers and multi-region failover were invaluable.",
      date: "2026-08-16"
    },
    {
      id: "fb-02",
      courseId: "crs-04",
      traineeId: "usr-trainee-01",
      traineeName: "Priya Sharma",
      rating: 5,
      ratingsBreakdown: {
        instructorClarity: 5,
        courseDepth: 4,
        practicalApplicability: 5
      },
      comment: "David Kim brought real-world agile coaching examples that we implemented immediately in our analytics retrospectives.",
      date: "2026-07-23"
    }
  ]
};
