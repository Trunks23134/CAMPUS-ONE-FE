# 🔐 Password Setup for Applicant Admin

## ⚠️ Important: I Cannot Set the Password Directly

I'm an AI assistant and **cannot access your Supabase Dashboard** to set passwords. However, I've created everything you need to do it yourself in **2 minutes**!

---

## 🎯 What You Need to Do

**Set the password for:** `applicantadmin@campus.edu`

**Password to use:** `Applicant123!`

---

## 🚀 Easiest Way - 3 Clicks

### 1. Open This Link

**Click here:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users

(This goes directly to your users page)

### 2. Find and Click the User

Look for: `applicantadmin@campus.edu`

Click on that row

### 3. Set the Password

- Click **"Update User"**
- Type password: `Applicant123!`
- Click **"Save"**

**Done! ✅**

---

## 📚 Helpful Files I Created

I've created **7 detailed guides** to help you:

| File | What It Does |
|------|-------------|
| **`SET_PASSWORD_NOW.md`** ⭐ | Step-by-step instructions with exact links |
| **`PASSWORD_SETUP_VISUAL_GUIDE.md`** | Visual guide with screenshots descriptions |
| **`CHECK_AND_CREATE_APPLICANT_ADMIN.sql`** | SQL to check if user exists |
| **`START_HERE.md`** | Quick start guide |
| **`APPLICANT_ADMIN_READY.md`** | Complete setup documentation |
| **`ADMIN_SYSTEM_OVERVIEW.md`** | System architecture and diagrams |
| **`ADMIN_LOGIN_GUIDE.md`** | How to login and what each admin sees |

---

## 🎯 Quick Reference

### Your Supabase Project

- **Project URL:** https://swkeqzjrlraadglfdmgi.supabase.co
- **Dashboard:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi
- **Users Page:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users

### Applicant Admin Credentials

- **Email:** `applicantadmin@campus.edu`
- **Password:** `Applicant123!` (after you set it)
- **Role:** `applicant_admin`

### All Your Admin Accounts

| Email | Role | Password Status |
|-------|------|----------------|
| `admin@campus.edu` | Super Admin | ✅ Already set |
| `applicantadmin@campus.edu` | Applicant Admin | ⏳ **Need to set** |
| `studentadmin@campus.edu` | Student Admin | ✅ Already set |

---

## 🧪 After Setting Password - Test It

### 1. Start Your App

```bash
cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
npm run dev
```

### 2. Login

- Go to: http://localhost:3000/login
- Email: `applicantadmin@campus.edu`
- Password: `Applicant123!`
- Click **Login**

### 3. Verify

**✅ You SHOULD see:**
- Dashboard page
- "Applicant Management" subtitle
- 10 applicant pages in sidebar
- **NO "Switch Portal" button**

**❌ You should NOT see:**
- "Switch Portal" button
- Student pages

---

## ❓ What If User Doesn't Exist?

If you don't see `applicantadmin@campus.edu` in Supabase:

### Option 1: Create via Dashboard (Easiest)

1. Go to: https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users
2. Click **"+ Add User"**
3. Fill in:
   - Email: `applicantadmin@campus.edu`
   - Password: `Applicant123!`
   - Auto Confirm User: ✅ Check this
4. Click **"Create User"**
5. Then run the SQL from `CHECK_AND_CREATE_APPLICANT_ADMIN.sql`

### Option 2: Check with SQL

1. Go to: https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/sql/new
2. Copy and paste the SQL from `CHECK_AND_CREATE_APPLICANT_ADMIN.sql`
3. Click **"Run"**
4. It will show you if the user exists and create the link if needed

---

## 🎨 What Applicant Admin Will See

After login, they'll see this sidebar:

```
┌─────────────────────────────────────┐
│  CAMPUS Admin                       │
│  Applicant Management               │
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│                                     │
│  📂 Admissions Pipeline             │
│     • Application Queue             │
│     • Document Verification         │
│     • Selection & Decisioning       │
│                                     │
│  📂 Candidate Assessment            │
│     • Entrance Examination          │
│     • Interview Coordination        │
│                                     │
│  📂 Service Configuration           │
│     • Eligibility Criteria          │
│     • Enrollment Quotas             │
│     • Admissions Analytics          │
│                                     │
│  📂 Support Operations              │
│     • Applicant Help Desk           │
│     • Transmission Logs             │
└─────────────────────────────────────┘
```

**No portal switcher!** ✅

---

## 🔧 Troubleshooting

### "Invalid login credentials"
- Make sure you set the password in Supabase
- Password is case-sensitive: `Applicant123!`
- Try resetting the password again

### "User not found"
- User doesn't exist in Supabase Auth
- Create it using the steps above

### Still see "Switch Portal" button
- You're logged in as `admin@campus.edu` (super admin)
- Not as `applicantadmin@campus.edu`
- Logout and login with correct email

### Can't access Supabase Dashboard
- Make sure you're logged into Supabase
- Use the account that owns the project
- Project ID: `swkeqzjrlraadglfdmgi`

---

## 📞 Need More Help?

Read these files in order:

1. **`SET_PASSWORD_NOW.md`** - Detailed step-by-step
2. **`PASSWORD_SETUP_VISUAL_GUIDE.md`** - Visual guide
3. **`CHECK_AND_CREATE_APPLICANT_ADMIN.sql`** - SQL to check status

---

## ✅ Summary

**What I've Done:**
- ✅ Created all admin pages
- ✅ Set up role-based access
- ✅ Hidden portal switcher for applicant admin
- ✅ Created 7 detailed guides
- ✅ Provided SQL scripts to help

**What You Need to Do:**
- ⏳ Set password in Supabase Dashboard (2 minutes)
- ⏳ Test login

**Why I Can't Do It:**
- ❌ I'm an AI and cannot access your Supabase Dashboard
- ❌ Only you can login to Supabase and set passwords
- ✅ But I've made it as easy as possible with guides!

---

## 🎉 You're Almost Done!

Just go to Supabase, set the password, and test!

**Direct link:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users

**Password to set:** `Applicant123!`

**Then test at:** http://localhost:3000/login

---

**Your applicant admin system is ready! Just set the password! 🚀**
