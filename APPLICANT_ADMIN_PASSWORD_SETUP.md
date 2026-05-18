T # 🔑 Set Password for Applicant Admin

## Your Applicant Admin Account

**Email:** `applicantadmin@campus.edu`  
**Role:** Applicant Admin (can only see applicant pages)  
**Status:** Account exists, but password needs to be set

---

## 🚀 Quick Setup (2 Steps)

### Step 1: Set Password in Supabase

1. **Go to your Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Or go directly to: https://swkeqzjrlraadglfdmgi.supabase.co

2. **Navigate to Authentication:**
   - Click **"Authentication"** in the left sidebar
   - Click **"Users"**

3. **Find the Applicant Admin:**
   - Look for: `applicantadmin@campus.edu`
   - Click on the user row

4. **Set the Password:**
   - Click **"Update User"** or **"Reset Password"**
   - Enter a new password (e.g., `Applicant123!`)
   - Click **"Save"** or **"Update User"**

### Step 2: Test Login

1. **Open your app:**
   ```bash
   cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
   npm run dev
   ```

2. **Go to login page:**
   - URL: http://localhost:3000/login

3. **Login with applicant admin:**
   - **Email:** `applicantadmin@campus.edu`
   - **Password:** (the password you just set)
   - Click **"Login"**

4. **Verify what you see:**
   - ✅ You should see the Dashboard
   - ✅ You should see all 10 applicant admin pages:
     - Application Queue
     - Document Verification
     - Selection & Decisioning
     - Entrance Examination
     - Interview Coordination
     - Eligibility Criteria
     - Enrollment Quotas
     - Admissions Analytics
     - Applicant Help Desk
     - Transmission Logs
   - ❌ You should **NOT** see the "Switch Portal" button
   - ❌ You should **NOT** be able to access student pages

---

## 🎯 What Each Admin Sees

### 1. Applicant Admin (applicantadmin@campus.edu)
```
┌─────────────────────────────────────┐
│  CAMPUS Admin                       │
│  Applicant Management               │  ← No portal switcher
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│  📂 Admissions Pipeline             │
│  📂 Candidate Assessment            │
│  📂 Service Configuration           │
│  📂 Support Operations              │
└─────────────────────────────────────┘
```

### 2. Super Admin (admin@campus.edu)
```
┌─────────────────────────────────────┐
│  CAMPUS Admin                       │
│  System Administrator               │
├─────────────────────────────────────┤
│  🔄 Switch Portal                   │  ← Has portal switcher
│  [Applicants] [Students]            │
├─────────────────────────────────────┤
│  📊 Dashboard                       │
│  📂 All Sections                    │
└─────────────────────────────────────┘
```

---

## 🔐 Alternative: Reset Password via Email

If you prefer to reset via email:

1. In Supabase Dashboard → **Authentication** → **Users**
2. Find `applicantadmin@campus.edu`
3. Click **"Send Password Recovery"**
4. Check the email inbox for `applicantadmin@campus.edu`
5. Click the reset link in the email
6. Set a new password

---

## ✅ Testing Checklist

After logging in as `applicantadmin@campus.edu`, verify:

- [ ] Can see Dashboard
- [ ] Can see Application Queue
- [ ] Can see Document Verification
- [ ] Can see Selection & Decisioning
- [ ] Can see Entrance Examination
- [ ] Can see Interview Coordination
- [ ] Can see Eligibility Criteria
- [ ] Can see Enrollment Quotas
- [ ] Can see Admissions Analytics
- [ ] Can see Applicant Help Desk
- [ ] Can see Transmission Logs
- [ ] **CANNOT** see "Switch Portal" button
- [ ] **CANNOT** access student pages

---

## 🎉 You're Done!

Your applicant admin can now:
- ✅ Login with their own account
- ✅ See only applicant-related pages
- ✅ Manage the entire admissions process
- ✅ Work independently from super admin

---

## 📞 Need Help?

**Can't find the user in Supabase?**
- The account should already exist from the SQL you ran earlier
- Check the `admin_users` table in Supabase

**Password not working?**
- Make sure you saved the password in Supabase
- Try resetting it again
- Check for typos

**Still seeing portal switcher?**
- Make sure you're logged in as `applicantadmin@campus.edu` (not `admin@campus.edu`)
- Check the browser console for any errors
- Try logging out and logging back in

---

**Your applicant admin is ready to use! 🚀**
