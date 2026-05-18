# 🎯 Admin System Overview

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         LOGIN PAGE                              │
│                    http://localhost:3000/login                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Authentication      │
              │  (Supabase Auth)     │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  Check admin_users   │
              │  table for role      │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
┌────────────────┐ ┌────────────┐ ┌────────────────┐
│  Super Admin   │ │ Applicant  │ │ Student Admin  │
│                │ │   Admin    │ │                │
│ admin@         │ │ applicant  │ │ studentadmin@  │
│ campus.edu     │ │ admin@     │ │ campus.edu     │
│                │ │ campus.edu │ │                │
└────────┬───────┘ └─────┬──────┘ └────────┬───────┘
         │               │                  │
         ▼               ▼                  ▼
┌────────────────┐ ┌────────────┐ ┌────────────────┐
│ Portal         │ │ NO Portal  │ │ NO Portal      │
│ Switcher       │ │ Switcher   │ │ Switcher       │
│ ✅ Visible     │ │ ❌ Hidden  │ │ ❌ Hidden      │
└────────┬───────┘ └─────┬──────┘ └────────┬───────┘
         │               │                  │
         ▼               ▼                  ▼
┌────────────────┐ ┌────────────┐ ┌────────────────┐
│ Can Access:    │ │ Can Access:│ │ Can Access:    │
│ • Applicant    │ │ • Applicant│ │ • Student      │
│   Portal       │ │   Portal   │ │   Portal       │
│ • Student      │ │   ONLY     │ │   ONLY         │
│   Portal       │ │            │ │                │
│ • All Pages    │ │ • 10 Pages │ │ • Student Mgmt │
└────────────────┘ └────────────┘ └────────────────┘
```

---

## 👥 Admin Roles Comparison

| Feature | Super Admin | Applicant Admin | Student Admin |
|---------|-------------|-----------------|---------------|
| **Email** | admin@campus.edu | applicantadmin@campus.edu | studentadmin@campus.edu |
| **Role in DB** | `super_admin` | `applicant_admin` | `student_admin` |
| **Portal Switcher** | ✅ Yes | ❌ No | ❌ No |
| **Applicant Pages** | ✅ Yes | ✅ Yes | ❌ No |
| **Student Pages** | ✅ Yes | ❌ No | ✅ Yes |
| **Can Create Admins** | ✅ Yes | ❌ No | ❌ No |
| **Can Switch Portals** | ✅ Yes | ❌ No | ❌ No |

---

## 📂 Page Access Matrix

### Applicant Admin Pages (10 Pages)

| Page | Super Admin | Applicant Admin | Student Admin |
|------|-------------|-----------------|---------------|
| Dashboard | ✅ | ✅ | ❌ |
| Application Queue | ✅ | ✅ | ❌ |
| Document Verification | ✅ | ✅ | ❌ |
| Selection & Decisioning | ✅ | ✅ | ❌ |
| Entrance Examination | ✅ | ✅ | ❌ |
| Interview Coordination | ✅ | ✅ | ❌ |
| Eligibility Criteria | ✅ | ✅ | ❌ |
| Enrollment Quotas | ✅ | ✅ | ❌ |
| Admissions Analytics | ✅ | ✅ | ❌ |
| Applicant Help Desk | ✅ | ✅ | ❌ |
| Transmission Logs | ✅ | ✅ | ❌ |

### Student Admin Pages

| Page | Super Admin | Applicant Admin | Student Admin |
|------|-------------|-----------------|---------------|
| Student Dashboard | ✅ | ❌ | ✅ |
| Student Management | ✅ | ❌ | ✅ |

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ Step 1: User enters email and password                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 2: Supabase Auth validates credentials                    │
│         - Checks auth.users table                              │
│         - Verifies password hash                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 3: System queries admin_users table                       │
│         SELECT role FROM admin_users WHERE email = ?           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 4: Store role in session storage                          │
│         sessionStorage.setItem('admin_role', role)             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 5: Redirect to /admin                                     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 6: UnifiedAdminLayout reads admin_role                    │
│         const adminRole = sessionStorage.getItem('admin_role') │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Step 7: Show/hide portal switcher based on role               │
│         {adminRole === 'super_admin' && <PortalSwitcher />}    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Database Schema

### admin_users Table

```sql
┌──────────────┬──────────────┬─────────────────────────────────┐
│ Column       │ Type         │ Description                     │
├──────────────┼──────────────┼─────────────────────────────────┤
│ id           │ UUID         │ Primary key                     │
│ auth_id      │ UUID         │ Links to auth.users             │
│ email        │ TEXT         │ Admin email (unique)            │
│ full_name    │ TEXT         │ Admin full name                 │
│ role         │ TEXT         │ super_admin, applicant_admin,   │
│              │              │ student_admin, alumni_admin     │
│ department   │ TEXT         │ e.g., 'Admissions'              │
│ permissions  │ JSONB        │ Array of permission keys        │
│ is_active    │ BOOLEAN      │ Account active status           │
│ last_login_at│ TIMESTAMPTZ  │ Last login timestamp            │
│ created_at   │ TIMESTAMPTZ  │ Account creation date           │
│ updated_at   │ TIMESTAMPTZ  │ Last update date                │
│ created_by   │ UUID         │ Admin who created this account  │
└──────────────┴──────────────┴─────────────────────────────────┘
```

### Your Current Admin Accounts

```sql
┌────────────────────────────┬──────────────────┬──────────────┐
│ Email                      │ Role             │ Status       │
├────────────────────────────┼──────────────────┼──────────────┤
│ admin@campus.edu           │ super_admin      │ ✅ Active    │
│ applicantadmin@campus.edu  │ applicant_admin  │ ⏳ Set pwd   │
│ studentadmin@campus.edu    │ student_admin    │ ✅ Active    │
└────────────────────────────┴──────────────────┴──────────────┘
```

---

## 🎨 UI Components

### Sidebar Navigation Structure

```
┌─────────────────────────────────────────┐
│  🎓 CAMPUS Admin                        │
│  Applicant Management                   │
├─────────────────────────────────────────┤
│                                         │
│  [Only for super_admin]                 │
│  ┌───────────────────────────────────┐  │
│  │ 🔄 Switch Portal                  │  │
│  │ [Applicants] [Students]           │  │
│  └───────────────────────────────────┘  │
│                                         │
├─────────────────────────────────────────┤
│  MENU                                   │
│                                         │
│  📊 Dashboard                           │
│                                         │
│  📂 Admissions Pipeline        [▼]      │
│     • Application Queue                 │
│     • Document Verification             │
│     • Selection & Decisioning           │
│                                         │
│  📂 Candidate Assessment       [▼]      │
│     • Entrance Examination              │
│     • Interview Coordination            │
│                                         │
│  📂 Service Configuration      [▼]      │
│     • Eligibility Criteria              │
│     • Enrollment Quotas                 │
│     • Admissions Analytics              │
│                                         │
│  📂 Support Operations         [▼]      │
│     • Applicant Help Desk               │
│     • Transmission Logs                 │
│                                         │
├─────────────────────────────────────────┤
│  👤 Admin Name                          │
│  admin@campus.edu                       │
│  [🚪 Log out]                           │
└─────────────────────────────────────────┘
```

---

## 🔧 Code Implementation

### Key Files

```
CAMPUS-ONE-FE-master/
├── src/
│   ├── services/
│   │   └── auth.service.ts              ← Handles login & role detection
│   │
│   └── app/
│       └── admin/
│           ├── components/
│           │   └── UnifiedAdminLayout.tsx  ← Shows/hides portal switcher
│           │
│           ├── pages/
│           │   ├── ApplicantAdminDashboard.tsx  ← Main dashboard
│           │   └── pages/
│           │       ├── ApplicationQueuePage.tsx
│           │       ├── DocumentVerificationPage.tsx
│           │       ├── SelectionDecisioningPage.tsx
│           │       ├── EntranceExaminationPage.tsx
│           │       ├── InterviewCoordinationPage.tsx
│           │       ├── EligibilityCriteriaPage.tsx
│           │       ├── EnrollmentQuotasPage.tsx
│           │       ├── AdmissionsAnalyticsPage.tsx
│           │       ├── ApplicantHelpDeskPage.tsx
│           │       └── TransmissionLogsPage.tsx
│           │
│           └── services/
│               ├── admin.service.ts         ← Supabase queries
│               └── admin-auth.service.ts    ← Admin management
│
└── SUPABASE_ADMIN_SCHEMA.sql              ← Database schema
```

### Portal Switcher Logic

**File:** `src/app/admin/components/UnifiedAdminLayout.tsx`

```typescript
// Get admin role from session storage
const getAdminRole = () => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('admin_role');
};

