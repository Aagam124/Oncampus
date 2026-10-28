import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from './db.js';
import User from './models/User.js';
import Service from './models/Service.js';
import Order from './models/Order.js';
import Project from './models/Project.js';
import Review from './models/Review.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import Notification from './models/Notification.js';
import Report from './models/Report.js';

const seed = async () => {
  try {
    await connectDB();
    console.log('🧹 Clearing all collections...');

    await Promise.all([
      User.deleteMany({}),
      Service.deleteMany({}),
      Order.deleteMany({}),
      Project.deleteMany({}),
      Review.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Report.deleteMany({}),
    ]);

    console.log('👥 Creating users...');

    const students = await User.create([
      {
        firstName: 'Aarav',
        lastName: 'Sharma',
        email: 'aarav.sharma@iitd.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Full-Stack Developer | React & Node.js Enthusiast',
        bio: 'Third-year CS student at IIT Delhi with a passion for building scalable web applications. I\'ve worked on multiple freelance projects including e-commerce platforms and dashboards. Love open-source and hackathons.',
        university: 'IIT Delhi',
        department: 'Computer Science',
        year: 3,
        skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Tailwind CSS', 'PostgreSQL'],
        education: [{ institution: 'IIT Delhi', degree: 'B.Tech', field: 'Computer Science', startYear: 2024, endYear: 2028 }],
        portfolio: [
          { title: 'ShopEase', description: 'Full-stack e-commerce platform with Stripe integration', url: 'https://github.com/aarav/shopease' },
          { title: 'TaskBoard', description: 'Kanban-style project management tool', url: 'https://github.com/aarav/taskboard' },
        ],
        socialLinks: { github: 'https://github.com/aaravsharma', linkedin: 'https://linkedin.com/in/aaravsharma', website: 'https://aaravsharma.dev' },
        rating: 4.8,
        reviewCount: 12,
        isVerified: true,
      },
      {
        firstName: 'Priya',
        lastName: 'Menon',
        email: 'priya.menon@bits.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'UI/UX Designer | Figma & Adobe Creative Suite',
        bio: 'Design student at BITS Pilani specialising in user experience and interface design. I believe great design is invisible — it just works. Currently exploring design systems and accessibility.',
        university: 'BITS Pilani',
        department: 'Design',
        year: 2,
        skills: ['Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'UI Design', 'Prototyping', 'User Research'],
        education: [{ institution: 'BITS Pilani', degree: 'B.Des', field: 'Design', startYear: 2025, endYear: 2029 }],
        portfolio: [
          { title: 'FoodieApp Redesign', description: 'Complete UX overhaul for a food delivery app', url: 'https://behance.net/priya/foodie' },
        ],
        socialLinks: { linkedin: 'https://linkedin.com/in/priyamenon', website: 'https://priyamenon.design' },
        rating: 4.9,
        reviewCount: 8,
        isVerified: true,
      },
      {
        firstName: 'Rohan',
        lastName: 'Gupta',
        email: 'rohan.gupta@nit.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Mobile App Developer | Flutter & React Native',
        bio: 'Passionate about mobile-first experiences. I\'ve published 3 apps on the Play Store and love building cross-platform solutions. Currently learning SwiftUI on the side.',
        university: 'NIT Trichy',
        department: 'Electronics & Communication',
        year: 4,
        skills: ['Flutter', 'React Native', 'Dart', 'Firebase', 'Kotlin', 'REST APIs'],
        education: [{ institution: 'NIT Trichy', degree: 'B.Tech', field: 'Electronics & Communication', startYear: 2023, endYear: 2027 }],
        portfolio: [
          { title: 'CampusBuzz', description: 'College events discovery app built with Flutter', url: 'https://play.google.com/campusbuzz' },
          { title: 'FitTrack', description: 'Fitness tracking app with social features', url: 'https://play.google.com/fittrack' },
        ],
        socialLinks: { github: 'https://github.com/rohangupta', linkedin: 'https://linkedin.com/in/rohangupta' },
        rating: 4.5,
        reviewCount: 6,
      },
      {
        firstName: 'Ananya',
        lastName: 'Krishnan',
        email: 'ananya.k@iisc.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Data Science & ML Researcher',
        bio: 'Research assistant at IISc working on NLP and computer vision projects. I offer data analysis and ML consulting to help students and startups make sense of their data. Published 2 papers in top conferences.',
        university: 'IISc Bangalore',
        department: 'Computational & Data Sciences',
        year: 5,
        skills: ['Python', 'TensorFlow', 'PyTorch', 'Pandas', 'R', 'SQL', 'Data Visualization', 'Machine Learning'],
        education: [{ institution: 'IISc Bangalore', degree: 'Integrated PhD', field: 'Computational & Data Sciences', startYear: 2022, endYear: 2027 }],
        socialLinks: { github: 'https://github.com/ananyak', linkedin: 'https://linkedin.com/in/ananyakrishnan' },
        rating: 4.7,
        reviewCount: 5,
        isVerified: true,
      },
      {
        firstName: 'Kabir',
        lastName: 'Patel',
        email: 'kabir.patel@daiict.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Video Editor & Motion Graphics Artist',
        bio: 'Telling stories through visuals. I specialise in YouTube content editing, short-form reels, and motion graphics. Worked with 10+ content creators and small businesses across India.',
        university: 'DA-IICT Gandhinagar',
        department: 'Information & Communication Technology',
        year: 3,
        skills: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Motion Graphics', 'Color Grading', 'Sound Design'],
        education: [{ institution: 'DA-IICT Gandhinagar', degree: 'B.Tech', field: 'ICT', startYear: 2024, endYear: 2028 }],
        portfolio: [
          { title: 'Tech Explained Series', description: 'Edited 50+ tech explainer videos for a 200K subscriber channel', url: 'https://youtube.com/techexplained' },
        ],
        socialLinks: { linkedin: 'https://linkedin.com/in/kabirpatel', twitter: 'https://twitter.com/kabirpatel' },
        rating: 4.6,
        reviewCount: 15,
      },
      {
        firstName: 'Sneha',
        lastName: 'Reddy',
        email: 'sneha.reddy@iiith.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Content Writer & Academic Researcher',
        bio: 'English & Communications student with a knack for turning complex ideas into engaging content. I write blogs, academic papers, and marketing copy. Avid reader and aspiring novelist.',
        university: 'IIIT Hyderabad',
        department: 'Humanities & Social Sciences',
        year: 2,
        skills: ['Content Writing', 'Academic Writing', 'SEO', 'Copywriting', 'Research', 'Proofreading', 'Blog Writing'],
        education: [{ institution: 'IIIT Hyderabad', degree: 'B.Tech + M.S.', field: 'Computational Linguistics', startYear: 2025, endYear: 2030 }],
        socialLinks: { linkedin: 'https://linkedin.com/in/snehareddy', website: 'https://snehawrites.com' },
        rating: 4.4,
        reviewCount: 9,
      },
      {
        firstName: 'Arjun',
        lastName: 'Nair',
        email: 'arjun.nair@iitm.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Graphic Designer & Brand Identity Specialist',
        bio: 'Design is not just what it looks like — it\'s how it works. I create logos, brand kits, posters, and social media creatives. Part of the Design Club at IIT Madras and freelancing since first year.',
        university: 'IIT Madras',
        department: 'Electrical Engineering',
        year: 3,
        skills: ['Photoshop', 'Illustrator', 'InDesign', 'Canva', 'Brand Design', 'Logo Design', 'Social Media Design'],
        education: [{ institution: 'IIT Madras', degree: 'B.Tech', field: 'Electrical Engineering', startYear: 2024, endYear: 2028 }],
        portfolio: [
          { title: 'Startup Branding Kit', description: 'Complete brand identity for a D2C startup', url: 'https://behance.net/arjun/branding' },
          { title: 'Fest Posters', description: 'Poster series for Saarang cultural fest', url: 'https://behance.net/arjun/saarang' },
        ],
        socialLinks: { linkedin: 'https://linkedin.com/in/arjunnair', website: 'https://arjunnair.design' },
        rating: 4.3,
        reviewCount: 7,
      },
      {
        firstName: 'Meera',
        lastName: 'Joshi',
        email: 'meera.joshi@vit.ac.in',
        password: 'Password123!',
        role: 'student',
        headline: 'Presentation Designer & Pitch Deck Expert',
        bio: 'I craft persuasive presentations that win competitions and impress investors. Specialise in pitch decks, academic presentations, and business proposals. Won 3 national B-plan competitions.',
        university: 'VIT Vellore',
        department: 'Business Administration',
        year: 2,
        skills: ['PowerPoint', 'Google Slides', 'Keynote', 'Canva', 'Data Visualization', 'Storytelling', 'Pitch Decks'],
        education: [{ institution: 'VIT Vellore', degree: 'BBA', field: 'Business Administration', startYear: 2025, endYear: 2028 }],
        socialLinks: { linkedin: 'https://linkedin.com/in/meerajoshi' },
        rating: 4.5,
        reviewCount: 11,
      },
    ]);

    const admin = await User.create({
      firstName: 'Campus',
      lastName: 'Admin',
      email: 'admin@oncampus.com',
      password: 'Admin123!',
      role: 'admin',
      headline: 'OnCampus Platform Administrator',
      bio: 'Platform administrator for OnCampus.',
      university: 'OnCampus HQ',
      isVerified: true,
    });

    console.log(`   ✅ Created ${students.length} students + 1 admin`);

    // ---- SERVICES ----
    console.log('🛠️  Creating services...');

    const services = await Service.create([
      {
        provider: students[0]._id, // Aarav
        title: 'Professional MERN Stack Website Development',
        description: 'I will build a fully responsive, production-ready website using MongoDB, Express.js, React, and Node.js. Includes authentication, REST API, database design, and deployment assistance. Perfect for college projects, startup MVPs, or personal portfolios.',
        category: 'web-development',
        tags: ['React', 'Node.js', 'MongoDB', 'Full-Stack', 'REST API'],
        pricing: { type: 'fixed', amount: 5000 },
        deliveryTime: 7,
        rating: 4.8,
        reviewCount: 6,
        orderCount: 8,
      },
      {
        provider: students[0]._id, // Aarav
        title: 'Custom REST API Development with Node.js',
        description: 'Need a backend API for your app? I build clean, well-documented REST APIs with Express.js and MongoDB/PostgreSQL. Includes JWT authentication, input validation, error handling, and Postman collection.',
        category: 'web-development',
        tags: ['Node.js', 'Express', 'API', 'Backend', 'JWT'],
        pricing: { type: 'fixed', amount: 3000 },
        deliveryTime: 5,
        rating: 4.7,
        reviewCount: 4,
        orderCount: 5,
      },
      {
        provider: students[1]._id, // Priya
        title: 'Complete UI/UX Design for Mobile & Web Apps',
        description: 'From user research to high-fidelity prototypes — I deliver end-to-end UI/UX design in Figma. Includes wireframes, user flows, design system, and interactive prototype. I focus on usability and modern aesthetics.',
        category: 'ui-ux-design',
        tags: ['Figma', 'UI Design', 'UX Research', 'Prototyping', 'Mobile Design'],
        pricing: { type: 'fixed', amount: 4000 },
        deliveryTime: 6,
        rating: 4.9,
        reviewCount: 5,
        orderCount: 7,
      },
      {
        provider: students[2]._id, // Rohan
        title: 'Cross-Platform Mobile App in Flutter',
        description: 'I develop beautiful, performant mobile apps for both Android and iOS using Flutter. Firebase integration, state management with Riverpod/Bloc, and clean architecture included. From concept to Play Store listing.',
        category: 'mobile-development',
        tags: ['Flutter', 'Dart', 'Firebase', 'Mobile', 'Cross-Platform'],
        pricing: { type: 'fixed', amount: 8000 },
        deliveryTime: 14,
        rating: 4.5,
        reviewCount: 3,
        orderCount: 4,
      },
      {
        provider: students[3]._id, // Ananya
        title: 'Data Analysis & Visualization with Python',
        description: 'I will analyse your dataset, clean it, find patterns, and create beautiful visualizations using Python (Pandas, Matplotlib, Seaborn, Plotly). Perfect for research projects, thesis data, or business insights.',
        category: 'data-analysis',
        tags: ['Python', 'Pandas', 'Data Visualization', 'Statistics', 'Jupyter'],
        pricing: { type: 'hourly', amount: 500 },
        deliveryTime: 3,
        rating: 4.7,
        reviewCount: 3,
        orderCount: 5,
      },
      {
        provider: students[3]._id, // Ananya
        title: 'Machine Learning Model Development & Deployment',
        description: 'Need a custom ML model? I build, train, and deploy machine learning models for classification, regression, NLP, and computer vision tasks. Includes model evaluation, documentation, and Flask/FastAPI deployment.',
        category: 'data-analysis',
        tags: ['Machine Learning', 'TensorFlow', 'Python', 'NLP', 'Deep Learning'],
        pricing: { type: 'fixed', amount: 6000 },
        deliveryTime: 10,
        rating: 4.8,
        reviewCount: 2,
        orderCount: 3,
      },
      {
        provider: students[4]._id, // Kabir
        title: 'Professional YouTube Video Editing',
        description: 'I edit engaging YouTube videos with smooth cuts, transitions, sound design, colour grading, and thumbnails. Whether it\'s tech reviews, vlogs, or educational content — I make your videos pop. Unlimited revisions.',
        category: 'video-editing',
        tags: ['Premiere Pro', 'Video Editing', 'YouTube', 'Color Grading', 'Thumbnails'],
        pricing: { type: 'fixed', amount: 2000 },
        deliveryTime: 3,
        rating: 4.6,
        reviewCount: 8,
        orderCount: 12,
      },
      {
        provider: students[4]._id, // Kabir
        title: 'Motion Graphics & Animated Explainers',
        description: 'Eye-catching motion graphics and animated explainer videos using After Effects. Perfect for product demos, social media ads, and educational content. Includes script consultation and voiceover sync.',
        category: 'video-editing',
        tags: ['After Effects', 'Motion Graphics', 'Animation', 'Explainer Video'],
        pricing: { type: 'fixed', amount: 4500 },
        deliveryTime: 5,
        rating: 4.5,
        reviewCount: 4,
        orderCount: 5,
      },
      {
        provider: students[5]._id, // Sneha
        title: 'SEO Blog Writing & Content Strategy',
        description: 'Engaging, SEO-optimised blog posts and articles for your website or Medium publication. I research keywords, write compelling content, and ensure readability. Topics: tech, education, lifestyle, startups.',
        category: 'content-writing',
        tags: ['Blog Writing', 'SEO', 'Content Strategy', 'Copywriting', 'Articles'],
        pricing: { type: 'fixed', amount: 1000 },
        deliveryTime: 2,
        rating: 4.4,
        reviewCount: 5,
        orderCount: 9,
      },
      {
        provider: students[5]._id, // Sneha
        title: 'Academic Research Paper & Thesis Assistance',
        description: 'I help with literature reviews, research methodology, data interpretation, and academic paper formatting (APA, IEEE, MLA). Not ghostwriting — genuine research assistance to improve your academic work.',
        category: 'research',
        tags: ['Academic Writing', 'Research', 'Literature Review', 'Thesis', 'Citations'],
        pricing: { type: 'hourly', amount: 400 },
        deliveryTime: 5,
        rating: 4.3,
        reviewCount: 4,
        orderCount: 6,
      },
      {
        provider: students[6]._id, // Arjun
        title: 'Logo Design & Complete Brand Identity Kit',
        description: 'I create memorable logos and complete brand identity packages including colour palette, typography, business cards, letterhead, and brand guidelines. Multiple concepts with unlimited revisions until you love it.',
        category: 'graphic-design',
        tags: ['Logo Design', 'Branding', 'Illustrator', 'Brand Identity', 'Visual Design'],
        pricing: { type: 'fixed', amount: 3500 },
        deliveryTime: 5,
        rating: 4.3,
        reviewCount: 4,
        orderCount: 6,
      },
      {
        provider: students[7]._id, // Meera
        title: 'Winning Pitch Deck & Presentation Design',
        description: 'I design compelling pitch decks and presentations that tell your story effectively. Whether it\'s a startup pitch, academic seminar, or business proposal — I combine data visualization with visual storytelling.',
        category: 'presentation',
        tags: ['Pitch Deck', 'PowerPoint', 'Presentation', 'Storytelling', 'Business'],
        pricing: { type: 'fixed', amount: 1500 },
        deliveryTime: 3,
        rating: 4.5,
        reviewCount: 6,
        orderCount: 10,
      },
    ]);

    console.log(`   ✅ Created ${services.length} services`);

    // ---- PROJECTS ----
    console.log('📋 Creating projects...');

    const projects = await Project.create([
      {
        owner: students[0]._id, // Aarav
        title: 'Campus Marketplace App — Looking for React Native Developer',
        description: 'Building a marketplace app for college students to buy/sell textbooks, notes, and equipment. The backend is done (Node.js + MongoDB). Need a React Native developer to build the mobile frontend. Stipend available for the right candidate.',
        category: 'mobile-development',
        skills: ['React Native', 'JavaScript', 'REST APIs', 'Redux'],
        type: 'hiring',
        budget: { min: 5000, max: 15000, currency: 'INR' },
        timeline: '6 weeks',
        maxCollaborators: 2,
        members: [students[0]._id],
        status: 'open',
      },
      {
        owner: students[1]._id, // Priya
        title: 'Design Portfolio Platform for Students',
        description: 'Let\'s build an open-source portfolio platform specifically for design students in India. Think Behance meets LinkedIn but for college students. Looking for a frontend developer and a backend developer to collaborate.',
        category: 'web-development',
        skills: ['React', 'Node.js', 'Figma', 'MongoDB', 'Tailwind CSS'],
        type: 'collaboration',
        budget: { min: 0, max: 0, currency: 'INR' },
        timeline: '3 months',
        maxCollaborators: 4,
        members: [students[1]._id],
        applications: [
          { applicant: students[0]._id, message: 'I\'d love to help with the backend! I have experience building similar platforms with the MERN stack.', status: 'accepted' },
          { applicant: students[6]._id, message: 'Can help with the frontend design system and component library.', status: 'pending' },
        ],
        status: 'open',
      },
      {
        owner: students[3]._id, // Ananya
        title: 'AI-Powered Study Planner Research Project',
        description: 'Research project to build an AI-powered personalised study planner using NLP and recommendation systems. Looking for collaborators with ML/NLP experience. We\'ll submit a paper to a student conference.',
        category: 'data-analysis',
        skills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow', 'Research'],
        type: 'collaboration',
        budget: { min: 0, max: 0, currency: 'INR' },
        timeline: '4 months',
        maxCollaborators: 3,
        members: [students[3]._id],
        status: 'open',
      },
      {
        owner: students[4]._id, // Kabir
        title: 'Student Documentary Series — Need Content Writers',
        description: 'Creating a documentary series about student life across different Indian campuses. We have the video production covered but need content writers for scripts, subtitles, and social media copy. Great portfolio builder!',
        category: 'content-writing',
        skills: ['Scriptwriting', 'Content Writing', 'Social Media', 'Research', 'Storytelling'],
        type: 'collaboration',
        budget: { min: 2000, max: 5000, currency: 'INR' },
        timeline: '2 months',
        maxCollaborators: 3,
        members: [students[4]._id],
        applications: [
          { applicant: students[5]._id, message: 'I\'m a content writer at IIIT Hyderabad and would love to write scripts for this series!', status: 'accepted' },
        ],
        status: 'in-progress',
      },
    ]);

    console.log(`   ✅ Created ${projects.length} projects`);

    // ---- ORDERS ----
    console.log('📦 Creating orders...');

    const orders = await Order.create([
      {
        service: services[0]._id, // MERN website by Aarav
        client: students[2]._id, // Rohan orders
        provider: students[0]._id,
        requirements: 'Need a portfolio website with project showcase, blog section, and contact form. Clean minimal design. Please use Next.js if possible.',
        amount: 5000,
        status: 'completed',
        deliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        messages: [
          { sender: students[2]._id, content: 'Hey Aarav, I want a modern portfolio site. Here are some references I like.', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
          { sender: students[0]._id, content: 'Looks great! I can definitely work with these references. I\'ll start with wireframes.', createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000) },
          { sender: students[0]._id, content: 'Here\'s the first draft — let me know your thoughts!', createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
          { sender: students[2]._id, content: 'This looks amazing! Just a few minor tweaks needed.', createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000) },
        ],
      },
      {
        service: services[2]._id, // UI/UX by Priya
        client: students[0]._id, // Aarav orders
        provider: students[1]._id,
        requirements: 'Design the UI for a task management app. Need user flows, wireframes, and high-fidelity mockups for 8 screens. Target audience is college students.',
        amount: 4000,
        status: 'completed',
        deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        messages: [
          { sender: students[0]._id, content: 'Hi Priya, I need UI designs for a productivity app I\'m building.', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
          { sender: students[1]._id, content: 'Sounds interesting! Let me understand the user personas first.', createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        ],
      },
      {
        service: services[6]._id, // Video editing by Kabir
        client: students[3]._id, // Ananya orders
        provider: students[4]._id,
        requirements: 'Need a 10-minute research presentation video edited with animations and data visualizations. I\'ll provide the raw recording and slides.',
        amount: 2000,
        status: 'in-progress',
        deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        messages: [
          { sender: students[3]._id, content: 'Hi Kabir! I have a conference presentation that needs professional editing.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
          { sender: students[4]._id, content: 'I\'d love to help! Please share the raw footage and slides.', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        ],
      },
      {
        service: services[8]._id, // Blog writing by Sneha
        client: students[7]._id, // Meera orders
        provider: students[5]._id,
        requirements: 'Need 5 blog posts for a new startup blog about student entrepreneurship. Each post should be 1200-1500 words, SEO-optimised, with a conversational tone.',
        amount: 5000,
        status: 'pending',
        deliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      },
      {
        service: services[11]._id, // Pitch deck by Meera
        client: students[2]._id, // Rohan orders
        provider: students[7]._id,
        requirements: 'Investor pitch deck for a campus food delivery startup. 15 slides covering problem, solution, market, traction, team, and ask. Need it to look professional and data-driven.',
        amount: 1500,
        status: 'delivered',
        deliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        messages: [
          { sender: students[2]._id, content: 'We\'re pitching to investors next week. Can you help with a deck?', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          { sender: students[7]._id, content: 'Absolutely! I\'ve done several investor decks. Share your content and I\'ll make it shine.', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
          { sender: students[7]._id, content: 'The deck is ready! Please review and let me know if you need any changes.', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
        ],
      },
      {
        service: services[10]._id, // Logo by Arjun
        client: students[1]._id, // Priya orders
        provider: students[6]._id,
        requirements: 'Need a logo for a student design community called "PixelCraft". Modern, minimal, using geometric shapes. Prefer purple/teal colour palette.',
        amount: 3500,
        status: 'accepted',
        deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        messages: [
          { sender: students[1]._id, content: 'Hi Arjun! Love your portfolio. Need a logo for our design community.', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
          { sender: students[6]._id, content: 'Thanks Priya! PixelCraft sounds cool. I\'ll start sketching some concepts.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        ],
      },
    ]);

    console.log(`   ✅ Created ${orders.length} orders`);

    // ---- REVIEWS (on completed orders) ----
    console.log('⭐ Creating reviews...');

    const review1 = await Review.create({
      order: orders[0]._id,
      reviewer: students[2]._id, // Rohan (client)
      reviewee: students[0]._id, // Aarav (provider)
      service: services[0]._id,
      rating: 5,
      comment: 'Aarav delivered an outstanding portfolio website. Clean code, responsive design, and he even helped with deployment. Highly recommend for any web development work!',
    });

    orders[0].clientReview = review1._id;
    await orders[0].save();

    const review2 = await Review.create({
      order: orders[0]._id,
      reviewer: students[0]._id, // Aarav (provider)
      reviewee: students[2]._id, // Rohan (client)
      service: services[0]._id,
      rating: 5,
      comment: 'Rohan was a fantastic client — clear requirements, prompt feedback, and great communication throughout. Would love to work together again!',
    });

    orders[0].providerReview = review2._id;
    await orders[0].save();

    const review3 = await Review.create({
      order: orders[1]._id,
      reviewer: students[0]._id, // Aarav (client)
      reviewee: students[1]._id, // Priya (provider)
      service: services[2]._id,
      rating: 5,
      comment: 'Priya\'s designs are on another level. The user flows were thoughtful and the high-fidelity mockups looked professional. She really understood the student audience.',
    });

    orders[1].clientReview = review3._id;
    await orders[1].save();

    const review4 = await Review.create({
      order: orders[1]._id,
      reviewer: students[1]._id, // Priya (provider)
      reviewee: students[0]._id, // Aarav (client)
      service: services[2]._id,
      rating: 4,
      comment: 'Aarav had a clear vision for the app and provided excellent feedback during the design process. Small delay in reviews but overall great experience.',
    });

    orders[1].providerReview = review4._id;
    await orders[1].save();

    console.log('   ✅ Created 4 reviews');

    // ---- CONVERSATIONS & MESSAGES ----
    console.log('💬 Creating conversations...');

    const conv1 = await Conversation.create({
      participants: [students[0]._id, students[1]._id],
      lastMessage: {
        content: 'Let me know when you\'re free to discuss the design system!',
        sender: students[0]._id,
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      },
    });

    await Message.create([
      { conversation: conv1._id, sender: students[0]._id, content: 'Hey Priya! I saw your application on the Design Portfolio project. Let\'s discuss the tech stack.', createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      { conversation: conv1._id, sender: students[1]._id, content: 'Hey Aarav! I was thinking we could use a component library like Radix UI with Tailwind for the frontend.', createdAt: new Date(Date.now() - 47 * 60 * 60 * 1000) },
      { conversation: conv1._id, sender: students[0]._id, content: 'That sounds perfect. I\'ll set up the Next.js project with Tailwind tonight.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      { conversation: conv1._id, sender: students[1]._id, content: 'Great! I\'ll start the Figma designs in parallel. Should be ready by the weekend.', createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000) },
      { conversation: conv1._id, sender: students[0]._id, content: 'Let me know when you\'re free to discuss the design system!', createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) },
    ]);

    const conv2 = await Conversation.create({
      participants: [students[3]._id, students[4]._id],
      lastMessage: {
        content: 'I\'ll have the first cut ready by tomorrow evening!',
        sender: students[4]._id,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
    });

    await Message.create([
      { conversation: conv2._id, sender: students[3]._id, content: 'Hi Kabir, thanks for accepting the order! Here\'s the Google Drive link with my raw recording.', createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000) },
      { conversation: conv2._id, sender: students[4]._id, content: 'Got it! The footage quality is good. Any specific transitions or style you prefer?', createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000) },
      { conversation: conv2._id, sender: students[3]._id, content: 'Something clean and academic but not boring. Maybe some animated data charts?', createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000) },
      { conversation: conv2._id, sender: students[4]._id, content: 'I\'ll have the first cut ready by tomorrow evening!', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    ]);

    const conv3 = await Conversation.create({
      participants: [students[2]._id, students[7]._id],
      lastMessage: {
        content: 'The deck looks incredible! Just shared it with the team.',
        sender: students[2]._id,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      },
    });

    await Message.create([
      { conversation: conv3._id, sender: students[2]._id, content: 'Hey Meera! The pitch deck you delivered is amazing. Quick question — can we tweak the financials slide?', createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) },
      { conversation: conv3._id, sender: students[7]._id, content: 'Of course! Send me the updated numbers and I\'ll fix it within a couple hours.', createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000) },
      { conversation: conv3._id, sender: students[2]._id, content: 'The deck looks incredible! Just shared it with the team.', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) },
    ]);

    console.log('   ✅ Created 3 conversations with messages');

    // ---- NOTIFICATIONS ----
    console.log('🔔 Creating notifications...');

    await Notification.create([
      {
        recipient: students[0]._id,
        type: 'order',
        title: 'Order Completed',
        message: 'Your order for "Professional MERN Stack Website Development" has been marked as completed.',
        link: `/orders/${orders[0]._id}`,
        isRead: true,
      },
      {
        recipient: students[0]._id,
        type: 'review',
        title: 'New Review Received',
        message: 'Rohan left you a 5-star review!',
        link: `/reviews/${review1._id}`,
        isRead: false,
      },
      {
        recipient: students[1]._id,
        type: 'project',
        title: 'New Application',
        message: 'Arjun applied to your project "Design Portfolio Platform for Students".',
        link: `/projects/${projects[1]._id}`,
        isRead: false,
      },
      {
        recipient: students[4]._id,
        type: 'order',
        title: 'New Order Received',
        message: 'You have a new order for "Professional YouTube Video Editing".',
        link: `/orders/${orders[2]._id}`,
        isRead: true,
      },
      {
        recipient: students[5]._id,
        type: 'order',
        title: 'New Order Received',
        message: 'You have a new order for "SEO Blog Writing & Content Strategy".',
        link: `/orders/${orders[3]._id}`,
        isRead: false,
      },
      {
        recipient: students[7]._id,
        type: 'message',
        title: 'New Message',
        message: 'Rohan sent you a message.',
        link: `/conversations/${conv3._id}`,
        isRead: false,
      },
      {
        recipient: students[2]._id,
        type: 'order',
        title: 'Order Delivered',
        message: 'Meera has delivered your pitch deck order. Please review and complete.',
        link: `/orders/${orders[4]._id}`,
        isRead: false,
      },
      {
        recipient: students[6]._id,
        type: 'order',
        title: 'New Order Received',
        message: 'Priya ordered your "Logo Design & Complete Brand Identity Kit" service.',
        link: `/orders/${orders[5]._id}`,
        isRead: false,
      },
    ]);

    console.log('   ✅ Created 8 notifications');

    console.log('\n🎉 Seed completed successfully!');
    console.log('────────────────────────────────');
    console.log('Admin login:  admin@oncampus.com / Admin123!');
    console.log('Student login: aarav.sharma@iitd.ac.in / Password123!');
    console.log('────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
