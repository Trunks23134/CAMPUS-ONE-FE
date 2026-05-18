# 🔑 Set Password for Applicant Admin - STEP BY STEP

## 🎯 Your Supabase Project

**Project URL:** https://swkeqzjrlraadglfdmgi.supabase.co

---

## 📋 Follow These Exact Steps

### Step 1: Open Supabase Dashboard

Click this link: **https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi**

(Or go to https://supabase.com/dashboard and select your project)

### Step 2: Go to Authentication

1. Look at the left sidebar
2. Click on **"Authentication"** (icon looks like a key 🔑)
3. Click on **"Users"** (under Authentication)

### Step 3: Find the Applicant Admin User

Look for the user with email: **`applicantadmin@campus.edu`**

**If you SEE the user:**
- ✅ Great! Go to Step 4

**If you DON'T see the user:**
- Go to Step 5 (Create User First)

### Step 4: Set Password for Existing User

1. Click on the row with `applicantadmin@campus.edu`
2. Look for **"Update User"** or **"Reset Password"** button
3. Click it
4. Enter this password: **`Applicant123!`**
5. Click **"Save"** or **"Update User"**
6. ✅ Done! Go to Step 6 to test

### Step 5: Create User (If Not Exists)

1. Click **"Add User"** button (top right)
2. Fill in:
   - **Email:** `applicantadmin@campus.edu`
   - **Password:** `Applicant123!`
   - **Auto Confirm User:** ✅ Check this box
3. Click **"Create User"**
4. Now go to **SQL Editor** (left sidebar)
5. Click **"New Query"**
6. Copy and paste this SQL:

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

7. Click **"Run"** (or press Ctrl+Enter)
8. ✅ Done! Go to Step 6 to test

### Step 6: Test the Login

1. Open your terminal
2. Go to your project:
   ```bash
   cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
   ```

3. Start the app:
   ```bash
   npm run dev
   ```

4. Open browser: http://localhost:3000/login

5. Login with:
   - **Email:** `applicantadmin@campus.edu`
   - **Password:** `Applicant123!`

6. Click **"Login"**

### Step 7: Verify It Works

After logging in, you should see:

✅ **You SHOULD see:**
- Dashboard page
- "Applicant Management" subtitle
- All 10 applicant pages in sidebar
- No "Switch Portal" button

❌ **You should NOT see:**
- "Switch Portal" button
- Student management pages

---

## 🎯 Quick Links

- **Supabase Dashboard:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi
- **Authentication Users:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/auth/users
- **SQL Editor:** https://supabase.com/dashboard/project/swkeqzjrlraadglfdmgi/sql/new

---

## 📝 Login Credentials

**Applicant Admin:**
- Email: `applicantadmin@campus.edu`
- Password: `Applicant123!`

**Super Admin:**
- Email: `admin@campus.edu`
- Password: (your existing password)

**Student Admin:**
- Email: `studentadmin@campus.edu`
- Password: (your existing password)

---

## ❓ Troubleshooting

### "User not found" when logging in
- Make sure you created the user in Supabase Auth
- Check the email is exactly: `applicantadmin@campus.edu`

### "Invalid password"
- Make sure you saved the password in Supabase
- Try resetting it again
- Password is case-sensitive: `Applicant123!`

### Still see "Switch Portal" button
- Make sure you're logged in as `applicantadmin@campus.edu`
- NOT as `admin@campus.edu`
- Try logging out and logging back in

### Can't access Supabase Dashboard
- Make sure you're logged into Supabase
- Use the account that owns this project
- Project ID: `swkeqzjrlraadglfdmgi`

---

## 🎉 That's It!

Once you set the password in Supabase, your applicant admin can login and start working!

**Password to use:** `Applicant123!`

(You can change it later if you want)
