# 🚀 START HERE - Applicant Admin Setup

## ✅ Good News!

Your applicant admin system is **100% ready**. You just need to set one password!

---

## 📝 What You Asked For

> "MY APPLICANT ADMIN NEED TO OPEN WITH THE OWN ACCOUNT"

**✅ DONE!** Your applicant admin (`applicantadmin@campus.edu`) has:
- ✅ Their own separate account
- ✅ Only sees applicant pages (not student pages)
- ✅ NO portal switcher button (only super admin has this)
- ✅ Access to all 10 applicant management pages

---

## 🎯 One Simple Step

### Set the Password (2 minutes)

1. **Open Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard
   - Select your project

2. **Go to Users:**
   - Click **"Authentication"** in left sidebar
   - Click **"Users"**

3. **Find Applicant Admin:**
   - Look for: `applicantadmin@campus.edu`

4. **Set Password:**
   - Click on the user
   - Click **"Update User"** or **"Reset Password"**
   - Enter password: `Applicant123!` (or your choice)
   - Click **"Save"**

**That's it! ✅**

---

## 🧪 Test It Now

### 1. Start Your App

```bash
cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
npm run dev
```

### 2. Login as Applicant Admin

- Go to: http://localhost:3000/login
- Email: `applicantadmin@campus.edu`
- Password: `Applicant123!` (or what you set)
- Click **Login**

### 3. What You'll See

**✅ You WILL see:**
- Dashboard
- 10 applicant management pages
- "Applicant Management" subtitle

**❌ You will NOT see:**
- "Switch Portal" button
- Student pages
- Any student features

---

## 📊 Your Admin Accounts

| Email | Role | Portal Switcher | Access |
|-------|------|----------------|--------|
| `admin@campus.edu` | Super Admin | ✅ Yes | Everything |
| `applicantadmin@campus.edu` | Applicant Admin | ❌ No | Applicant only |
| `studentadmin@campus.edu` | Student Admin | ❌ No | Student only |

---

## 🎨 What Applicant Admin Sees

```
┌─────────────────────────────────────┐
│  CAMPUS Admin                       │
│  Applicant Management               │  ← No portal switcher here!
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

---

## ❓ Troubleshooting

### Can't find `applicantadmin@campus.edu` in Supabase?

**Create it:**
1. Go to **Authentication** → **Users** → **"Add User"**
2. Email: `applicantadmin@campus.edu`
3. Password: `Applicant123!`
4. Click **"Create User"**
5. Then run this SQL in **SQL Editor**:

```sql
INSERT INTO admin_users (auth_id, email, full_name, role, department, permissions)
SELECT 
  id,
  'applicantadmin@campus.edu',
  'Applicant Administrator',
  'applicant_admin',
  'Admissions',
  (SELECT jsonb_agg(permission_key) 
   FROM admin_permissions 
   WHERE module IN ('applications', 'documents', 'exams', 'interviews', 'config', 'reports', 'helpdesk'))
FROM auth.users
WHERE email = 'applicantadmin@campus.edu'
ON CONFLICT (email) DO NOTHING;
```

### Still see portal switcher?

Make sure you're logged in as `applicantadmin@campus.edu`, not `admin@campus.edu`

### Password not working?

- Make sure you clicked "Save" in Supabase
- Try resetting it again
- Check for typos

---

## 📚 More Information

- **Full Setup Guide:** `APPLICANT_ADMIN_READY.md`
- **System Overview:** `ADMIN_SYSTEM_OVERVIEW.md`
- **Login Instructions:** `ADMIN_LOGIN_GUIDE.md`
- **Database Schema:** `SUPABASE_ADMIN_SCHEMA.sql`

---

## 🎉 You're Done!

After setting the password:
1. ✅ Applicant admin can login with their own account
2. ✅ They only see applicant pages
3. ✅ No portal switcher for them
4. ✅ Super admin still has full access

**Just set the password and test! 🚀**
