# 🎓 Student Portal

A complete **Student Portal Web Application** built with:

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | MySQL |
| Auth | express-session + bcrypt |

---

## 📁 Folder Structure

```
student-portal/
│
├── backend/                    ← Node.js + Express server
│   ├── routes/
│   │   ├── admin.js            ← Admin API endpoints
│   │   ├── student.js          ← Student login/marks API
│   │   └── captcha.js          ← Math CAPTCHA generator
│   ├── middleware/
│   │   └── auth.js             ← Session guard middleware
│   ├── db.js                   ← MySQL connection pool
│   ├── server.js               ← Main entry point
│   ├── package.json            ← Dependencies list
│   ├── .env                    ← Your secrets (DB password etc.)
│   └── .env.example            ← Template for .env
│
├── frontend/
│   └── public/                 ← All HTML/CSS/JS files
│       ├── css/
│       │   └── style.css       ← All styles
│       ├── index.html          ← Student login page
│       ├── dashboard.html      ← Student dashboard
│       ├── admin-login.html    ← Admin login page
│       └── admin-dashboard.html← Admin panel
│
├── database/
│   └── setup.sql               ← Run this to create all tables
│
├── .gitignore
└── README.md                   ← This file
```

---

## ⚙️ Step-by-Step Setup (Local Machine)

### Prerequisites

Before starting, make sure these are installed:

| Tool | Check if installed | Download |
|---|---|---|
| Node.js (v18+) | `node --version` | https://nodejs.org |
| MySQL (v8+) | `mysql --version` | https://dev.mysql.com/downloads/ |
| Git | `git --version` | https://git-scm.com |

---

### Step 1: Set Up MySQL Database

Open your terminal/command prompt and run:

```bash
# Log in to MySQL (enter your MySQL root password when prompted)
mysql -u root -p

# Or on some systems:
mysql -u root
```

Once inside MySQL prompt (`mysql>`), run:

```sql
-- Run the setup script (replace the path with your actual path)
source /full/path/to/student-portal/database/setup.sql

-- Verify tables were created
USE student_portal;
SHOW TABLES;
-- Should show: admin, students, marks
```

**OR** run the file directly from terminal (outside MySQL):

```bash
mysql -u root -p < database/setup.sql
```

---

### Step 2: Configure Environment Variables

```bash
# Go to the backend folder
cd backend

# Copy the example file to create your .env
cp .env.example .env

# Open .env in any text editor and fill in your MySQL password
# Windows: notepad .env
# Mac/Linux: nano .env or code .env
```

Edit `.env` to look like this:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=student_portal
SESSION_SECRET=any_long_random_string_here_abc123
PORT=5000
NODE_ENV=development
```

> ⚠️ **IMPORTANT**: Never share your `.env` file or push it to GitHub!

---

### Step 3: Install Node.js Dependencies

```bash
# Make sure you're in the backend folder
cd backend

# Install all packages from package.json
npm install
```

This installs:
- `express` → the web server framework
- `mysql2` → connects Node.js to MySQL
- `bcrypt` → hashes passwords securely
- `express-session` → manages login sessions
- `cors` → allows cross-origin requests
- `dotenv` → loads `.env` file
- `uuid` → generates unique IDs

---

### Step 4: Start the Server

```bash
# Still in the backend folder
npm start

