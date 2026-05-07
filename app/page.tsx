"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/authContext";
import { useData } from "@/context/dataContext";
import { useEffect, useState } from "react";
import { studentService } from "@/lib/servies/studentService";
import { attendanceService } from "@/lib/servies/attendanceService";
import { toEthiopian } from "ethiopian-calendar-new";

export default function UstazDashboard() {
  const { user } = useAuth();
  const { ustazClasses, loading, getUstazClasses } = useData();
  const [studentCounts, setStudentCounts] = useState<{ [key: string]: number }>({});
  const [ethiopianDate, setEthiopianDate] = useState<{day: number, month: string, year: number, weekday: string} | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user?.id) {
      getUstazClasses(user.id);
    }
  }, [user?.id, getUstazClasses]);

  useEffect(() => {
    // Convert current Gregorian date to Ethiopian
    const now = new Date();
    const ethDate = toEthiopian(now.getFullYear(), now.getMonth() + 1, now.getDate());
    
    const ethiopianMonths = [
      'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት',
      'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜን'
    ];
    
    const ethiopianWeekdays = [
      'እኑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'
    ];
    
    const weekdayIndex = now.getDay(); // 0 = Sunday, 6 = Saturday
    const ethiopianWeekday = ethiopianWeekdays[weekdayIndex];
    
    setEthiopianDate({
      day: ethDate.day,
      month: ethiopianMonths[ethDate.month - 1],
      year: ethDate.year,
      weekday: ethiopianWeekday
    });
  }, []);

  useEffect(() => {
    const fetchStudentCounts = async () => {
      const counts: { [key: string]: number } = {};
      
      for (const classUstaz of ustazClasses) {
        try {
          const count = await studentService.getStudentCountByClass(classUstaz.class_id);
          counts[classUstaz.class_id] = count;
        } catch (error) {
          console.error('Error fetching student count:', error);
          counts[classUstaz.class_id] = 0;
        }
      }
      
      setStudentCounts(counts);
    };

    if (ustazClasses.length > 0) {
      fetchStudentCounts();
    }
  }, [ustazClasses]);

  useEffect(() => {
    const checkAttendanceStatus = async () => {
      const today = new Date().toISOString().split('T')[0];
      const status: { [key: string]: boolean } = {};
      
      for (const classUstaz of ustazClasses) {
        try {
          const exists = await attendanceService.checkAttendanceExists(today, classUstaz.class_id);
          status[classUstaz.class_id] = exists;
        } catch (error) {
          console.error('Error checking attendance status:', error);
          status[classUstaz.class_id] = false;
        }
      }
      
      setAttendanceStatus(status);
    };

    if (ustazClasses.length > 0) {
      checkAttendanceStatus();
    }
  }, [ustazClasses]);

  const getClassIcon = (index: number) => {
    const icons = ["menu_book", "record_voice_over", "balance"];
    return icons[index % icons.length];
  };

  const getIconColor = (index: number) => {
    const colors = [
      "bg-primary-container/20 text-primary",
      "bg-tertiary-container/20 text-tertiary", 
      "bg-secondary-container/30 text-on-secondary-container"
    ];
    return colors[index % colors.length];
  };

  const getCardGradient = (index: number) => {
    const gradients = [
      "from-primary/5 to-transparent",
      "from-tertiary/5 to-transparent", 
      "from-secondary/5 to-transparent"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
      {/* Dashboard Header */}
      <section className="mb-xl" aria-label="Welcome Section">
        <div className="bg-gradient-to-r from-primary/8 to-tertiary/8 rounded-2xl p-6 mb-6 border border-surface-container-low">
          <h1 className="font-h1 text-h1 text-on-surface mb-2">
            አሰላሙ አለይኩም, {user?.full_name || 'Ustaz'}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {ethiopianDate ? `${ethiopianDate.weekday}, ${ethiopianDate.month} ${ethiopianDate.day}, ${ethiopianDate.year}` : 'Loading...'}
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface-container-low rounded-xl p-4 text-center border border-surface-container">
            <span className="material-symbols-outlined text-2xl text-tertiary mb-2">groups</span>
            <p className="font-label-caps text-label-caps text-on-surface-variant">አጠቃላይ ተማሪ ብዛት</p>
            <p className="font-h2 text-h2 text-on-surface">{Object.values(studentCounts).reduce((a, b) => a + b, 0)}</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4 text-center border border-surface-container">
            <span className="material-symbols-outlined text-2xl text-secondary mb-2">schedule</span>
          <p className="font-label-caps text-label-caps text-on-surface-variant">ዛሬ ቀን</p>
            <p className="font-h2 text-h2 text-on-surface">{ethiopianDate?.weekday || '...'}</p>
          </div>

        </div>
      </section>

      {/* Classes Grid */}
      <section aria-label="Your Classes">
        <h2 className="font-h2 text-h2 text-on-surface mb-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">menu_book</span>
          የዕርሶ ክፍሎች
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
              <p className="font-body-md text-body-md text-on-surface-variant">Loading your classes...</p>
            </div>
          ) : ustazClasses.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-surface-container-low rounded-xl border border-surface-container">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">menu_book</span>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-2">No classes assigned yet</p>
              <p className="font-body-md text-body-md text-on-surface-variant">Classes will appear here once assigned to you.</p>
            </div>
          ) : (
            ustazClasses.map((classUstaz, index) => (
              <article 
                key={classUstaz.id} 
                className="group bg-surface-container-lowest rounded-xl overflow-hidden border border-surface-container-low hover:border-primary/30 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`h-2 bg-gradient-to-r ${getCardGradient(index)}`}></div>
                <div className="p-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`w-14 h-14 rounded-xl ${getIconColor(index)} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                      <span className="material-symbols-outlined text-xl">{getClassIcon(index)}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-3 py-1 rounded-full shadow-sm">
                        {studentCounts[classUstaz.class_id] || 0} ተማሪዎች
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-h2 text-h2 text-on-surface mb-1 group-hover:text-primary transition-colors duration-200">
                        {classUstaz.classes?.name || 'Class'}
                      </h3>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        <p className="font-body-md text-body-md">
                          {classUstaz.classes?.schedule || 'Schedule TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="px-lg pb-lg">
                  {attendanceStatus[classUstaz.class_id] && (
                    <div className="mb-3 p-3 bg-tertiary-container/20 border border-tertiary/30 rounded-lg">
                      <div className="flex items-center gap-2 text-tertiary">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        <p className="font-body-sm text-body-sm">የዛሬ አቴንዳስ ተመዝግቧል</p>
                      </div>
                    </div>
                  )}
                  <Link 
                    href={`/take-attendance?classId=${classUstaz.class_id}`} 
                    className="w-full block"
                    aria-label={`${attendanceStatus[classUstaz.class_id] ? 'Update' : 'Take'} attendance for ${classUstaz.classes?.name || 'Class'}`}
                  >
                    <button className={`w-full ${attendanceStatus[classUstaz.class_id] ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'} font-button text-button h-12 rounded-lg hover:bg-surface-tint active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2 group-hover:shadow-md`}>
                      <span className="material-symbols-outlined text-sm">
                        {attendanceStatus[classUstaz.class_id] ? 'edit' : 'checklist'}
                      </span>
                      {attendanceStatus[classUstaz.class_id] ? 'አቴንዳሱን ያሻሽሉ' : 'አቴንዳስ ይመዝግቡ'}
                    </button>
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </DashboardLayout>
    </ProtectedRoute>
  );
}