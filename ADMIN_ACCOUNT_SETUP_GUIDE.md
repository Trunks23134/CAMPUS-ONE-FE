# Admin Account System - Setup Guide

## Overview
This system creates **separate admin accounts** that are completely independent from applicant accounts. Admins have their own login, permissions, and activity tracking.

## 🚀 Quick Setup (3 Steps)

### Step 1: Run the SQL Schema
1. Go to your Supabase Dashboard: https://swkeqzjrlraadglfdmgi.supabase.co
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the entire contents of `SUPABASE_ADMIN_SCHEMA.sql`
5. Click **Run** (or press Ctrl+Enter)

This creates:
- ✅ `admin_users` table
- ✅ `admin_permissions` table
- ✅ `admin_activity_logs` table
- ✅ `admin_sessions` table
- ✅ All necessary functions and security policies

### Step 2: Create Your First Super Admin
After running the schema, create your first admin account:

```sql
-- 1. First, create the auth user in Supabase Auth
-- Go to Authentication > Users > Add User
-- Email: your-email@campus.edu
-- Password: YourSecurePassword123
-- Then run this SQL (replace the email):

INSERT INTO admin_users (auth_id, email, full_name, role, department, permissions)
SELECT 
  id,
  'your-email@campus.edu',  -- ⚠️ CHANGE THIS
  'System Administrator',
  'super_admin',
  'IT',
  (SELECT jsonb_agg(permission_key) FROM admin_permissions)
FROM auth.users
WHERE email = 'your-email@campus.edu'  -- ⚠️ CHANGE THIS
ON CONFLICT (email) DO NOTHING;
```

### Step 3: Login as Admin
1. Go to: http://localhost:3000/login
2. Enter your admin email and password
3. You'll be redirected to: http://localhost:3000/admin

## 📋 Features

### 1. Role-Based Access Control
Three admin roles with different permission levels:

- **Super Admin** - Full access to everything
- **Admin** - Standard admin access
- **Staff** - Limited access

### 2. Granular Permissions
Permissions are organized by module:

**Applications Module:**
- `applications.view` - View all applications
- `applications.approve` - Approve applications
- `applications.reject` - Reject applications
- `applications.edit` - Edit application details

**Documents Module:**
- `documents.view` - View applicant documents
- `documents.verify` - Verify documents

**Examinations Module:**
- `exams.view` - View exam schedules
- `exams.create` - Create exam schedules
- `exams.encode` - Encode exam scores

**Interviews Module:**
- `interviews.view` - View interview schedules
- `interviews.schedule` - Schedule interviews

**Configuration Module:**
- `config.view` - View system configuration
- `config.edit` - Edit system configuration

**Reports Module:**
- `reports.view` - View analytics and reports
- `reports.export` - Export reports

**Help Desk Module:**
- `helpdesk.view` - View support tickets
- `helpdesk.respond` - Respond to tickets
- `helpdesk.resolve` - Resolve tickets

**Admin Management:**
- `admin.view` - View admin users
- `admin.create` - Create admin users
- `admin.edit` - Edit admin users
- `admin.delete` - Delete admin users

### 3. Activity Logging
Every admin action is logged:
- Who performed the action
- What action was performed
- When it happened
- What entity was affected
- Additional details (JSON)

### 4. Security Features
- ✅ Row Level Security (RLS) enabled
- ✅ Separate from applicant authentication
- ✅ Password hashing by Supabase Auth
- ✅ Session management
- ✅ Activity audit trail
- ✅ Permission-based access control

## 🎯 How to Use

### Creating New Admin Accounts

**Option 1: Through the UI (Recommended)**
1. Login as Super Admin
2. Go to Admin Management page
3. Click "Create Admin Account"
4. Fill in the form:
   - Full Name
   - Email
   - Password
   - Role (Staff/Admin/Super Admin)
   - Department (optional)
5. Click "Create Admin"

**Option 2: Through SQL**
```sql
-- Create auth user first in Supabase Dashboard
-- Then insert into admin_users table
INSERT INTO admin_users (auth_id, email, full_name, role, department)
SELECT 
  id,
  'newadmin@campus.edu',
  'New Admin Name',
  'admin',
  'Admissions'
FROM auth.users
WHERE email = 'newadmin@campus.edu';
```

### Managing Permissions

**Assign Permissions to Admin:**
```typescript
import { assignPermissions } from '@/app/admin/services/admin-auth.service';

await assignPermissions(adminId, [
  'applications.view',
  'applications.approve',
  'documents.view',
  'documents.verify'
]);
```

**Check if Admin Has Permission:**
```typescript
import { hasPermission } from '@/app/admin/services/admin-auth.service';

const canApprove = await hasPermission(adminId, 'applications.approve');
if (canApprove) {
  // Allow approval
}
```

