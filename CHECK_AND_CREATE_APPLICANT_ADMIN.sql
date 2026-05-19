-- ============================================================================
-- CHECK AND CREATE APPLICANT ADMIN ACCOUNT
-- ============================================================================
-- Run this in Supabase SQL Editor to check if applicant admin exists
-- and create the admin_users entry if needed
-- ============================================================================

-- ─── Step 1: Check if user exists in auth.users ──────────────────────────────
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  CASE 
    WHEN last_sign_in_at IS NULL THEN '⚠️ Never logged in - Password may need to be set'
    ELSE '✅ Has logged in before'
  END as status
FROM auth.users
WHERE email = 'applicantadmin@campus.edu';

-- ─── Step 2: Check if user exists in admin_users ─────────────────────────────
SELECT 
  id,
  email,
  full_name,
  role,
  department,
  is_active,
  CASE 
    WHEN is_active THEN '✅ Active'
    ELSE '❌ Inactive'
  END as status
FROM admin_users
WHERE email = 'applicantadmin@campus.edu';

-- ─── Step 3: If user exists in auth but NOT in admin_users, run this ─────────
-- This links the auth user to the admin_users table
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

-- ─── Step 4: Verify the user is now in admin_users ───────────────────────────
SELECT 
  au.id,
  au.email,
  au.full_name,
  au.role,
  au.department,
  au.is_active,
  au.permissions,
  u.last_sign_in_at,
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN '⚠️ Password needs to be set in Supabase Auth'
    ELSE '✅ Ready to login'
  END as status
FROM admin_users au
JOIN auth.users u ON au.auth_id = u.id
WHERE au.email = 'applicantadmin@campus.edu';

-- ─── Step 5: Check all admin users ───────────────────────────────────────────
-- This shows all your admin accounts
SELECT 
  au.email,
  au.full_name,
  au.role,
  au.is_active,
  u.last_sign_in_at,
  CASE 
    WHEN u.last_sign_in_at IS NULL THEN '⚠️ Never logged in'
    ELSE '✅ Has logged in'
  END as login_status
FROM admin_users au
LEFT JOIN auth.users u ON au.auth_id = u.id
ORDER BY au.role, au.email;

-- ============================================================================
-- RESULTS INTERPRETATION
-- ============================================================================

-- If Step 1 returns NO ROWS:
--   ❌ User doesn't exist in Supabase Auth
--   ➡️ Go to Supabase Dashboard → Authentication → Users → Add User
--   ➡️ Email: applicantadmin@campus.edu
--   ➡️ Password: Applicant123!
--   ➡️ Then run Step 3

-- If Step 1 returns a row but last_sign_in_at is NULL:
--   ⚠️ User exists but never logged in (password may need to be set)
--   ➡️ Go to Supabase Dashboard → Authentication → Users
--   ➡️ Click on applicantadmin@campus.edu
--   ➡️ Click "Update User" and set password: Applicant123!

-- If Step 2 returns NO ROWS:
--   ❌ User exists in auth but not linked to admin_users
--   ➡️ Run Step 3 to link them

-- If Step 2 returns a row:
--   ✅ User is properly set up in admin_users
--   ➡️ Just need to set password in Supabase Auth (if not already set)

-- If Step 4 returns a row with status "Ready to login":
--   ✅ Everything is set up correctly!
--   ➡️ Test login at http://localhost:3000/login

-- ============================================================================
-- QUICK FIX: Create user if completely missing
-- ============================================================================

-- If the user doesn't exist at all, you need to:
-- 1. Create in Supabase Auth first (Dashboard → Authentication → Users → Add User)
-- 2. Then run Step 3 above to link to admin_users

-- You CANNOT create auth users via SQL - must use Supabase Dashboard!

-- ============================================================================
