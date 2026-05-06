"use client";

import { useState } from "react";
import Link from "next/link";

// 1. Generate 50 mock students dynamically to test pagination
const ITEMS_PER_PAGE = 10;
const generateMockStudents = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    initials: `${i + 1}`,
    name: `Student Name ${i + 1}`,
    status: null as string | null, // Unselected by default
    avatarColor: [
      "bg-secondary-container text-on-secondary-container",
      "bg-tertiary-container text-on-tertiary-container",
      "bg-surface-variant text-on-surface-variant",
    ][i % 3], // Cycle through colors
  }));
};

const initialStudents = generateMockStudents();

export default function TakeAttendancePage() {
  const [students, setStudents] = useState(initialStudents);
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination Logic
  const totalPages = Math.ceil(students.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = students.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Function to handle clicking attendance buttons
  const updateStatus = (id: number, newStatus: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
  };



  // Calculate overall progress bar width
  const markedCount = students.filter((s) => s.status !== null).length;
  const progressPercent = (markedCount / students.length) * 100;

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
        <h1 className="font-h2 text-h2 text-primary">Qaida (50 Students)</h1>
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
              <h2 className="font-h1 text-h1 text-on-surface">Take Attendance</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                Record attendance for today's session.
              </p>
            </div>
            <div className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full flex items-center gap-xs">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                group
              </span>
              <span className="font-label-caps text-label-caps">
                {markedCount}/{students.length} Done
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
                defaultValue="2024-05-15"
              />
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
          {paginatedStudents.map((student) => (
            <div
              key={student.id}
              className="bg-surface-container-lowest rounded-xl ambient-shadow p-md flex flex-col gap-sm"
            >
              <div className="flex items-center gap-sm mb-xs">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-button text-button shrink-0 ${student.avatarColor}`}
                >
                  {student.initials}
                </div>
                <div className="flex-grow">
                  <h3 className="font-button text-button text-on-surface">
                    {student.name}
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
                  <span className="font-label-caps text-label-caps">Present</span>
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
                  <span className="font-label-caps text-label-caps">Late</span>
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
                  <span className="font-label-caps text-label-caps">Absent</span>
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
          <Link href="/success" className="block w-full">
            <button className="w-full h-[48px] bg-primary text-on-primary font-button text-button rounded-lg flex items-center justify-center gap-sm transition-transform active:scale-95">
              <span className="material-symbols-outlined">save</span>
              Save Attendance ({markedCount}/{students.length})
            </button>
          </Link>
        </div>
      </div>

    </div>
  );
}