import { supabase } from '@/shared/lib/supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StudentRecord {
  id: string;
  email: string;
  student_number: string;
  applicant_id: string;
  enrollment_status: string;
  enrolled_at: string;
  password_hash?: string | null;
  full_name: string;
  school_level: string;
  applicant_type: string;
  mobile_number?: string;
  address?: string;
  birthdate?: string;
  program?: string;
}

export interface StudentStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
}

// ─── Fetch Student Stats ──────────────────────────────────────────────────────

export async function fetchStudentStats() {
  try {
    const [total, active, inactive, pending] = await Promise.all([
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }),
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'active'),
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }).eq('enrollment_status', 'inactive'),
      supabase.from('student_accounts').select('*', { count: 'exact', head: true }).is('password_hash', null),
    ]);

    return {
      data: {
        total: total.count ?? 0,
        active: active.count ?? 0,
        inactive: inactive.count ?? 0,
        pending: pending.count ?? 0,
      },
      error: null,
    };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Fetch All Students ───────────────────────────────────────────────────────

export async function fetchAllStudents() {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .select(`
        id,
        email,
        student_number,
        applicant_id,
        enrollment_status,
        enrolled_at,
        password_hash,
        applicant_profiles (
          full_name,
          school_level,
          applicant_type,
          mobile_number,
          address,
          birthdate,
          program
        )
      `)
      .order('enrolled_at', { ascending: false });

    if (error) throw error;

    const students: StudentRecord[] = (data ?? []).map((s: any) => ({
      id: s.id,
      email: s.email,
      student_number: s.student_number,
      applicant_id: s.applicant_id,
      enrollment_status: s.enrollment_status,
      enrolled_at: s.enrolled_at,
      password_hash: s.password_hash,
      full_name: s.applicant_profiles?.full_name ?? 'N/A',
      school_level: s.applicant_profiles?.school_level ?? 'N/A',
      applicant_type: s.applicant_profiles?.applicant_type ?? 'N/A',
      mobile_number: s.applicant_profiles?.mobile_number,
      address: s.applicant_profiles?.address,
      birthdate: s.applicant_profiles?.birthdate,
      program: s.applicant_profiles?.program,
    }));

    return { data: students, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Fetch Student Details ────────────────────────────────────────────────────

export async function fetchStudentDetails(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .select(`*, applicant_profiles (*)`)
      .eq('id', studentId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Activate Student Account ─────────────────────────────────────────────────

export async function activateStudentAccount(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .update({ enrollment_status: 'active' })
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Deactivate Student Account ───────────────────────────────────────────────

export async function deactivateStudentAccount(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .update({ enrollment_status: 'inactive' })
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}

// ─── Update Student Info ──────────────────────────────────────────────────────

export async function updateStudentInfo(studentId: string, updates: { email?: string; student_number?: string }) {
  try {
    const { data, error } = await supabase
      .from('student_accounts')
      .update(updates)
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
}
