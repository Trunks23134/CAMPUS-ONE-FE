-- ============================================================================
-- CHECK IF APPLICANT ADMIN IS PROPERLY CONNECTED
-- ============================================================================
-- Run this in Supabase SQL Editor to verify everything is connected
-- ============================================================================

-- ─── 1. Check if user exists in auth.users ───────────────────────────────────
SELECT 
  '✅ Step 1: Check auth.users' as check_step,
  id as auth_id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Email confirmed'
    ELSE '⚠️ Email NOT confirmed'
  END as email_status,
  CASE 
    WHEN encrypted_password IS NOT NULL THEN '✅ Password is set'
    ELSE '❌ Password NOT set'
  END as password_status
FROM auth.users
WHERE email = 'applicantadmin@campus.edu';

-- ─── 2. Check if user exists in admin_users ──────────────────────────────────
SELECT 
  '✅ Step 2: Check admin_users' as check_step,
  id,
  auth_id,
  email,
  full_name,
  role,
  department,
  is_active,
  permissions,
  CASE 
    WHEN is_active THEN '✅ Account is active'
    ELSE '❌ Account is inactive'
  END as status,
  CASE 
    WHEN auth_id IS NOT NULL THEN '✅ Linked to auth.users'
    ELSE '❌ NOT linked to auth.users'
  END as link_status
FROM admin_users
WHERE email = 'applicantadmin@campus.edu';

-- ─── 3. Check if auth_id matches between tables ──────────────────────────────
SELECT 
  '✅ Step 3: Verify Connection' as check_step,
  au.email,
  au.full_name,
  au.role,
  au.auth_id as admin_users_auth_id,
  u.id as auth_users_id,
  CASE 
    WHEN au.auth_id = u.id THEN '✅ CONNECTED - auth_id matches!'
    ELSE '❌ NOT CONNECTED - auth_id does not match!'
  END as connection_status,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Email confirmed'
    ELSE '⚠️ Email NOT confirmed'
  END as email_status,
  CASE 
    WHEN u.encrypted_password IS NOT NULL THEN '✅ Password set'
    ELSE '❌ Password NOT set'
  END as password_status
FROM admin_users au
LEFT JOIN auth.users u ON au.auth_id = u.id
WHERE au.email = 'applicantadmin@campus.edu';

-- ─── 4. Check permissions assigned ───────────────────────────────────────────
SELECT 
  '✅ Step 4: Check Permissions' as check_step,
  email,
  role,
  permissions,
  jsonb_array_length(permissions) as permission_count,
  CASE 
    WHEN jsonb_array_length(permissions) > 0 THEN '✅ Has permissions'
    ELSE '⚠️ No permissions assigned'
  END as permission_status
FROM admin_users
WHERE email = 'applicantadmin@campus.edu';

-- ─── 5. List all permissions for applicant admin ─────────────────────────────
SELECT 
  '✅ Step 5: List All Permissions' as check_step,
  jsonb_array_elements_text(permissions) as permission_key
FROM admin_users
WHERE email = 'applicantadmin@campus.edu';

-- ─── 6. Check if admin_permissions table has data ────────────────────────────
SELECT 
  '✅ Step 6: Available Permissions' as check_step,
  COUNT(*) as total_permissions,
  COUNT(CASE WHEN module IN ('applications', 'documents', 'exams', 'interviews', 'config', 'reports', 'helpdesk') THEN 1 END) as applicant_admin_permissions
FROM admin_permissions;

-- ============================================================================
-- INTERPRETATION OF RESULTS
-- ============================================================================

-- ✅ FULLY CONNECTED if:
--    - Step 1 shows user exists in auth.users
--    - Step 2 shows user exists in admin_users
--    - Step 3 shows "CONNECTED - auth_id matches!"
--    - Step 4 shows "Has permissions"
--    - Step 5 shows list of permissions
--    - Step 6 shows permissions exist

-- ⚠️ PARTIALLY CONNECTED if:
--    - User exists in auth.users but NOT in admin_users
--    - OR auth_id doesn't match
--    - OR no permissions assigned

-- ❌ NOT CONNECTED if:
--    - User doesn't exist in auth.users
--    - OR doesn't exist in admin_users
--    - OR auth_id is NULL

-- ============================================================================
-- FIX IF NOT CONNECTED
-- ============================================================================

-- If Step 3 shows NOT CONNECTED, run this:
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
ON CONFLICT (email) 
DO UPDATE SET
  auth_id = EXCLUDED.auth_id,
  permissions = EXCLUDED.permissions,
  updated_at = NOW();

-- ============================================================================