# Or use nodemon (auto-restarts on file changes) for development:
npm run dev
```

You should see:
```
✅  MySQL connected successfully to database: student_portal
╔══════════════════════════════════════╗
║  Student Portal Backend Running       ║
║  URL: http://localhost:5000          ║
║  Admin: http://localhost:5000/admin  ║
╚══════════════════════════════════════╝
```

---

### Deployment note
The backend is already structured for hosting platforms such as Railway or Render.
- Keep the app entrypoint as the backend folder and set the start command to `npm start`.
- Set `CORS_ORIGIN` to your frontend domain when the UI is hosted separately.
- A platform startup file is included so the service can boot automatically.

### Step 5: Open in Browser

| Page | URL |
|---|---|
| 🎓 Student Login | http://localhost:5000 |
| 📊 Student Dashboard | http://localhost:5000/dashboard |
| 🛡️ Admin Login | http://localhost:5000/admin |
| ⚙️ Admin Dashboard | http://localhost:5000/admin/dashboard |

---

### Step 6: First Login (Admin)

**Default Admin Credentials:**
- Username: `admin`
- Password: `password`

> ⚠️ Change this after first login! Update the hash in MySQL:
> ```sql
> -- Generate a new hash using Node.js first:
> -- node -e "const b=require('bcrypt'); b.hash('NewPass@123',10).then(h=>console.log(h));"
> -- Then run in MySQL:
> UPDATE admin SET password_hash = 'PASTE_NEW_HASH_HERE' WHERE username = 'admin';
> ```

---

## 🔄 How It Works (For Beginners)

### CAPTCHA Flow
```
Browser                          Server
   │                               │
   ├─── GET /api/captcha ─────────►│
   │                               │ Generates: 3 + 7 = ?
   │                               │ Stores answer (10) in session
   │◄── { question: "3+7=?" } ────│
   │                               │
   │ User types answer: 10         │
   │                               │
   ├─── POST /api/student/login ──►│
   │    { captchaAnswer: 10 }      │ Compares with session answer
   │                               │ ✅ Match → proceed with login
   │◄── { success: true } ─────── │
```

### Session Flow
```
After login:
Server creates a session → stores in memory
Sends a Cookie to browser: session_id=abc123

Every next request:
Browser sends Cookie automatically
Server looks up session_id → finds user data
User is "logged in"

On logout:
Server destroys the session
Cookie becomes invalid
```

---

## 🌐 API Reference

### Admin Endpoints (all need admin session)

| Method | URL | Description |
|---|---|---|
| POST | `/api/admin/login` | Admin login |
| POST | `/api/admin/logout` | Admin logout |
| GET | `/api/admin/check` | Check if admin logged in |
| GET | `/api/admin/students` | List all students |
| POST | `/api/admin/add-student` | Add new student |
| GET | `/api/admin/students/:id` | Get one student |
| DELETE | `/api/admin/students/:id` | Delete student |
| POST | `/api/admin/marks` | Add/update marks |
| GET | `/api/admin/marks/:studentId` | Get student's marks |
| DELETE | `/api/admin/marks/:markId` | Delete a mark row |

### Student Endpoints

| Method | URL | Description |
|---|---|---|
| GET | `/api/captcha` | Get CAPTCHA question |
| POST | `/api/student/login` | Student login |
| POST | `/api/student/logout` | Student logout |
| GET | `/api/student/me` | Get profile (protected) |
| GET | `/api/student/marks` | Get marks (protected) |

---

## 🚂 Deploy to Railway (Recommended for Backend + MySQL)

Railway gives you a free MySQL database + Node.js hosting in one place.

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with GitHub

### Step 2: Push Code to GitHub (if not done)

```bash
# In student-portal folder
git init
git add .
git commit -m "Initial commit - Student Portal"

# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/student-portal.git
git push -u origin main
```

### Step 3: Deploy on Railway

1. On Railway dashboard → **"New Project"** → **"Deploy from GitHub repo"**
2. Select your `student-portal` repository
3. Railway will detect Node.js automatically

**Configure Railway:**

4. Click **"Variables"** tab → Add these:
   ```
   DB_HOST     = (will fill after adding MySQL)
   DB_PORT     = 3306
   DB_USER     = root  
   DB_PASSWORD = (will fill after adding MySQL)
   DB_NAME     = student_portal
   SESSION_SECRET = any_random_long_string
   PORT        = 5000
   NODE_ENV    = production
   ```

5. **Root Directory** → Set to `backend` (since server.js is inside backend/)

### Step 4: Add MySQL on Railway

1. Click **"New"** → **"Database"** → **"MySQL"**
2. Railway creates a MySQL instance
3. Click on the MySQL service → **"Variables"** tab
4. Copy `MYSQL_HOST`, `MYSQL_PASSWORD`, `MYSQL_USER`, `MYSQLPORT`
5. Go back to your app's Variables and update the DB_ variables

### Step 5: Run Database Setup

1. On Railway MySQL service → **"Query"** tab
2. Paste the contents of `database/setup.sql` and run it

### Step 6: Check Deployment

Your app URL will be: `https://your-app-name.railway.app`

