import { getRequirements } from "./requirements.config";
import type {
  SchoolLevel, ApplicantType, AdmissionActivityLogDTO, AdmissionEventType,
  ApplicantDocument, DocumentUploadDTO, AdmissionResult, RequirementItem,
  SupabaseResponse, CreateAccountDTO, ApplicantProfileDTO, ExamLogDTO,
} from "../types/admissions.types";

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
    if (!response.ok) {
      return { data: null, error: { message: payload?.message || "Request failed" } };
    }
    return payload as SupabaseResponse<T>;
  } catch (error: any) {
    return { data: null, error: { message: error.message } };
  }
}

// ─── Activity Logging ─────────────────────────────────────────────────────────
export async function logAdmissionEvent(dto: AdmissionActivityLogDTO): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/log-event", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function logEvent(
  eventType: AdmissionEventType, schoolLevel: SchoolLevel, applicantType: ApplicantType,
  metadata: Record<string, unknown> = {}
): Promise<void> {
  try { await logAdmissionEvent({ event_type: eventType, school_level: schoolLevel, applicant_type: applicantType, metadata }); }
  catch (err) { console.error("[admissions] log failed:", err); }
}

// ─── Account Creation (No Password) ───────────────────────────────────────────
export async function createApplicantProfile(dto: { 
  email: string; 
  school_level: SchoolLevel; 
  applicant_type: ApplicantType;
}): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/create-profile", {
    method: "POST",
    body: JSON.stringify({
      email: dto.email,
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
    }),
  });
}

// ─── Submit Application (Generates Reference Number) ──────────────────────────
export async function submitApplication(applicantId: string): Promise<SupabaseResponse<{ reference_number: string }>> {
  return callApplicationApi<{ reference_number: string }>(`/submit/${applicantId}`, {
    method: "POST",
  });
}

// ─── Track Application (Email + Reference Number) ─────────────────────────────
export async function trackApplication(email: string, referenceNumber: string): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/track", {
    method: "POST",
    body: JSON.stringify({ email, referenceNumber }),
  });
}

// ─── Profile Save ─────────────────────────────────────────────────────────────
export async function saveApplicantProfile(dto: ApplicantProfileDTO): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/profile", {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

// ─── Requirements ─────────────────────────────────────────────────────────────
export function getRequirementsByLevelAndType(schoolLevel: SchoolLevel, applicantType: ApplicantType): RequirementItem[] {
  return getRequirements(schoolLevel, applicantType);
}

// ─── Document Upload ──────────────────────────────────────────────────────────
export async function uploadApplicantDocument(dto: DocumentUploadDTO): Promise<SupabaseResponse<ApplicantDocument>> {
  const bytes = new Uint8Array(await dto.file.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  const fileBase64 = btoa(binary);

  return callApplicationApi<ApplicantDocument>("/upload-document", {
    method: "POST",
    body: JSON.stringify({
      applicant_id: dto.applicant_id,
      document_name: dto.document_name,
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
      file_name: dto.file.name,
      file_type: dto.file.type,
      file_base64: fileBase64,
    }),
  });
}

// ─── Exam Logging ─────────────────────────────────────────────────────────────
export async function logExamResult(dto: ExamLogDTO): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/log-event", {
    method: "POST",
    body: JSON.stringify({
      event_type: "exam_result_submitted",
      school_level: dto.school_level,
      applicant_type: dto.applicant_type,
      metadata: {
        applicant_id: dto.applicant_id,
        result: dto.result,
        score: dto.score ?? null,
        metadata: dto.metadata ?? {},
      },
    }),
  });
}

// ─── Admission Result ─────────────────────────────────────────────────────────
export async function getApplicantAdmissionResult(applicantId: string): Promise<SupabaseResponse<AdmissionResult>> {
  const response = await callApplicationApi<Record<string, unknown>>(`/result/${applicantId}`);
  if (response.error || !response.data) return { data: null, error: response.error };
  const rawData = response.data as any;
  const data = (rawData.data ?? rawData) as Record<string, unknown>;
  const raw = data as Record<string, unknown>;
  const profile = raw["applicant_profiles"] as Record<string, unknown> | null;
  const result: AdmissionResult = {
    id: raw["id"] as string, applicant_id: raw["applicant_id"] as string,
    status: raw["status"] as AdmissionResult["status"],
    noa: profile ? { applicant_name: profile["full_name"] as string, program: profile["program"] as string,
      school_level: profile["school_level"] as SchoolLevel, applicant_type: profile["applicant_type"] as ApplicantType,
      date_issued: raw["date_issued"] as string, noa_url: raw["noa_url"] as string | null } : null,
    test_permit: raw["exam_date"] ? { exam_date: raw["exam_date"] as string, exam_time: raw["exam_time"] as string,
      exam_venue: raw["exam_venue"] as string, permit_number: raw["permit_number"] as string,
      permit_url: raw["exam_permit_url"] as string | null } : null,
  };
  return { data: result, error: null };
}

// ─── Parent Information ───────────────────────────────────────────────────────
export async function saveParentInformation(data: {
  applicant_id: string;
  father_name: string;
  father_address: string;
  father_contact: string;
  guardian_name: string;
  guardian_address: string;
  guardian_phone_home: string;
  guardian_phone_work: string;
  mother_name: string;
  mother_address: string;
  mother_contact: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/parent-information", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Academic Background ──────────────────────────────────────────────────────
export async function saveAcademicBackground(data: {
  applicant_id: string;
  entries: Array<{
    grade_level: string;
    school_name: string;
    completion_year: string;
  }>;
}): Promise<SupabaseResponse<{ count: number }>> {
  return callApplicationApi<{ count: number }>("/academic-background", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Alumni Relatives ─────────────────────────────────────────────────────────
export async function saveAlumniRelatives(data: {
  applicant_id: string;
  relatives: Array<{
    name: string;
    relationship: string;
    college: string;
    batch_year: string;
    contact_number: string;
  }>;
}): Promise<SupabaseResponse<{ count: number }>> {
  return callApplicationApi<{ count: number }>("/alumni-relatives", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Program Selection ────────────────────────────────────────────────────────
export async function saveProgramSelection(data: {
  applicant_id: string;
  school_level: SchoolLevel;
  applicant_type: ApplicantType;
  college_department?: string;
  college_program?: string;
  senior_high_track?: string;
  tvl_strand?: string;
}): Promise<SupabaseResponse<{ id: string }>> {
  return callApplicationApi<{ id: string }>("/program-selection", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
