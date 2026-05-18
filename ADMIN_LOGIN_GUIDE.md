# Admin Login Guide - Role-Based Access

## 🎯 How It Works Now

Each admin account logs in with their **own credentials** and sees **only their relevant pages**.

## 👥 Your Admin Accounts

### 1. **Super Admin** - Full Access
- **Email:** `admin@campus.edu`
- **Access:** Everything (Applicant Portal + Student Portal)
- **Can Switch:** ✅ Yes, can switch between portals
- **Sees:**
  - All applicant admin pages
  - All student admin pages
  - Portal switcher button

### 2. **Applicant Admin** - Applicant Management Only
- **Email:** `applicantadmin@campus.edu`
- **Access:** Only Applicant Portal
- **Can Switch:** ❌ No, locked to applicant portal
- **Sees:**
  - ✅ Dashboard
  - ✅ Application Queue
  - ✅ Document Verification
  - ✅ Selection & Decisioning
  - ✅ Entrance Examination
  - ✅ Interview Coordination
  - ✅ Eligibility Criteria
  - ✅ Enrollment Quotas
  - ✅ Admissions Analytics
  - ✅ Applicant Help Desk
  - ✅ Transmission Logs
  - ❌ NO student portal access
  - ❌ NO portal switcher

### 3. **Student Admin** - Student Management Only
- **Email:** `studentadmin@campus.edu`
- **Access:** Only Student Portal
- **Can Switch:** ❌ No, locked to student portal
- **Sees:**
  - ✅ Student management pages
  - ❌ NO applicant portal access
  - ❌ NO portal switcher

## 🔐 How to Login

### For Applicant Admin:
1. Go to: http://localhost:3000/login
2. Enter:
   - **Email:** `applicantadmin@campus.edu`
   - **Password:** [Your password - if you don't know it, reset it in Supabase]
3. Click **Login**
4. You'll see **ONLY** the applicant admin pages
5. **No portal switcher** will appear (you can't switch to student portal)

### For Super Admin:
1. Go to: http://localhost:3000/login
2. Enter:
   - **Email:** `admin@campus.edu`
   - **Password:** [Your password]
3. Click **Login**
4. You'll see **ALL** pages
5. **Portal switcher** appears - you can switch between Applicant and Student portals

## 🔑 Reset Password (If Needed)

If you don't know the password for `applicantadmin@campus.edu`:

### Option 1: Reset in Supabase Dashboard
1. Go to your Supabase Dashboard
2. Click **Authentication** → **Users**
3. Find `applicantadmin@campus.edu`
4. Click on the user
5. Click **"Update User"**
6. Set new password: `Applicant123!` (or your choice)
7. Click **Save**

### Option 2: Send Password Reset Email
1. In Supabase Dashboard → **Authentication** → **Users**
2. Find `applicantadmin@campus.edu`
3. Click **"Send Password Recovery"**
4. Check the email inbox
5. Click the reset link
6. Set new password

## 📊 What Each Admin Sees

### Applicant Admin Dashboard:
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

### Super Admin Dashboard:
```
┌─────────────────────────────────────┐
│  CAMPUS Admin                       │
│  System Administrator               │
├─────────────────────────────────────┤
│  🔄 Switch Portal                   │
│  [Applicants] [Students]  ← Can switch
│                                     │
│  📊 Dashboard                       │
│  ... (All pages from both portals) │
└─────────────────────────────────────┘
```

## ✅ Testing Steps

1. **Test Applicant Admin:**
   ```
   Email: applicantadmin@campus.edu
   Password: [Your password]
   Expected: See only applicant pages, NO portal switcher
   ```

2. **Test Super Admin:**
   ```
   Email: admin@campus.edu
   Password: [Your password]
   Expected: See all pages, CAN switch portals
   ```

3. **Test Student Admin:**
   ```
   Email: studentadmin@campus.edu
   Password: [Your password]
   Expected: See only student pages, NO portal switcher
   ```

## 🎯 Summary

✅ **Applicant Admin** = Own account, only sees applicant pages
✅ **Student Admin** = Own account, only sees student pages
✅ **Super Admin** = Own account, sees everything, can switch
✅ **No shared passwords** = Each admin has their own login
✅ **Role-based access** = Automatic based on their role in database

---

**Your applicant admin can now login with their own account and manage only applicant-related tasks!** 🎉
