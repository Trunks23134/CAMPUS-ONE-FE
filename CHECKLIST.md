# ✅ Applicant Admin Setup Checklist

## 🎯 Your Task

Set password for `applicantadmin@campus.edu` and test login.

---

## 📋 Step-by-Step Checklist

### Part 1: Set Password in Supabase (2 minutes)

- [ ] **Step 1:** Open Supabase Dashboard
  - Link: https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users
  
- [ ] **Step 2:** Find user `applicantadmin@campus.edu`
  - If you see it: ✅ Go to Step 3
  - If you don't see it: ⚠️ Go to Part 3 (Create User)
  
- [ ] **Step 3:** Click on the user row
  
- [ ] **Step 4:** Click "Update User" button
  
- [ ] **Step 5:** Type password: `Applicant123!`
  
- [ ] **Step 6:** Click "Save" or "Update User"
  
- [ ] **Step 7:** Confirm password was saved

---

### Part 2: Test Login (1 minute)

- [ ] **Step 1:** Open terminal and start app
  ```bash
  cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
  npm run dev
  ```
  
- [ ] **Step 2:** Open browser: http://localhost:3000/login
  
- [ ] **Step 3:** Enter credentials:
  - Email: `applicantadmin@campus.edu`
  - Password: `Applicant123!`
  
- [ ] **Step 4:** Click "Login"
  
- [ ] **Step 5:** Verify you see:
  - ✅ Dashboard page
  - ✅ "Applicant Management" subtitle
  - ✅ 10 applicant pages in sidebar
  - ✅ **NO "Switch Portal" button**
  
- [ ] **Step 6:** Test navigation:
  - Click on "Application Queue"
  - Click on "Document Verification"
  - Click on "Entrance Examination"
  
- [ ] **Step 7:** Confirm everything works!

---

### Part 3: Create User (If Doesn't Exist)

Only do this if you don't see `applicantadmin@campus.edu` in Step 2 of Part 1.

- [ ] **Step 1:** Go to Supabase Users page
  - Link: https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users
  
- [ ] **Step 2:** Click "+ Add User" button (top right)
  
- [ ] **Step 3:** Fill in form:
  - Email: `applicantadmin@campus.edu`
  - Password: `Applicant123!`
  - Auto Confirm User: ✅ Check this box
  
- [ ] **Step 4:** Click "Create User"
  
- [ ] **Step 5:** Go to SQL Editor
  - Link: https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/sql/new
  
- [ ] **Step 6:** Copy SQL from `CHECK_AND_CREATE_APPLICANT_ADMIN.sql` (Step 3)
  
- [ ] **Step 7:** Paste and click "Run"
  
- [ ] **Step 8:** Verify user is now in `admin_users` table
  
- [ ] **Step 9:** Go back to Part 2 (Test Login)

---

## 🎯 Quick Links

| What | Link |
|------|------|
| Supabase Users | https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users |
| SQL Editor | https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/sql/new |
| Login Page | http://localhost:3000/login |

---

## 📝 Credentials to Use

| Field | Value |
|-------|-------|
| Email | `applicantadmin@campus.edu` |
| Password | `Applicant123!` |

---

## ✅ Success Criteria

After completing all steps, you should have:

- [x] Password set in Supabase for `applicantadmin@campus.edu`
- [x] Can login at http://localhost:3000/login
- [x] See "Applicant Management" subtitle
- [x] See all 10 applicant pages
- [x] **NO "Switch Portal" button visible**
- [x] Can navigate to all pages
- [x] Applicant admin has their own account

---

## 🎉 When You're Done

Your applicant admin can now:
- ✅ Login with their own account
- ✅ See only applicant-related pages
- ✅ Manage the entire admissions process
- ✅ Work independently from super admin

---

## 📚 Help Files

If you get stuck, read these:

1. **`README_PASSWORD_SETUP.md`** - Overview and why I can't do it
2. **`SET_PASSWORD_NOW.md`** - Detailed step-by-step
3. **`PASSWORD_SETUP_VISUAL_GUIDE.md`** - Visual guide
4. **`CHECK_AND_CREATE_APPLICANT_ADMIN.sql`** - SQL to check/create

---

## ⏱️ Time Estimate

- **Set Password:** 2 minutes
- **Test Login:** 1 minute
- **Total:** 3 minutes

---

**Let's do this! 🚀**
