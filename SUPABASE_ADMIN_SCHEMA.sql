-- ============================================================================
-- ADMIN AUTHENTICATION & AUTHORIZATION SYSTEM
-- ============================================================================
-- This schema creates a complete admin system separate from applicants
-- ============================================================================

-- ─── 1. Admin Users Table ────────────────────────────────────────────────────
-- Stores admin account information
-- NOTE: If table already exists, this will be skipped
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'applicant_admin' CHECK (role IN ('student_admin', 'applicant_admin', 'alumni_admin', 'super_admin')),
  department TEXT, -- e.g., 'Admissions', 'Registrar', 'Finance'
  permissions JSONB DEFAULT '[]'::jsonb, -- Array of permission strings
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id)
);

-- Update constraint if table already exists
DO $$ 
BEGIN
  -- Drop old constraint if it exists
  ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_role_check;
  
  -- Add new constraint with correct roles
  ALTER TABLE admin_users ADD CONSTRAINT admin_users_role_check 
    CHECK (role IN ('student_admin', 'applicant_admin', 'alumni_admin', 'super_admin'));
EXCEPTION
  WHEN OTHERS THEN
    -- Table might not exist yet, that's okay
    NULL;
END $$;

-- ─── 2. Admin Permissions Table ──────────────────────────────────────────────
-- Defines available permissions in the system
CREATE TABLE IF NOT EXISTS admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  permission_key TEXT UNIQUE NOT NULL, -- e.g., 'applications.view', 'applications.approve'
  permission_name TEXT NOT NULL,
  description TEXT,
  module TEXT NOT NULL, -- e.g., 'applications', 'students', 'reports'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. Admin Activity Logs ──────────────────────────────────────────────────
-- Tracks all admin actions for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g., 'application.approved', 'user.created'
  entity_type TEXT, -- e.g., 'application', 'student', 'admin'
  entity_id TEXT,
  details JSONB, -- Additional context about the action
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. Admin Sessions Table ─────────────────────────────────────────────────
-- Tracks active admin sessions
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 5. Indexes for Performance ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_id ON admin_users(auth_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_id ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_id ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);

-- ─── 6. Row Level Security (RLS) Policies ────────────────────────────────────
-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin users can view all admins
CREATE POLICY "Admins can view all admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid()
    )
  );

-- Only super admins can insert/update/delete admin users
CREATE POLICY "Super admins can manage admin users"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Admins can view their own activity logs
CREATE POLICY "Admins can view activity logs"
  ON admin_activity_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_id = auth.uid()
    )
  );

-- ─── 7. Functions ────────────────────────────────────────────────────────────

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for admin_users
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to log admin activity
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
    admin_id,
    action,
    entity_type,
    entity_id,
    details
  ) VALUES (
    p_admin_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_details
  ) RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check admin permission
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
  -- Applications Module
  ('applications.view', 'View Applications', 'Can view all applications', 'applications'),
  ('applications.approve', 'Approve Applications', 'Can approve applications', 'applications'),
  ('applications.reject', 'Reject Applications', 'Can reject applications', 'applications'),
  ('applications.edit', 'Edit Applications', 'Can edit application details', 'applications'),
  
  -- Documents Module
  ('documents.view', 'View Documents', 'Can view applicant documents', 'documents'),
  ('documents.verify', 'Verify Documents', 'Can verify documents', 'documents'),
  
  -- Examinations Module
  ('exams.view', 'View Exams', 'Can view exam schedules', 'exams'),
  ('exams.create', 'Create Exams', 'Can create exam schedules', 'exams'),
  ('exams.encode', 'Encode Scores', 'Can encode exam scores', 'exams'),
  
  -- Interviews Module
  ('interviews.view', 'View Interviews', 'Can view interview schedules', 'interviews'),
  ('interviews.schedule', 'Schedule Interviews', 'Can schedule interviews', 'interviews'),
  
  -- Configuration Module
  ('config.view', 'View Configuration', 'Can view system configuration', 'config'),
  ('config.edit', 'Edit Configuration', 'Can edit system configuration', 'config'),
  
  -- Reports Module
  ('reports.view', 'View Reports', 'Can view analytics and reports', 'reports'),
  ('reports.export', 'Export Reports', 'Can export reports', 'reports'),
  
  -- Help Desk Module
  ('helpdesk.view', 'View Tickets', 'Can view support tickets', 'helpdesk'),
  ('helpdesk.respond', 'Respond to Tickets', 'Can respond to tickets', 'helpdesk'),
  ('helpdesk.resolve', 'Resolve Tickets', 'Can resolve tickets', 'helpdesk'),
  
  -- Admin Management
  ('admin.view', 'View Admins', 'Can view admin users', 'admin'),
  ('admin.create', 'Create Admins', 'Can create admin users', 'admin'),
  ('admin.edit', 'Edit Admins', 'Can edit admin users', 'admin'),
  ('admin.delete', 'Delete Admins', 'Can delete admin users', 'admin')
ON CONFLICT (permission_key) DO NOTHING;

-- ─── 9. Create Default Super Admin ───────────────────────────────────────────
-- NOTE: You'll need to create this user in Supabase Auth first, then run this
-- Your existing admins:
-- - admin@campus.edu (super_admin)
-- - studentadmin@campus.edu (student_admin)

-- Example to add a new applicant admin:
-- INSERT INTO admin_users (auth_id, email, full_name, role, department, permissions)
-- SELECT 
--   id,
--   'applicantadmin@campus.edu',
--   'Applicant Administrator',
--   'applicant_admin',
--   'Admissions',
--   (SELECT jsonb_agg(permission_key) FROM admin_permissions WHERE module IN ('applications', 'documents', 'exams', 'interviews', 'config', 'reports', 'helpdesk'))
-- FROM auth.users
-- WHERE email = 'applicantadmin@campus.edu'
-- ON CONFLICT (email) DO NOTHING;

-- ─── 10. Helper Views ────────────────────────────────────────────────────────

-- View for admin users with permission details
CREATE OR REPLACE VIEW admin_users_with_permissions AS
SELECT 
  au.id,
  au.email,
  au.full_name,
  au.role,
  au.department,
  au.is_active,
  au.last_login_at,
  au.created_at,
  au.permissions,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'key', ap.permission_key,
        'name', ap.permission_name,
        'module', ap.module
      )
    )
    FROM admin_permissions ap
    WHERE au.permissions @> to_jsonb(ARRAY[ap.permission_key])
  ) as permission_details
FROM admin_users au
WHERE au.is_active = true;

COMMENT ON TABLE admin_users IS 'Stores admin user accounts separate from applicants';
COMMENT ON TABLE admin_permissions IS 'Defines available permissions in the system';
COMMENT ON TABLE admin_activity_logs IS 'Audit trail of all admin actions';
COMMENT ON TABLE admin_sessions IS 'Tracks active admin sessions';