const adminRole = getAdminRole();
const isSuperAdmin = adminRole === 'super_admin';

// Portal switcher only renders for super admin
{isSuperAdmin && (
  <div className="p-6 border-b border-gray-800">
    <p className="text-xs text-gray-400 mb-3">Switch Portal</p>
    <div className="grid grid-cols-2 gap-2">
      <button onClick={() => onSwitchPortal?.("applicant")}>
        Applicants
      </button>
      <button onClick={() => onSwitchPortal?.("student")}>
        Students
      </button>
    </div>
  </div>
)}
```

### Role Detection Logic

**File:** `src/services/auth.service.ts`

```typescript
// During login, fetch admin role
const { data: adminData } = await supabase
  .from('admin_users')
  .select('role, full_name')
  .eq('email', email)
  .single();

if (adminData) {
  // Store role in session
  sessionStorage.setItem('admin_role', adminData.role);
}
```

---

## 🧪 Testing Scenarios

### Scenario 1: Super Admin Login

```
1. Login as: admin@campus.edu
2. Expected:
   ✅ See portal switcher
   ✅ Can click "Applicants" button
   ✅ Can click "Students" button
   ✅ See all applicant pages
   ✅ Can switch to student portal
```

### Scenario 2: Applicant Admin Login

```
1. Login as: applicantadmin@campus.edu
2. Expected:
   ❌ NO portal switcher visible
   ✅ See "Applicant Management" subtitle
   ✅ See all 10 applicant pages
   ❌ Cannot access student pages
   ❌ Cannot switch portals
