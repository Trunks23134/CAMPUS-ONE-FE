import type { SupabaseResponse } from "../types/admissions.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApplicationStatus {
  id: string;
  reference_number: string;
  applicant_number: string | null;
  full_name: string;
  email: string;
  school_level: string;
  applicant_type: string;
  status: "Under Review" | "Passed" | "Not Accepted";
  application_submitted_at: string;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface ApplicationDocument {
  id: string;
  document_name: string;
  file_name: string;
  file_url: string;
  status: string;
  submitted_at: string;
}

export interface ApplicationProgress {
  step: number;
  label: string;
  status: "completed" | "current" | "pending";
  date?: string;
}

export interface FullApplicationStatus {
  application: ApplicationStatus;
  documents: ApplicationDocument[];
  progress: ApplicationProgress[];
  remarks: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const APPLICATION_API = `${API_BASE_URL}/api/application`;

// ─── Fetch Application Status ─────────────────────────────────────────────────

export async function fetchApplicationStatus(
  email: string,
  referenceNumber: string
): Promise<SupabaseResponse<FullApplicationStatus>> {
  try {
    const params = new URLSearchParams({ email, referenceNumber });
    const response = await fetch(`${APPLICATION_API}/status?${params}`);
    const payload = await response.json();
    if (!response.ok) return { data: null, error: { message: payload?.message || "Request failed" } };
    const fullStatus = (payload.data ?? payload) as FullApplicationStatus;
    return { data: fullStatus, error: null };
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ─── Validate Access ──────────────────────────────────────────────────────────

export async function validateApplicationAccess(
  email: string,
  referenceNumber: string
): Promise<{ valid: boolean; applicantId: string; error?: string }> {
  try {
    const params = new URLSearchParams({ email, referenceNumber });
    const response = await fetch(`${APPLICATION_API}/validate-access?${params}`);
    const payload = await response.json();
    if (!response.ok) {
      return { valid: false, applicantId: "", error: payload?.message || "Invalid credentials" };
    }
    return payload as { valid: boolean; applicantId: string; error?: string };
  } catch (error: any) {
    return {
      valid: false,
      applicantId: "",
      error: error.message,
    };
  }
}
