# Quick Admin Setup Guide

## ✅ Your Existing Admins

You already have these admin accounts:
- **admin@campus.edu** - Super Admin
- **studentadmin@campus.edu** - Student Admin

## 🚀 Add the Missing Tables & Features

Since you already have the `admin_users` table, you just need to add the additional features:

### Step 1: Run This SQL in Supabase

Go to your Supabase SQL Editor and run:

```sql
-- ============================================================================
-- ADD MISSING ADMIN FEATURES TO EXISTING SYSTEM
-- ============================================================================

-- ─── 1. Admin Permissions Table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT UNIQUE NOT NULL,
  permission_name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. Admin Activity Logs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Admin Sessions Table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Add Missing Columns to admin_users (if they don't exist) ─────────────
DO $$ 
BEGIN
  -- Add permissions column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'permissions'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN permissions JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add is_active column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;

  -- Add last_login_at column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'last_login_at'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN last_login_at TIMESTAMPTZ;
  END IF;

  -- Add created_by column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN created_by UUID REFERENCES admin_users(id);
  END IF;
END $$;

-- ─── 5. Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);

-- ─── 6. Enable RLS ────────────────────────────────────────────────────────────
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admins can view permissions
CREATE POLICY "Admins can view permissions" ON admin_permissions
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid())
  );

-- Admins can view activity logs
CREATE POLICY "Admins can view activity logs" ON admin_activity_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM admin_users WHERE auth_id = auth.uid())
  );

-- ─── 7. Helper Functions ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION log_admin_activity(
  p_admin_id UUID,
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_activity_logs (
    admin_id, action, entity_type, entity_id, details
  ) VALUES (
    p_admin_id, p_action, p_entity_type, p_entity_id, p_details
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION has_admin_permission(
  p_admin_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_has_permission BOOLEAN;
BEGIN
  SELECT 
    role = 'super_admin' OR 
    permissions @> to_jsonb(ARRAY[p_permission])
  INTO v_has_permission
  FROM admin_users
  WHERE id = p_admin_id AND is_active = true;
  
  RETURN COALESCE(v_has_permission, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── 8. Insert Default Permissions ───────────────────────────────────────────
INSERT INTO admin_permissions (permission_key, permission_name, description, module) VALUES
  -- Applications
  ('applications.view', 'View Applications', 'Can view all applications', 'applications'),
  ('applications.approve', 'Approve Applications', 'Can approve applications', 'applications'),
  ('applications.reject', 'Reject Applications', 'Can reject applications', 'applications'),
  ('applications.edit', 'Edit Applications', 'Can edit application details', 'applications'),
  
  -- Documents
  ('documents.view', 'View Documents', 'Can view applicant documents', 'documents'),
  ('documents.verify', 'Verify Documents', 'Can verify documents', 'documents'),
  
  -- Exams
  ('exams.view', 'View Exams', 'Can view exam schedules', 'exams'),
  ('exams.create', 'Create Exams', 'Can create exam schedules', 'exams'),
  ('exams.encode', 'Encode Scores', 'Can encode exam scores', 'exams'),
  
  -- Interviews
  ('interviews.view', 'View Interviews', 'Can view interview schedules', 'interviews'),
  ('interviews.schedule', 'Schedule Interviews', 'Can schedule interviews', 'interviews'),
  
  -- Configuration
  ('config.view', 'View Configuration', 'Can view system configuration', 'config'),
  ('config.edit', 'Edit Configuration', 'Can edit system configuration', 'config'),
  
  -- Reports
  ('reports.view', 'View Reports', 'Can view analytics and reports', 'reports'),
  ('reports.export', 'Export Reports', 'Can export reports', 'reports'),
  
  -- Help Desk
  ('helpdesk.view', 'View Tickets', 'Can view support tickets', 'helpdesk'),
  ('helpdesk.respond', 'Respond to Tickets', 'Can respond to tickets', 'helpdesk'),
  ('helpdesk.resolve', 'Resolve Tickets', 'Can resolve tickets', 'helpdesk'),
  
  -- Admin Management
  ('admin.view', 'View Admins', 'Can view admin users', 'admin'),
  ('admin.create', 'Create Admins', 'Can create admin users', 'admin'),
  ('admin.edit', 'Edit Admins', 'Can edit admin users', 'admin'),
  ('admin.delete', 'Delete Admins', 'Can delete admin users', 'admin')
ON CONFLICT (permission_key) DO NOTHING;

-- ─── 9. Give Super Admin All Permissions ─────────────────────────────────────
UPDATE admin_users 
SET permissions = (SELECT jsonb_agg(permission_key) FROM admin_permissions)
WHERE role = 'super_admin';

-- ─── 10. Give Applicant Admin Relevant Permissions ───────────────────────────
UPDATE admin_users 
SET permissions = (
  SELECT jsonb_agg(permission_key) 
  FROM admin_permissions 
  WHERE module IN ('applications', 'documents', 'exams', 'interviews', 'config', 'reports', 'helpdesk')
)
WHERE role = 'applicant_admin';

-- ─── 11. Give Student Admin Relevant Permissions ─────────────────────────────
UPDATE admin_users 
SET permissions = (
  SELECT jsonb_agg(permission_key) 
  FROM admin_permissions 
  WHERE module IN ('config', 'reports')
)
WHERE role = 'student_admin';
```

