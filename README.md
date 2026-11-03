# OnCampus 🎓

> **Your Campus. Your Skills. Your Opportunities.**

OnCampus is a full-stack student freelancing marketplace, campus project collaboration hub, portfolio network, and institutional administrative command center. Built for students, campus communities, and clients seeking verified student talent.

---

## 🚀 Live Servers & Quick Links

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Database**: MongoDB Atlas or Local MongoDB (`mongodb://127.0.0.1:27017/oncampus`)

---

## 🔑 Demo Credentials

### Administrator Account (Full Platform Access)
- **Email:** `admin@oncampus.com`
- **Password:** `Admin123!`
- **Access:** Complete Admin Command Center, User Moderation, Verification, Marketplace Control, Portal Lifecycle, Safety Desk, Analytics, and Audit Logs.

### Student Accounts
All student accounts use the default password: `Password123!`

| Name | Email | University | Specialization |
|------|-------|------------|----------------|
| **Aarav Sharma** | `aarav.sharma@iitd.ac.in` | IIT Delhi | Full-Stack MERN & Cloud Architecture |
| **Priya Patel** | `priya.patel@bits.ac.in` | BITS Pilani | UI/UX & Product Design (Figma, Design Systems) |
| **Rohan Gupta** | `rohan.gupta@iitb.ac.in` | IIT Bombay | Flutter & Mobile Engineering |
| **Ananya Iyer** | `ananya.iyer@du.ac.in` | Delhi University | Academic Research & Technical Writing |
| **Vikram Malhotra** | `vikram.malhotra@iitm.ac.in` | IIT Madras | Data Analytics, Python & ML Models |
| **Sneha Reddy** | `sneha.reddy@nitw.ac.in` | NIT Warangal | 4K Video Editing & Motion Graphics |
| **Kabir Mehta** | `kabir.mehta@srcc.du.ac.in` | SRCC Delhi | Business Presentations & Pitch Decks |
| **Diya Sen** | `diya.sen@ju.ac.in` | Jadavpur University | Discrete Math & Data Structures Tutoring |

---

## ✨ Key Features & User Workflows

### 1. Student Freelancing Marketplace (`/services`)
- **Browse & Discovery:** Filter by 12 academic/tech categories, pricing model (fixed, hourly, negotiable), price range (₹), and sorting (newest, highest rated, price).
- **Service Details (`/services/:id`):** Multi-image showcase gallery, delivery duration in days, skills/tech badges, provider background, and peer ratings.
- **Publish & Manage (`/services/new`, `/services/:id/edit`):** Rich listing creation with image URLs, scope of work description, tags, and pricing tiers.
- **Instant Order Checkout:** Order modal capturing custom client requirements with real-time status initialization.

### 2. Peer Collaboration & Project Hub (`/projects`)
- **Discover Projects (`/projects`):** Discover student projects, research initiatives, hackathon teams, and paid student hiring.
- **Project Specifications (`/projects/:id`):** View team size capacity, estimated milestones, budget range, and current active team members.
- **Apply to Team:** Direct application modal with custom introduction, portfolio links, and skill pitch.
- **Owner Review Desk:** Project owners can review applicant pitches and accept or decline team join requests.

### 3. Student Identity & Portfolio (`/users/:id`, `/profile/edit`)
- **Public Profile:** Verified student badge, university, department, graduation year, and direct links to GitHub, LinkedIn, Twitter/X, and personal websites.
- **Tabs:** Active services list, Portfolio case studies gallery with preview links, Academic background timeline, and verified client testimonials.
- **Profile Editor:** Multi-tab settings to update personal details, bio, avatar photo, skill endorsements, education history, and portfolio items.

### 4. Order Management & Workspace (`/orders`, `/orders/:id`)
- **Milestone Stepper Pipeline:** Real-time lifecycle tracking across 5 steps: `Pending` → `Accepted` → `In Progress` → `Delivered` → `Completed`.
- **Role-Aware Actions:**
  - *Provider:* Accept/Decline incoming orders, Start Work (in-progress), Mark Deliverables Delivered.
  - *Client:* Approve deliverables & complete order, Cancel order.