### Logging Admin Activities

Activities are automatically logged, but you can also log custom actions:

```typescript
import { logAdminActivity } from '@/app/admin/services/admin-auth.service';

await logAdminActivity(
  adminId,
  'application.approved',
  'application',
  applicationId,
  { reason: 'Met all requirements' }
);
```

## 🔐 Security Best Practices

### 1. Password Requirements
- Minimum 6 characters (enforced by Supabase)
- Recommend: 12+ characters with mix of uppercase, lowercase, numbers, symbols

### 2. Role Assignment
- Only give Super Admin role to trusted personnel
- Use Staff role for limited access
- Regularly review admin permissions

### 3. Activity Monitoring
- Regularly check `admin_activity_logs` table
- Monitor for suspicious activities
- Review failed login attempts

### 4. Account Management
- Deactivate accounts when staff leaves
- Don't delete accounts (for audit trail)
- Use `is_active` flag to disable access

## 📊 Database Schema

### admin_users
```sql
id                UUID PRIMARY KEY
auth_id           UUID (links to auth.users)
email             TEXT UNIQUE
full_name         TEXT
role              TEXT (super_admin, admin, staff)
department        TEXT
permissions       JSONB (array of permission keys)
is_active         BOOLEAN
last_login_at     TIMESTAMPTZ
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
created_by        UUID (references admin_users)
```

### admin_permissions
```sql
id                UUID PRIMARY KEY
permission_key    TEXT UNIQUE
permission_name   TEXT
description       TEXT
module            TEXT
created_at        TIMESTAMPTZ
```

### admin_activity_logs
```sql
id                UUID PRIMARY KEY
admin_id          UUID (references admin_users)
action            TEXT
entity_type       TEXT
entity_id         TEXT
details           JSONB
ip_address        TEXT
user_agent        TEXT
created_at        TIMESTAMPTZ
```

## 🔧 Troubleshooting

### Issue: Can't create admin account
**Solution:** Make sure you created the auth user in Supabase Auth first
1. Go to Authentication > Users
2. Click "Add User"
3. Enter email and password
4. Then run the INSERT query

### Issue: Admin can't login
**Solution:** Check if account is active
```sql
SELECT * FROM admin_users WHERE email = 'admin@campus.edu';
-- Make sure is_active = true
```

### Issue: Permission denied errors
**Solution:** Check RLS policies are enabled
```sql
-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'admin%';
```

## 📝 API Reference

### Service Functions

```typescript
// Create admin account
createAdminAccount(data: CreateAdminData)

// Get all admins
getAllAdminUsers()

// Get admin by ID
getAdminUserById(adminId: string)

// Get current logged-in admin
getCurrentAdminUser()

// Update admin
updateAdminUser(adminId: string, updates: Partial<AdminUser>)

// Deactivate admin
deactivateAdminUser(adminId: string)

// Check permission
hasPermission(adminId: string, permission: string)

// Log activity
logAdminActivity(adminId, action, entityType?, entityId?, details?)

// Get activity logs
getAdminActivityLogs(adminId?, limit?)

// Get all permissions
getAllPermissions()

// Assign permissions
assignPermissions(adminId: string, permissions: string[])

// Change password
changeAdminPassword(adminId: string, newPassword: string)
```

## 🎨 UI Components Created

1. **AdminManagementPage.tsx** - Manage admin accounts
   - View all admins
   - Create new admins
   - Deactivate admins
   - Manage permissions

## 🚦 Next Steps

1. ✅ Run the SQL schema
2. ✅ Create your first super admin
3. ✅ Login and test
4. ⏭️ Create additional admin accounts as needed
5. ⏭️ Assign appropriate permissions
6. ⏭️ Monitor activity logs regularly

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify your Supabase connection
3. Check browser console for errors
4. Review Supabase logs in Dashboard

## 🔄 Updates & Maintenance

### Adding New Permissions
```sql
INSERT INTO admin_permissions (permission_key, permission_name, description, module)
VALUES ('new.permission', 'New Permission', 'Description', 'module_name');
```

### Viewing All Admin Activity
```sql
SELECT 
  al.*,
  au.full_name,
  au.email
FROM admin_activity_logs al
JOIN admin_users au ON al.admin_id = au.id
ORDER BY al.created_at DESC
LIMIT 100;
```

### Checking Active Sessions
```sql
SELECT 
  s.*,
  au.full_name,
  au.email
FROM admin_sessions s
JOIN admin_users au ON s.admin_id = au.id
WHERE s.expires_at > NOW()
ORDER BY s.created_at DESC;
```

---

**Your admin system is now ready! 🎉**

Start by creating your first super admin account and you'll have full control over the admissions system.
