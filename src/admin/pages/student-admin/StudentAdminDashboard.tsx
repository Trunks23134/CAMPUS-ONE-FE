'use client'
import { useState, useEffect } from "react";
import { UnifiedAdminLayout } from "../../components/UnifiedAdminLayout";
import { StudentList } from "../../components/StudentList";
import { StudentDetail } from "../../components/StudentDetail";
import {
  Users, CheckCircle, XCircle, Clock, GraduationCap,
  BookOpen, ClipboardList, Award, AlertTriangle, BarChart2,
  Library, HeadphonesIcon, BellRing,
} from "lucide-react";
import { fetchStudentStats, type StudentStats } from "@/admin/services/student-admin.service";

type StudentView =
  | "dashboard" | "directory" | "enrollment" | "academics"
  | "honors" | "clearance" | "reports" | "catalog" | "requests"
  | "notifications" | "detail";

interface StudentAdminDashboardProps {
  onSwitchPortal: (portal: "applicant" | "student") => void;
}

function ComingSoonPanel({ icon: Icon, title, description }: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="p-10">
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="p-6 bg-amber-50 rounded-2xl mb-6">
          <Icon className="w-12 h-12 text-[#F59E0B]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 max-w-md">{description}</p>
        <span className="mt-6 inline-block px-4 py-2 bg-amber-50 text-amber-600 text-xs font-semibold rounded-full border border-amber-200">
          Coming Soon
        </span>
      </div>
    </div>
  );
}

export function StudentAdminDashboard({ onSwitchPortal }: StudentAdminDashboardProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [view, setView] = useState<StudentView>("dashboard");
  const [stats, setStats] = useState<StudentStats>({ total: 0, active: 0, inactive: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    setLoading(true);
    const result = await fetchStudentStats();
    if (result.data) setStats(result.data);
    setLoading(false);
  };

  const handleSelectStudent = (id: string) => setSelectedStudentId(id);

  const handleBackFromDetail = () => {
    setSelectedStudentId(null);
    loadStats();
  };

  const currentView = selectedStudentId ? "detail" : view;

  const handleNavigate = (newView: string) => {
    setView(newView as StudentView);
    setSelectedStudentId(null);
  };

  const quickActions = [
    { id: "directory",  label: "Student Directory",       desc: "Search and manage student profiles",       icon: GraduationCap,   color: "amber"  },
    { id: "enrollment", label: "Enrollment Center",        desc: "Manage subject loading and schedules",     icon: ClipboardList,   color: "blue"   },
    { id: "academics",  label: "Academic Hub",             desc: "View rosters and grade progress",          icon: BookOpen,        color: "purple" },
    { id: "honors",     label: "Honors Tracker",           desc: "Monitor Latin Honors eligibility",         icon: Award,           color: "yellow" },
    { id: "clearance",  label: "Clearance & Deficiencies", desc: "Check missing grades or failed subjects",  icon: AlertTriangle,   color: "red"    },
    { id: "reports",    label: "Reports",                  desc: "Generate enrollment statistics",           icon: BarChart2,       color: "green"  },
  ];

  const renderContent = () => {
    if (selectedStudentId) {
      return (
        <div className="p-8">
          <StudentDetail studentId={selectedStudentId} onBack={handleBackFromDetail} />
        </div>
      );
    }

    switch (view) {
      case "directory":
        return (
          <div className="p-8">
            <StudentList onSelectStudent={handleSelectStudent} onRefresh={loadStats} onBack={() => setView("dashboard")} />
          </div>
        );
      case "enrollment":
        return <ComingSoonPanel icon={ClipboardList} title="Enrollment Center" description="Manage subject loading, class schedules, and verify student registration status." />;
      case "academics":
        return <ComingSoonPanel icon={BookOpen} title="Academic Hub" description="View class rosters, monitor grade encoding progress by professors, and review semestral results." />;
      case "honors":
        return <ComingSoonPanel icon={Award} title="Honors Tracker" description="Monitor students eligible for Latin Honors and track their GWA in real-time." />;
      case "clearance":
        return <ComingSoonPanel icon={AlertTriangle} title="Clearance & Deficiencies" description="Identify students with missing grades or failed subjects before they move toward the graduation phase." />;
      case "reports":
        return <ComingSoonPanel icon={BarChart2} title="Reports" description="Generate data summaries such as total irregular students or enrollment statistics for the semester." />;
      case "catalog":
        return <ComingSoonPanel icon={Library} title="Subject Catalog" description="Manage the master list of all subjects including their descriptions, units, and pre-requisites." />;
      case "requests":
        return <ComingSoonPanel icon={HeadphonesIcon} title="Service Requests" description="Manage requests like grade corrections, shift-of-course applications, or document requests." />;
      case "notifications":
        return <ComingSoonPanel icon={BellRing} title="Notification Center" description="Send manual announcements or view the history of automatic alerts sent to student phones." />;

      default: // dashboard
        return (
          <div className="p-10">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#F59E0B] mx-auto"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
                    </div>
                  </div>
                  <p className="mt-6 text-sm font-medium text-gray-600">Loading dashboard...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">All</span>
                      </div>
                      <p className="text-4xl font-bold text-gray-900 mb-1">{stats.total}</p>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg shadow-green-500/30">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Active</span>
                      </div>
                      <p className="text-4xl font-bold text-green-600 mb-1">{stats.active}</p>
                      <p className="text-sm font-medium text-gray-600">Active</p>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl shadow-lg shadow-gray-500/30">
                          <XCircle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1 rounded-full">Inactive</span>
                      </div>
                      <p className="text-4xl font-bold text-gray-600 mb-1">{stats.inactive}</p>
                      <p className="text-sm font-medium text-gray-600">Inactive</p>
                    </div>
                  </div>

                  <div className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-full -mr-16 -mt-16 opacity-50"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg shadow-amber-500/30">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">Pending</span>
                      </div>
                      <p className="text-4xl font-bold text-amber-600 mb-1">{stats.pending}</p>
                      <p className="text-sm font-medium text-gray-600">Pending Activation</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                    <p className="text-sm text-gray-500 mt-1">Common tasks and shortcuts</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map(({ id, label, desc, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setView(id as StudentView)}
                        className="group flex items-center justify-between p-5 border-2 border-gray-200 rounded-2xl hover:border-[#F59E0B] hover:shadow-lg transition-all duration-300 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-[#F59E0B] transition-all duration-300">
                            <Icon className="w-5 h-5 text-[#F59E0B] group-hover:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{label}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                          </div>
                        </div>
                        <span className="text-gray-300 group-hover:text-[#F59E0B] group-hover:translate-x-1 transition-all duration-300">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Switch Portal */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Applicant Portal</h3>
                      <p className="text-sm text-gray-500 mt-1">Switch to manage admission applications</p>
                    </div>
                    <button
                      onClick={() => onSwitchPortal("applicant")}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
                    >
                      <Users className="w-4 h-4" />
                      Switch Portal →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <UnifiedAdminLayout
      currentPortal="student"
      currentView={currentView}
      onNavigate={handleNavigate}
      onSwitchPortal={onSwitchPortal}
    >
      {renderContent()}
    </UnifiedAdminLayout>
  );
}
