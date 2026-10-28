# OnCampus 🎓

> **Your Campus. Your Skills. Your Opportunities.**

OnCampus is a premium, full-stack student freelancing marketplace, portfolio network, talent discovery platform, and peer project collaboration workspace. Built for students, campus communities, and clients seeking verified student talent.

---

## 🚀 Live Servers

- **Frontend Application**: [http://localhost:5173](http://localhost:5173)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Database**: MongoDB 8.3 (`mongodb://127.0.0.1:27017/oncampus`)

---

## 🔑 Demo Credentials

### Administrator Account
- **Email:** `admin@oncampus.com`
- **Password:** `Admin123!`
- **Capabilities:** Admin Dashboard, User Directory (verify/suspend), Service Listing Moderation (approve/reject), Safety & Reports Desk.

### Student Accounts
All student accounts use the password: `Password123!`

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

## ✨ Core Features & Workflows

### 1. Services Marketplace (`/services`)
- **Browse & Search:** Filter by 12 campus categories, pricing model (fixed, hourly, negotiable), price range (₹), and sorting (newest, highest rated, price).
- **Service Details (`/services/:id`):** Showcase images, delivery time in days, skill badges, provider reputation, and verified student feedback.
- **Publish & Edit (`/services/new`, `/services/:id/edit`):** Full form with image showcase URLs, delivery estimation, tag taxonomy, and pricing controls.
- **Direct Ordering Modal:** Enter requirements and place order instantly.

### 2. Project Collaboration Hub (`/projects`)
- **Discover Projects (`/projects`):** Search peer projects, hackathons, and campus startup hiring.
- **Project Details (`/projects/:id`):** View team size capacity, estimated timeline, budget, and active team members.
- **Apply to Team:** Send customized pitch and portfolio links to project lead.
- **Owner Team Review:** Accept or reject applicants directly with automatic notification triggers.

### 3. Student Identity & Portfolio (`/users/:id`, `/profile/edit`)
- **Public Profile:** Verified student badge, university, department, graduation year, social links (GitHub, LinkedIn, personal portfolio, X).
- **Tabs:** Services list, Portfolio case studies gallery, Academic background timeline, Client testimonials.
- **Profile Editor:** Multi-tab editor with live avatar upload, taggable skill endorsements, and portfolio showcase manager.

### 4. Order Management & Workspace (`/orders`, `/orders/:id`)
- **Lifecycle Tracking:** Progress timeline through 5 distinct milestones (`Pending` → `Accepted` → `In Progress` → `Delivered` → `Completed`).
- **Role-Aware Controls:**
  - *Provider:* Accept/Decline, Start Work, Mark Deliverables Delivered.
  - *Client:* Approve & Mark Completed, Cancel.
- **Order Messages Thread:** In-context workspace chat between client and provider for assets and updates.
- **Reviews & Ratings:** 5-star ratings and written feedback recorded upon order completion, recalculating provider reputation scores.

### 5. Campus Chat & Messaging (`/messages`)
- Split-screen workspace with responsive side drawer.
- Search any campus student to initiate conversations.
- Auto-polling for real-time messaging experience with auto-scroll to latest message.

### 6. Administration & Trust Platform (`/admin`)
- **Admin Dashboard (`/admin`):** Platform metrics (total users, gross volume ₹, active services, order lifecycle breakdown).
- **User Directory (`/admin/users`):** Verify student credentials, suspend abusive accounts, or reactivate.
- **Service Moderation (`/admin/services`):** Approve pending listings or reject policy-violating items.
- **Safety Desk (`/admin/reports`):** Review spam, fraud, or harassment flags and log administrative resolution notes.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18, Vite 5, Tailwind CSS, React Router v6, Zustand, Axios, Lucide React, Zod.
- **Backend:** Node.js (ES modules), Express.js, Mongoose ODM, JWT (Access + Refresh tokens), bcryptjs, Multer.
- **Database:** MongoDB 8.3 with indexed text search on services and projects.

---

## 📦 Directory Structure

```
oncampus/
├── client/
│   ├── src/
│   │   ├── components/      # Avatar, Badge, ConfirmDialog, Navbar, Footer, ServiceCard, ProjectCard...
│   │   ├── hooks/           # useToast
│   │   ├── lib/             # Axios instance with JWT interceptors
│   │   ├── pages/           # Landing, Login, Register, Dashboard, ServiceBrowse, ProjectBrowse, etc.
│   │   │   └── admin/       # AdminDashboard, AdminUsers, AdminServices, AdminReports
│   │   ├── store/           # Zustand stores (authStore, notificationStore)
│   │   ├── App.jsx          # Route definitions & guards
│   │   └── main.jsx
│   └── package.json
└── server/
    ├── src/
    │   ├── controllers/     # auth, user, service, project, order, message, review, admin, notification
    │   ├── middleware/      # JWT auth, Multer upload, Zod validator
    │   ├── models/          # User, Service, Project, Order, Conversation, Message, Review, Report, Notification
    │   ├── routes/          # RESTful endpoints
    │   ├── utils/           # JWT helpers, standard API responses
    │   ├── db.js            # MongoDB connection
    │   ├── index.js         # Express app entry
    │   └── seed.js          # Realistic demo dataset seeder
    └── package.json
```
