import type { SchoolLevel, ApplicantType, AdmissionStatus, SupabaseResponse } from "@/applicant/types/admissions.types";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const APPLICATION_API = `${API_BASE_URL}/api/application`;

async function callApplicationApi<T>(endpoint: string, options: RequestInit = {}): Promise<SupabaseResponse<T>> {
  try {
    const response = await fetch(`${APPLICATION_API}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    const payload = await response.json();
    if (!response.ok) return { data: null, error: { message: payload?.message || "Request failed" } };
    return payload as SupabaseResponse<T>;
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ─── Admin Types ──────────────────────────────────────────────────────────────
export interface AdminApplication {
  id: string;
  reference_number: string;
  applicant_number: string | null;
  full_name: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  birthdate: string;
  mobile_number: string;
  address: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  program: string;
  status: AdmissionStatus;
  application_submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface ApplicationDetail extends AdminApplication {
  parent_info: ParentInfo | null;
  academic_background: AcademicEntry[];
  alumni_relatives: AlumniRelative[];
  documents: ApplicationDocument[];
  program_selection: ProgramSelection | null;
}

export interface ParentInfo {
  father_name: string;
  father_address: string;
  father_contact: string;
  mother_name: string;
  mother_address: string;
  mother_contact: string;
  guardian_name: string | null;
  guardian_address: string | null;
  guardian_phone_home: string | null;
  guardian_phone_work: string | null;
}

export interface AcademicEntry {
  grade_level: string;
  school_name: string;
  completion_year: string;
}

export interface AlumniRelative {
  name: string;
  relationship: string;
  college: string;
  batch_year: string;
  contact_number: string;
}

export interface ApplicationDocument {
  id: string;
  document_name: string;
  file_name: string;
  file_url: string;
  status: string;
  submitted_at: string;
}

export interface ProgramSelection {
  college_department: string | null;
  college_program: string | null;
  senior_high_track: string | null;
  tvl_strand: string | null;
}

export interface DashboardStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

// ─── Fetch Applications ───────────────────────────────────────────────────────
export async function fetchAllApplications(): Promise<SupabaseResponse<AdminApplication[]>> {
  return callApplicationApi<AdminApplication[]>("/admin/applications");
}

// ─── Fetch Application Detail ─────────────────────────────────────────────────
export async function fetchApplicationDetail(applicationId: string): Promise<SupabaseResponse<ApplicationDetail>> {
  return callApplicationApi<ApplicationDetail>(`/admin/applications/${applicationId}`);
}

// ─── Update Application Status ────────────────────────────────────────────────
export async function updateApplicationStatus(
  applicationId: string,
  status: AdmissionStatus,
  rejectionReason?: string
): Promise<SupabaseResponse<{ success: boolean }>> {
  return callApplicationApi<{ success: boolean }>(`/admin/applications/${applicationId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, rejectionReason }),
  });
}

// ─── Fetch Dashboard Stats ────────────────────────────────────────────────────
export async function fetchDashboardStats(): Promise<SupabaseResponse<DashboardStats>> {
  return callApplicationApi<DashboardStats>("/admin/stats");
}

// ─── Update Program Selection ─────────────────────────────────────────────────
export async function updateProgramSelection(
  applicationId: string,
  department: string,
  program: string
): Promise<SupabaseResponse<{ success: boolean }>> {
  return callApplicationApi<{ success: boolean }>(`/admin/applications/${applicationId}/program-selection`, {
    method: "PUT",
    body: JSON.stringify({ department, program }),
  });
}