- **Order Workspace Chat:** Contextual messaging thread inside the order page for asset delivery, links, and revisions.
- **Review & Ratings:** 5-star scoring and written feedback submitted upon order completion, recalculating the provider's overall score.

### 5. Campus Chat & Direct Messaging (`/messages`)
- Real-time split-screen chat interface with responsive conversation drawer.
- Search any student across the platform to start a direct message thread.
- Auto-polling for instant message sync and automatic scroll-to-bottom.

### 6. Platform-Wide Dark Mode
- Seamless light and dark mode toggle powered by Tailwind CSS `darkMode: 'class'` and Zustand store.
- Apple-inspired minimalist dark palette (`#0c0c0e` canvas, `#161617` elevated cards, `#1c1c1e` inputs/textareas, `#0071e3` accent).
- Full contrast and readability across **100% of pages**: Landing, Login/Register, Dashboard, Browse, Details, Orders, Messaging, Profile, and the entire Admin Command Center.

---

## 🛡️ OnCampus Admin Command Center (`/admin`)

The administrative system is an enterprise-grade operational command center designed to monitor, moderate, and manage the platform in real time:

| Section | Route | Capabilities |
|---|---|---|
| **Overview Dashboard** | `/admin` | Real-time database KPI cards (Registered Students, Active Services, Projects, Completed Orders, Open Disputes), needs-attention alerts, and recent platform activity feed. |
| **Platform Analytics** | `/admin/analytics` | Interactive charts (Recharts) covering student growth, project creation, order volume, service categories, and revenue distribution with flexible time windows (7d, 30d, 90d, 12m). |
| **Student Directory** | `/admin/users` | Complete student table with search, university/department filters, profile inspector modal, account suspension, reactivation, and cascade visibility toggles. |
| **Student Verification** | `/admin/verification` | Student identity review queue with institutional document checks, one-click verification approval, rejection, or info requests with recorded audit reasons. |
| **Suspended Accounts** | `/admin/suspended` | Isolation center for suspended accounts, tracking suspension dates, violation causes, and account reactivation workflows. |
| **Projects Management** | `/admin/projects` | Monitor campus projects, inspect team capacity, unpublish, archive, restore, or remove policy-violating collaborations. |
| **Services Management** | `/admin/services` | Audit service listings, inspect pricing models, enforce quality standards, unpublish, archive, or remove listings. |
| **Orders Management** | `/admin/orders` | Comprehensive order oversight, lifecycle monitoring, financial amounts, and dispute escalation handling. |
| **Disputes Center** | `/admin/disputes` | Manage and resolve client/provider order disputes with evidence review, refund authorization, or order settlement. |
| **Portal Management** | `/admin/portal` | **Core Content Control:** Control what appears on the student-facing portal across Services, Projects, and Users. Supports consistent lifecycle states (`Draft`, `Published`, `Hidden`, `Archived`, `Removed`) with bulk actions and automatic cascade unlisting for suspended users. |
| **Reported Content Desk** | `/admin/reports` | Central safety moderation queue to review reported users, services, or projects, with dismissal or disciplinary action taking. |
| **Archived Content** | `/admin/archived` | View and restore soft-deleted or archived marketplace records without losing historical relational data. |
| **Platform Health** | `/admin/health` | Live system diagnostics: MongoDB connection latency, memory usage, server uptime, and REST API response times. |
| **Announcements** | `/admin/announcements` | Broadcast campus-wide banners and important operational updates to all enrolled students. |
| **Notifications Desk** | `/admin/notifications` | Monitor platform notification delivery and dispatch targeted administrative alerts. |
| **Audit Logs** | `/admin/audit-logs` | Tamper-evident log of all administrative actions, recording Administrator ID, target resource, action type, IP, and timestamps. |
| **Roles & Permissions** | `/admin/roles` | Granular role-based access control (Super Admin, Moderator, Trust & Safety) managing dashboard permissions. |
| **Admin Settings** | `/admin/settings` | Platform configurations, fee percentages, auto-moderation keywords, and maintenance mode toggles. |

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS, React Router v6 |
| **State & Data Fetching** | Zustand, Axios (with interceptors & token refresh) |
| **Charts & Visuals** | Recharts, Lucide React, Three.js / React Three Fiber / Drei |
| **Forms & Validation** | React Hook Form, Zod |
| **Backend API** | Node.js (ES modules), Express.js |
| **Database & ODM** | MongoDB Atlas / Local MongoDB, Mongoose 8 |
| **Authentication & Security** | JWT (Access Tokens + Refresh Tokens), bcryptjs, CORS |
| **File Uploads** | Multer |

