# TEC Website - Technical Excellence Challenge

A complete multi-page website for the Technical Excellence Challenge (TEC) competition platform built with HTML, CSS, JavaScript, and Express.js.

## 🚀 Features

- **8 Connected Pages**: Home, About, Leaderboard, Register, Login, Dashboard, Team Management, Tasks, and Submissions
- **Dark Theme Design**: Professional dark theme with F1 Red (#FF1801) accent color
- **Fully Responsive**: Mobile-first design that works on all devices
- **Express Server**: Backend server running on port 8080
- **Ready for MongoDB**: Structured for easy database integration

## 📁 Project Structure

```
TEC-ECellMET/
├── public/                 # Frontend files
│   ├── index.html         # Home page with Hero section
│   ├── about.html         # About TEC
│   ├── leaderboard.html   # Competition rankings
│   ├── register.html      # Team registration
│   ├── login.html         # User login
│   ├── dashboard.html     # Team dashboard
│   ├── team.html          # Team management
│   ├── tasks.html         # Task listings
│   ├── submissions.html   # Submission history
│   ├── css/
│   │   └── style.css      # Global styles & design system
│   ├── js/
│   │   ├── navigation.js  # Navigation functionality
│   │   └── main.js        # Animations & interactions
│   └── assets/
│       └── teclogo.svg    # TEC logo
├── server.js              # Express server configuration
└── package.json           # Dependencies
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation Steps

1. **Install Dependencies**
```bash
npm install
```

2. **Start the Server**
```bash
npm start
```

3. **Access the Website**
Open your browser and navigate to:
```
http://localhost:8080
```

## 📄 Pages Overview

### Public Pages
- **Home** (`/`) - Landing page with Hero section, About TEC, How It Works, Competition Phases, Timeline, Benefits, and CTA
- **About** (`/about`) - Detailed information about competition, objectives, rules, eligibility, and contact
- **Leaderboard** (`/leaderboard`) - Real-time team rankings with filters and search
- **Register** (`/register`) - Team registration form with validation
- **Login** (`/login`) - User authentication page

### Dashboard Pages (After Login)
- **Dashboard** (`/dashboard`) - Overview with stats, deadlines, active tasks, and recent submissions
- **My Team** (`/team`) - Team information and member management
- **Tasks** (`/tasks`) - View and manage competition tasks
- **Submissions** (`/submissions`) - Submission history and grading

## 🎨 Design System

### Colors
- **Primary**: `#FF1801` (F1 Red)
- **Background**: `#050505` (Deep Black)
- **Grays**: `#0a0a0a`, `#1a1a1a`, `#2a2a2a`

### Typography
- **Headings**: Orbitron (700, 900)
- **Body**: Inter (300-700)
- **Accents**: Montserrat (500, 600)

### Components
- Cards with hover effects
- Glass morphism elements
- Gradient buttons
- Responsive tables
- Status badges
- Timeline components

## 🔧 Backend Integration (TODO)

The server is ready for MongoDB integration. Update `server.js` to add:

1. **MongoDB Connection**
```javascript
const mongoose = require('mongoose');
mongoose.connect('your-mongodb-uri');
```

2. **User Authentication**
- Implement JWT tokens
- Add session management
- Create user model

3. **API Endpoints**
- `/api/register` - Team registration
- `/api/login` - User authentication
- `/api/tasks` - Fetch tasks
- `/api/submissions` - Submit and retrieve submissions
- `/api/leaderboard` - Get rankings

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

## 🎯 Features for Beginners

This codebase is designed to be beginner-friendly:

- **Pure HTML/CSS**: Easy to understand and modify
- **Vanilla JavaScript**: No complex frameworks
- **Clear Comments**: Well-documented code
- **Modular Structure**: Organized file structure
- **Consistent Naming**: Easy to follow conventions

## 🚀 Next Steps

1. **Connect MongoDB**
   - Set up MongoDB Atlas or local instance
   - Create database schemas
   - Implement CRUD operations

2. **Add Authentication**
   - Implement login/logout functionality
   - Add password hashing (bcrypt)
   - Create protected routes

3. **File Upload**
   - Add file upload for submissions
   - Store files in cloud storage (AWS S3, Cloudinary)

4. **Email Notifications**
   - Send registration confirmations
   - Deadline reminders
   - Grading notifications

5. **Admin Panel**
   - Create task management
   - Grade submissions
   - Manage teams

## 📞 Support

For any issues or questions:
- Email: tec@ecell.com
- Phone: +91 98765 43210

## 📝 License

© 2026 TEC - Technical Excellence Challenge. All rights reserved.

---

**Built with ❤️ by E-Cell Team**
