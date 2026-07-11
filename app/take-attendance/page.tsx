"use client";

import { useState, useEffect, Suspense } from "react";

// Disable static generation for this page since it uses client-side hooks
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useData } from "@/context/dataContext";
import { studentService } from "@/lib/servies/studentService";
import { attendanceService } from "@/lib/servies/attendanceService";
import { classService } from "@/lib/servies/classService";
import { StudentModel } from "@/models/Student";
import { AttendanceStatus } from "@/models/Attendance";
import { ClassModel } from "@/models/Class";
import { toEthiopian } from "ethiopian-calendar-new";

const ITEMS_PER_PAGE = 10;

interface StudentWithAttendance extends StudentModel {
  status: AttendanceStatus | null;
  initials: string;
  avatarColor: string;
}

function TakeAttendancePageContent() {
  const { user } = useAuth();
  const { refreshData } = useData();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');

  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState<ClassModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ethiopianDate, setEthiopianDate] = useState<{day: number, month: string, year: number, weekday: string} | null>(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Filter students based on search query
  const filteredStudents = students.filter(student =>
    student.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Function to handle clicking attendance buttons
  const updateStatus = (id: string, newStatus: AttendanceStatus) => {
    setStudents((prev: StudentWithAttendance[]) =>
      prev.map((student: StudentWithAttendance) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  };

  // Load class and students from URL classId
  useEffect(() => {
    const loadData = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setCurrentPage(1);

        // Get class info
        const classData = await classService.getById(classId);
        setSelectedClass(classData);

        // Get students for this class
        const studentsData = await studentService.getByClass(classId);

        // Get today's attendance for these students
        const todayAttendance = await attendanceService.getByDate(selectedDate, classId);

        // Check if we have existing attendance (update mode)
        const hasExistingAttendance = todayAttendance.length > 0;
        setIsUpdateMode(hasExistingAttendance);

        // Transform students with attendance data
        const studentsWithAttendance: StudentWithAttendance[] = studentsData.map((student, index) => {
          const attendance = todayAttendance.find(a => a.student_id === student.id);
          const avatarColors = [
            "bg-secondary-container text-on-secondary-container",
            "bg-tertiary-container text-on-tertiary-container",
            "bg-surface-variant text-on-surface-variant",
          ];

          return {
            ...student,
            initials: student.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
            status: attendance?.status || null,
            avatarColor: avatarColors[index % 3]
          };
        });

        setStudents(studentsWithAttendance);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId, selectedDate]);

  // Update Ethiopian date when selected date changes
  useEffect(() => {
    const date = new Date(selectedDate);
    const ethDate = toEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate());
    
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
    ];
    
    const ethiopianWeekdays = [
      'እኑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'
    ];
    
    const weekdayIndex = date.getDay();
    const ethiopianWeekday = ethiopianWeekdays[weekdayIndex];
    
    setEthiopianDate({
      day: ethDate.day,
      month: ethiopianMonths[ethDate.month - 1],
      year: ethDate.year,
      weekday: ethiopianWeekday
    });
  }, [selectedDate]);

  // Prevent accidental page refresh/exit when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const markedCount = students.filter((s) => s.status !== null).length;
      if (markedCount > 0) {
        e.preventDefault();
        e.returnValue = ''; // Chrome requires returnValue to be set
        return ''; // For other browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [students]);

  // Save attendance
  const saveAttendance = async (): Promise<boolean> => {
    if (!selectedClass || !user?.id) {
      alert('እባክዎ መጀመሪያ ክፍል ይምረጡ');
      return false;
    }
    
    try {
      setSaving(true);
      
      const attendanceRecords = students
        .filter(student => student.status !== null)
        .map(student => ({
          student_id: student.id,
          class_id: selectedClass.id,
          date: selectedDate,
          status: student.status as AttendanceStatus,
          recorded_by: user.id
        }));
      
      if (attendanceRecords.length === 0) {
        alert('እባክዎ ቢያንድ ተማማሪ አቴንዳስ ይምልክቱ');
        return false;
      }
      
      console.log('Saving attendance records:', attendanceRecords);
      await attendanceService.upsertBulk(attendanceRecords);
      await refreshData();
      console.log('Attendance saved successfully!');
      return true;
      
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert(`አቴንዳሱን ማስቀመጥ አልተቻለም: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setSaving(false);
    }
  };



  // Calculate overall progress bar width
  const markedCount = students.filter((s) => s.status !== null).length;
  const progressPercent = (markedCount / students.length) * 100;

  if (!classId) {
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased items-center justify-center px-container-padding">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="material-symbols-outlined text-6xl text-error">
            error
          </span>
          <p className="font-h2 text-h2 text-on-surface">ክፍል አልተመረጠም</p>
          <p className="font-body-md text-body-md text-on-surface-variant">
            እባክዎ ከዳሽቦርድ ክፍል ይምረጡ
          </p>
          <Link
            href="/"
            className="mt-4 px-6 py-3 bg-primary text-on-primary font-button text-button rounded-lg hover:bg-surface-tint transition-colors"
          >
            ወደ ዳሽቦርድ ተመለስ
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-primary animate-spin">
            hourglass_empty
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Loading attendance data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
      
      {/* TopAppBar */}
      <header className="bg-surface text-primary flat flex justify-between items-center w-full px-container-padding py-sm sticky top-0 z-40">
        <Link 
          href="/" 
          className="flex items-center justify-center p-sm rounded-full hover:bg-surface-container-low text-on-surface transition-opacity duration-150"
        >
          <span aria-hidden="true" className="material-symbols-outlined">
            arrow_back
          </span>
        </Link>
        <h1 className="font-h2 text-h2 text-primary">
          {selectedClass?.name || 'Loading...'} ({students.length} ተማሪዎች)
        </h1>
        <button className="flex items-center justify-center p-sm rounded-full hover:bg-surface-container-low text-on-surface-variant transition-opacity duration-150">
          <span aria-hidden="true" className="material-symbols-outlined">
            more_vert
          </span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow px-container-padding py-md flex flex-col gap-md pb-32 max-w-3xl mx-auto w-full">
        
        {/* Header & Date Picker Card */}
        <div className="bg-surface-container-lowest rounded-xl ambient-shadow p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface">
                {isUpdateMode ? 'አቴንዳሱን ያሻሽሉ' : 'አቴንዳስ ይመዝግቡ'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                {isUpdateMode ? 'የተመዘገበ አቴንዳስ አለ። እንደገና መዝግብ ይችላሉ።' : 'አዲስ አቴንዳስ ይመዝግቡ'} • {ethiopianDate ? `ለ ቀን ${ethiopianDate.weekday}, ${ethiopianDate.month} ${ethiopianDate.day}, ${ethiopianDate.year}` : 'Loading...'}
              </p>
            </div>
            <div className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                group
              </span>
              <span className="font-label-caps text-label-caps">
                {markedCount}/{students.length} ተጠናቋል
              </span>
            </div>
          </div>
          
          <div className="mt-sm relative flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-surface-container-low rounded-lg p-sm border border-surface-variant focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm">
                calendar_today
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 w-full font-button text-button text-on-surface p-0 outline-none"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              {ethiopianDate && (
                <span className="ml-auto font-label-caps text-label-caps text-primary bg-primary-container/20 px-2 py-1 rounded text-xs">
                  {ethiopianDate.month} {ethiopianDate.day}, {ethiopianDate.year}
                </span>
              )}
            </div>
            
            <div className="flex-1 flex items-center bg-surface-container-low rounded-lg p-sm border border-surface-variant focus-within:border-primary transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant mr-sm">
                search
              </span>
              <input
                className="bg-transparent border-none focus:ring-0 w-full font-button text-button text-on-surface p-0 outline-none"
                type="text"
                placeholder="ተማሪ ፈልግ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-auto text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Overall Progress Indicator */}
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Student Roster (Paginated) */}
        <div className="flex flex-col gap-md mt-sm">
          {paginatedStudents.map((student, index) => (
            <div
              key={student.id}
              className="bg-surface-container-lowest rounded-xl ambient-shadow p-md flex flex-col gap-sm"
            >
              <div className="flex items-center gap-sm mb-xs">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-button text-on-primary text-sm shrink-0">
                  {startIndex + index + 1}
                </div>
               
                <div className="flex-grow">
                  <h3 className="font-button text-button text-on-surface">
                    {student.full_name}
                  </h3>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-sm">
                {/* Present Button */}
                <button
                  onClick={() => updateStatus(student.id, "present")}
                  className={`h-12 rounded-lg flex flex-col items-center justify-center transition-transform active:scale-95 ${
                    student.status === "present"
                      ? "bg-primary text-on-primary border-none"
                      : "bg-surface-container-high text-on-surface-variant border border-surface-variant"
                  }`}
                >
                  <span
                    className="material-symbols-outlined mb-xs text-sm"
                    style={student.status === "present" ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    check_circle
                  </span>
                  <span className="font-label-caps text-label-caps">አለ</span>
                </button>

                {/* Late Button */}
                <button
                  onClick={() => updateStatus(student.id, "late")}
                  className={`h-12 rounded-lg flex flex-col items-center justify-center transition-transform active:scale-95 ${
                    student.status === "late"
                      ? "bg-tertiary-container text-on-tertiary-container border-none"
                      : "bg-surface-container-high text-on-surface-variant border border-surface-variant"
                  }`}
                >
                  <span
                    className="material-symbols-outlined mb-xs text-sm"
                    style={student.status === "late" ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    schedule
                  </span>
                  <span className="font-label-caps text-label-caps">አርፍዷል</span>
                </button>

                {/* Absent Button */}
                <button
                  onClick={() => updateStatus(student.id, "absent")}
                  className={`h-12 rounded-lg flex flex-col items-center justify-center transition-transform active:scale-95 ${
                    student.status === "absent"
                      ? "bg-error text-on-error border-none"
                      : "bg-surface-container-high text-on-surface-variant border border-surface-variant"
                  }`}
                >
                  <span
                    className="material-symbols-outlined mb-xs text-sm"
                    style={student.status === "absent" ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    cancel
                  </span>
                  <span className="font-label-caps text-label-caps">አልመጣም</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4 bg-surface-container-lowest p-4 rounded-xl ambient-shadow">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-outline-variant text-secondary font-button text-button rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span> 
            <span className="hidden sm:inline">Prev</span>
          </button>
          
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-outline-variant text-secondary font-button text-button rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-surface-container-low transition-colors"
          >
            <span className="hidden sm:inline">Next</span>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

      </main>

      {/* Sticky Save Button Container */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest shadow-[0_-4px_15px_rgba(0,0,0,0.04)] px-container-padding py-md z-50 rounded-t-xl flex justify-center">
        <div className="w-full max-w-3xl">
          <button 
            onClick={async () => {
              const success = await saveAttendance();
              if (success) {
                setShowSuccessModal(true);
              }
            }}
            disabled={saving || loading || markedCount === 0}
            className="w-full h-[48px] bg-primary text-on-primary font-button text-button rounded-lg flex items-center justify-center gap-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">
              {saving ? 'hourglass_empty' : 'save'}
            </span>
            {saving ? 'እያስቀመጠ ነው...' : `${isUpdateMode ? 'አቴንዳሱን ያሻሽሉ' : 'አቴንዳሱን ያስቀምጡ'} (${markedCount}/${students.length})`}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-container-padding">
          <div className="bg-surface-container-lowest rounded-xl p-md max-w-[400px] w-full text-center">
            {/* Success Icon */}
            <div className="mb-lg flex justify-center">
              <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center ambient-shadow">
                <span 
                  className="material-symbols-outlined text-[48px] text-on-primary-container" 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              </div>
            </div>

            {/* Headline & Message */}
            <h1 className="font-h1 text-h1 text-on-surface mb-sm">
               የ ዛሬ አቴዳንስ በተሳካ ሁኔታ ተቀምጧል።
            </h1>
            {/* Actions */}
            <div className="flex flex-col gap-sm">
              <Link
                href="/"
                onClick={() => setShowSuccessModal(false)}
              >
                <button className="w-full h-12 bg-primary text-on-primary font-button text-button rounded-full flex items-center justify-center transition-colors">
                  ወደ ዋና ገጽ ተመለስ
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Default export with Suspense boundary
export default function TakeAttendancePage() {
  return (
    <Suspense fallback={
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-6xl text-primary animate-spin">
            hourglass_empty
          </span>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Loading...
          </p>
        </div>
      </div>
    }>
      <TakeAttendancePageContent />
    </Suspense>
  );
}