---

## 📁 Project Architecture

```text
oncampus/
├── client/
│   ├── src/
│   │   ├── components/       # Avatar, Badge, ConfirmDialog, Navbar, Footer, ServiceCard, ProjectCard...
│   │   │   └── admin/        # AdminLayout, AdminCharts
│   │   ├── hooks/            # useToast
│   │   ├── lib/              # Axios instance with auth interceptors
│   │   ├── pages/            # Landing, Login, Register, Dashboard, ServiceBrowse, ProjectBrowse...
│   │   │   └── admin/        # 18 Admin Command Center pages (Dashboard, Portal, Analytics, Users, etc.)
│   │   ├── store/            # Zustand stores (authStore, themeStore, notificationStore)
│   │   ├── App.jsx           # Application routing, admin guard, dark mode provider
│   │   └── main.jsx          # React DOM entry
│   └── package.json
└── server/
    ├── src/
    │   ├── controllers/      # auth, user, service, project, order, message, review, admin, notification
    │   ├── middleware/       # JWT auth, admin authorization, Multer upload, Zod validator
    │   ├── models/           # User, Service, Project, Order, Conversation, Message, Review, Report, AuditLog
    │   ├── routes/           # REST endpoints (/api/auth, /api/services, /api/admin, etc.)
    │   ├── utils/            # JWT helpers, response formatters, seed data
    │   ├── db.js             # Mongoose MongoDB connection
    │   ├── index.js          # Express app entry point
    │   └── seed.js           # Database seeder with realistic campus demo dataset
    └── package.json
```

---

## 🏁 Getting Started

### Prerequisites
- **Node.js** (v18.x or v20.x LTS recommended)
- **npm** (v9.x or later)
- **MongoDB** (Local Community Server on port `27017` or a MongoDB Atlas cluster URI)

### 1. Clone the Repository
```bash
git clone https://github.com/Aagam124/Oncampus.git
cd Oncampus
```

### 2. Configure Backend Environment
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/oncampus
JWT_SECRET=super_secret_jwt_access_key_oncampus_2026
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_oncampus_2026
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
UPLOAD_DIR=uploads
```

### 3. Install Dependencies & Seed Database
```bash
# Install Server dependencies
cd server
npm install

# Seed demo users, services, projects, and initial stats
npm run seed

# Install Client dependencies
cd ../client
npm install
```

### 4. Run the Development Servers
Open two terminal windows:

**Terminal 1 — Backend API Server:**
```bash
cd server
npm run dev
# Starts at http://localhost:5000
```

**Terminal 2 — Frontend Client:**
```bash
cd client
npm run dev
# Starts at http://localhost:5173
```

Open your browser at `http://localhost:5173` and log in with any demo account.

---

## 🚀 Production Build

To build the frontend bundle for production deployment:

```bash
cd client
npm run build
```

The optimized static assets will be output to `client/dist`. The Express backend is pre-configured to serve `client/dist` statically when deployed to cloud providers (Render, Railway, Heroku, AWS).

---

## 🔒 Security & Data Integrity Highlights

- **Suspended User Cascade:** When an administrator suspends a user or hides their account in Portal Management, all their associated services and projects are automatically cascaded to `portalStatus: 'removed'` and unlisted from campus search.
- **Role-Based Route Guards:** Frontend and backend enforce strict JWT token validation. Protected admin routes require `role === 'admin'`.
- **Soft Deletion & Audit Trail:** Critical marketplace content is soft-deleted by default, preserving order and financial relationship history. Every moderation decision is logged with an administrator timestamp and reason.
- **Enum Concurrency:** Schema-level data validation enforces consistent statuses (`active`, `paused`, `inactive`, `draft`, `published`, `hidden`, `archived`, `removed`).

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "feat: description of changes"`.
4. Push to branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License — see the repository for details.