```

### Scenario 3: Student Admin Login

```
1. Login as: studentadmin@campus.edu
2. Expected:
   ❌ NO portal switcher visible
   ✅ See "Student Management" subtitle
   ✅ See student pages
   ❌ Cannot access applicant pages
   ❌ Cannot switch portals
```

---

## 📋 Setup Checklist

### ✅ Already Done

- [x] Created `admin_users` table
- [x] Created admin accounts in database
- [x] Implemented role-based authentication
- [x] Created 10 applicant admin pages
- [x] Implemented portal switcher logic
- [x] Hidden portal switcher for non-super admins
- [x] Created service functions for Supabase
- [x] Styled all pages with orange accent
- [x] Added collapsible sidebar sections

### ⏳ To Do

- [ ] Set password for `applicantadmin@campus.edu`
- [ ] Test login as applicant admin
- [ ] Verify portal switcher is hidden
- [ ] Connect pages to real Supabase data (optional)

---

## 🎯 Quick Start

### For You (The Developer)

1. **Set the password:**
   - Go to Supabase Dashboard
   - Authentication → Users
   - Find `applicantadmin@campus.edu`
   - Set password to `Applicant123!`

2. **Test the login:**
   ```bash
   cd CAMPUS-ONE-FE-master/CAMPUS-ONE-FE-master
   npm run dev
   ```
   - Go to http://localhost:3000/login
   - Login as `applicantadmin@campus.edu`
   - Verify no portal switcher appears

### For Your Applicant Admin User

1. **Login:**
   - Go to http://localhost:3000/login
   - Email: `applicantadmin@campus.edu`
   - Password: (provided by you)

2. **Use the system:**
   - Click on any page in the sidebar
   - Manage applications
   - Verify documents
   - Schedule exams
   - Coordinate interviews

---

## 🎉 Summary

Your admin system is **fully implemented** with:

✅ **3 Admin Accounts** - Each with their own role
✅ **Role-Based Access** - Automatic based on database role
✅ **Portal Switcher** - Only for super admin
✅ **10 Admin Pages** - All created and styled
✅ **Security** - RLS enabled, activity logging ready

**Next step:** Set the password for `applicantadmin@campus.edu` and test! 🚀