---

## ▲ Deploy to Vercel (Frontend) + Railway (Backend)

> ⚠️ Vercel is for **static frontend only**. Since our frontend is served by Express (not static), the best approach is:
> - **Option A**: Deploy everything (frontend + backend) on **Railway** (recommended above)
> - **Option B**: Separate deploy — Vercel for frontend, Railway for backend

### Option B: Separate Deploy Steps

#### Deploy Backend to Railway
Follow Railway steps above. Note down your backend URL:
`https://student-portal-backend.railway.app`

#### Modify Frontend for Separate Deploy

In all 4 HTML files, change:
```javascript
const API = '';  // same origin
```
to:
```javascript
const API = 'https://student-portal-backend.railway.app'; // your Railway URL
```

Also update the CORS setting in `backend/server.js`:
```javascript
app.use(cors({
  origin: 'https://your-vercel-app.vercel.app',  // your Vercel URL
  credentials: true
}));
```

#### Deploy Frontend to Vercel

1. Go to https://vercel.com → Sign in with GitHub
2. **"New Project"** → Import your GitHub repo
3. **Root Directory**: set to `frontend/public`
4. **Build Command**: leave empty (static files)
5. **Output Directory**: `.` (current)
6. Click **Deploy**

> ⚠️ **Session/Cookie Note**: Cross-origin sessions need `sameSite: 'none'` and `secure: true` on cookies. Update `server.js`:
> ```javascript
> cookie: {
>   secure: true,
>   httpOnly: true,
>   sameSite: 'none',   // allows cross-origin cookies
>   maxAge: 2 * 60 * 60 * 1000
> }
> ```

---

## 🐛 Troubleshooting

### "MySQL connection failed"
- Check `.env` file — is `DB_PASSWORD` correct?
- Is MySQL running? Start it: `sudo service mysql start` (Linux) or MySQL Workbench (Windows)
- Did you run `setup.sql`? Check: `mysql -u root -p -e "SHOW DATABASES;"`

### "CAPTCHA expired"
- Session might have expired or cookie blocked
- Try refreshing the page and clicking 🔄 to get new CAPTCHA
- Make sure you're using `credentials: 'include'` in fetch calls

### "Port 5000 already in use"
```bash
# Find what's using port 5000
lsof -i :5000          # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill it or change PORT in .env to 5001
```

### Cannot find module 'bcrypt'
```bash
cd backend
npm install   # reinstall all dependencies
```

---

## 📚 Key Concepts Explained

### What is bcrypt?
bcrypt converts a plain password like `"hello123"` into a scrambled hash like `"$2b$10$..."`. 
Even if someone steals your database, they can't reverse the hash to get the original password.

### What is a session?
When you login, the server creates a small "session" file (stored in server memory). 
It sends your browser a cookie with a session ID. 
Every request you make, your browser sends that cookie, and the server knows who you are.

### What is a connection pool?
Instead of connecting to MySQL every time a request comes in (slow!), 
a pool keeps 10 connections open and shares them. Much faster.

### What is middleware?
In Express, middleware = a function that runs on every request before your route handler.
Example: `requireAdminLogin` checks if admin session exists before allowing access.

---

## 👥 Default Credentials

| Role | ID/Username | Password |
|---|---|---|
| Admin | `admin` | `password` |
| Students | Auto-generated (e.g. `STU-0001`) | Auto-generated (shown once) |

---

## 📄 License

MIT License — Free to use for educational purposes.

Built for DBMS Lab projects. 🎓