### Step 2: Test Your Setup

1. **Login as Super Admin:**
   - Email: `admin@campus.edu`
   - Go to: http://localhost:3000/login

2. **You should now have access to:**
   - ✅ All 10 admin pages
   - ✅ Admin Management page
   - ✅ Permission system
   - ✅ Activity logging

### Step 3: Create an Applicant Admin (Optional)

If you want to create a dedicated applicant admin:

1. In Supabase Dashboard → **Authentication** → **Users** → **Add User**
   - Email: `applicantadmin@campus.edu`
   - Password: `YourPassword123`

2. Then run this SQL:
```sql
INSERT INTO admin_users (auth_id, email, full_name, role, department, permissions)
SELECT 
  id,
  'applicantadmin@campus.edu',
  'Applicant Administrator',
  'applicant_admin',
  'Admissions',
  (SELECT jsonb_agg(permission_key) FROM admin_permissions WHERE module IN ('applications', 'documents', 'exams', 'interviews', 'config', 'reports', 'helpdesk'))
FROM auth.users
WHERE email = 'applicantadmin@campus.edu'
ON CONFLICT (email) DO NOTHING;
```

## 🎯 Admin Roles Explained

### Super Admin (`super_admin`)
- **Full access** to everything
- Can manage other admins
- Can access all modules
- **Your account:** admin@campus.edu

### Applicant Admin (`applicant_admin`)
- Manages applicant admissions process
- Access to:
  - Application Queue
  - Document Verification
  - Selection & Decisioning
  - Entrance Examinations
  - Interview Coordination
  - Eligibility Criteria
  - Enrollment Quotas
  - Admissions Analytics
  - Applicant Help Desk
  - Transmission Logs

### Student Admin (`student_admin`)
- Manages enrolled students
- Access to student portal features
- **Your account:** studentadmin@campus.edu

### Alumni Admin (`alumni_admin`)
- Manages alumni relations
- Access to alumni portal features

## 📊 What You Get

✅ **Existing Admins Work** - Your current admin accounts are preserved
✅ **New Features Added:**
  - Permission system
  - Activity logging
  - Session management
  - Admin management UI

✅ **10 New Admin Pages:**
  1. Application Queue
  2. Document Verification
  3. Selection & Decisioning
  4. Entrance Examination
  5. Interview Coordination
  6. Eligibility Criteria
  7. Enrollment Quotas
  8. Admissions Analytics
  9. Applicant Help Desk
  10. Transmission Logs

## 🔐 Security

- ✅ Row Level Security enabled
- ✅ Activity logging for audit trail
- ✅ Permission-based access control
- ✅ Separate from applicant authentication

## 🎉 You're Done!

Your admin system is now fully set up with:
- ✅ Existing admins preserved
- ✅ New features added
- ✅ Permission system active
- ✅ All admin pages working

**Login and start managing applications!** 🚀
