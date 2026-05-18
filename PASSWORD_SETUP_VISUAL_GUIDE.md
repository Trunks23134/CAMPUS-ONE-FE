# 🖼️ Visual Guide - Set Password for Applicant Admin

## 🎯 Your Mission

Set password for: **`applicantadmin@campus.edu`**

---

## 📸 Step-by-Step with Visual Descriptions

### Step 1: Open Supabase Dashboard

**Click here:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi

You'll see:
```
┌─────────────────────────────────────────────┐
│  Supabase Dashboard                         │
├─────────────────────────────────────────────┤
│  [Left Sidebar]                             │
│  • Home                                     │
│  • Table Editor                             │
│  • Authentication  ← CLICK THIS             │
│  • SQL Editor                               │
│  • Database                                 │
└─────────────────────────────────────────────┘
```

---

### Step 2: Go to Authentication → Users

After clicking "Authentication", you'll see:
```
┌─────────────────────────────────────────────┐
│  Authentication                             │
├─────────────────────────────────────────────┤
│  • Users           ← CLICK THIS             │
│  • Policies                                 │
│  • Providers                                │
│  • Email Templates                          │
└─────────────────────────────────────────────┘
```

---

### Step 3: Find Your User

You'll see a table like this:
```
┌──────────────────────────────────────────────────────────────┐
│  Users                                    [+ Add User]        │
├──────────────────────────────────────────────────────────────┤
│  Email                      │ Created      │ Last Sign In    │
├─────────────────────────────┼──────────────┼─────────────────┤
│  admin@campus.edu           │ 2 days ago   │ 1 hour ago      │
│  studentadmin@campus.edu    │ 2 days ago   │ 3 hours ago     │
│  applicantadmin@campus.edu  │ 2 days ago   │ Never           │
│                             │              │                 │
└──────────────────────────────────────────────────────────────┘
```

**Look for:** `applicantadmin@campus.edu`

---

### Step 4A: If User EXISTS - Set Password

**Click on the row** with `applicantadmin@campus.edu`

You'll see a panel on the right:
```
┌─────────────────────────────────────────────┐
│  User Details                               │
├─────────────────────────────────────────────┤
│  Email: applicantadmin@campus.edu           │
│  ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   │
│                                             │
│  [Update User]  ← CLICK THIS                │
│  [Send Password Recovery]                   │
│  [Delete User]                              │
└─────────────────────────────────────────────┘
```

After clicking "Update User", you'll see:
```
┌─────────────────────────────────────────────┐
│  Update User                                │
├─────────────────────────────────────────────┤
│  Email:                                     │
│  [applicantadmin@campus.edu]                │
│                                             │
│  Password:                                  │
│  [                        ]  ← TYPE HERE    │
│                                             │
│  Auto Confirm User: ☑                       │
│                                             │
│  [Cancel]  [Update User]  ← CLICK THIS     │
└─────────────────────────────────────────────┘
```

**Type in Password field:** `Applicant123!`

**Click:** "Update User"

✅ **Done!** Go to Step 5 to test.

---

### Step 4B: If User DOESN'T EXIST - Create User

**Click:** "+ Add User" button (top right)

You'll see:
```
┌─────────────────────────────────────────────┐
│  Create New User                            │
├─────────────────────────────────────────────┤
│  Email:                                     │
│  [                        ]  ← TYPE HERE    │
│                                             │
│  Password:                                  │
│  [                        ]  ← TYPE HERE    │
│                                             │
│  Auto Confirm User: ☐  ← CHECK THIS BOX    │
│                                             │
│  [Cancel]  [Create User]  ← CLICK THIS     │
└─────────────────────────────────────────────┘
```

**Fill in:**
- Email: `applicantadmin@campus.edu`
- Password: `Applicant123!`
- Auto Confirm User: ✅ Check this

**Click:** "Create User"

**Then:** Go to SQL Editor and run the SQL from SET_PASSWORD_NOW.md

✅ **Done!** Go to Step 5 to test.

---

### Step 5: Test Login

**Open terminal:**
```bash
cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
npm run dev
```

**Open browser:** http://localhost:3000/login

You'll see:
```
┌─────────────────────────────────────────────┐
│                                             │
│         🎓 CAMPUS ONE                       │
│                                             │
│         Login to Your Account               │
│                                             │
│  Email:                                     │
│  [                        ]                 │
│                                             │
│  Password:                                  │
│  [                        ]                 │
│                                             │
│  [        Login        ]                    │
│                                             │
└─────────────────────────────────────────────┘
```

**Type:**
- Email: `applicantadmin@campus.edu`
- Password: `Applicant123!`

**Click:** "Login"

---

### Step 6: Verify Success

After login, you should see:
```
┌─────────────────────────────────────────────────────────────┐
│  🎓 CAMPUS Admin                                            │
│  Applicant Management  ← Should say this                    │
├─────────────────────────────────────────────────────────────┤
│  [NO PORTAL SWITCHER HERE]  ← Should NOT see this           │
│                                                             │
│  📊 Dashboard                                               │
│                                                             │
│  📂 Admissions Pipeline                                     │
│     • Application Queue                                     │
│     • Document Verification                                 │
│     • Selection & Decisioning                               │
│                                                             │
│  📂 Candidate Assessment                                    │
│     • Entrance Examination                                  │
│     • Interview Coordination                                │
│                                                             │
│  📂 Service Configuration                                   │
│     • Eligibility Criteria                                  │
│     • Enrollment Quotas                                     │
│     • Admissions Analytics                                  │
│                                                             │
│  📂 Support Operations                                      │
│     • Applicant Help Desk                                   │
│     • Transmission Logs                                     │
└─────────────────────────────────────────────────────────────┘
```

**✅ Success if you see:**
- "Applicant Management" subtitle
- All 10 pages in sidebar
- NO "Switch Portal" button

**❌ Problem if you see:**
- "Switch Portal" button (means you're logged in as super admin)
- Student pages (wrong account)

---

## 🎯 Quick Reference

### What to Type

| Field | Value |
|-------|-------|
| Email | `applicantadmin@campus.edu` |
| Password | `Applicant123!` |

### Where to Click

1. **Supabase Dashboard** → https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi
2. **Authentication** (left sidebar)
3. **Users** (under Authentication)
4. **Click on user row** or **"+ Add User"**
5. **Update User** or **Create User**
6. **Type password:** `Applicant123!`
7. **Click Save/Update/Create**

---

## 🎉 That's It!

The password is now set. Your applicant admin can login and start working!

**Remember:**
- Email: `applicantadmin@campus.edu`
- Password: `Applicant123!`

You can change the password later if needed.
