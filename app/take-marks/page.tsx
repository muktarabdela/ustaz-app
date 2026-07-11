"use client";

import { Suspense } from "react";

// Disable static generation for this page since it uses client-side hooks
export const dynamic = 'force-dynamic';
import Link from "next/link";
import { useData } from "@/context/dataContext";
import { useMarksData } from "@/hooks/useMarksData";
import { StudentMarkCard } from "@/components/StudentMarkCard";
import { AssessmentListCard } from "@/components/AssessmentListCard";
import { Pagination } from "@/components/Pagination";
import { SuccessModal } from "@/components/SuccessModal";
import { countMarkedStudents, calculateProgress } from "@/lib/utils/studentHelpers";

function TakeMarksPageContent() {
  const { assessments } = useData();
  const {
    students,
    paginatedStudents,
    currentPage,
    selectedClass,
    selectedAssessment,
    loading,
    saving,
    isUpdateMode,
    searchQuery,
    showSuccessModal,
    showAssessmentList,
    totalPages,
    startIndex,
    setCurrentPage,
    setSearchQuery,
    setShowSuccessModal,
    setShowAssessmentList,
    updateScore,
    toggleExcused,
    updateRemarks,
    saveMarks,
    classId,
  } = useMarksData();

  // Calculate overall progress
  const markedCount = countMarkedStudents(students);
  const progressPercent = calculateProgress(markedCount, students.length);

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

  if (showAssessmentList) {
    const classAssessments = assessments.filter(a => a.class_id === classId);
    
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col antialiased">
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
            {selectedClass?.name || 'Loading...'} - ፈተናዎች
          </h1>
          <div className="w-10"></div>
        </header>

        <main className="flex-grow px-container-padding py-md flex flex-col gap-md pb-32 max-w-3xl mx-auto w-full">
          {classAssessments.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl ambient-shadow p-md text-center">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-sm">
                assignment
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant">
                ለዚህ ክፍል ምንም ፈተና የለም
              </p>
            </div>
          ) : (
            classAssessments.map((assessment) => (
              <AssessmentListCard
                key={assessment.id}
                assessment={assessment}
                classId={classId}
              />
            ))
          )}
        </main>
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
            Loading marks data...
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
          href={`/`}
          className="flex items-center justify-center p-sm rounded-full hover:bg-surface-container-low text-on-surface transition-opacity duration-150"
        >
          <span aria-hidden="true" className="material-symbols-outlined">
            arrow_back
          </span>
        </Link>
        <h1 className="font-h2 text-h2 text-primary">
          {selectedAssessment?.title || 'Loading...'}
        </h1>
        <button className="flex items-center justify-center p-sm rounded-full hover:bg-surface-container-low text-on-surface-variant transition-opacity duration-150">
          <span aria-hidden="true" className="material-symbols-outlined">
            more_vert
          </span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow px-container-padding py-md flex flex-col gap-md pb-32 max-w-3xl mx-auto w-full">
        
        {/* Header Card */}
        <div className="bg-surface-container-lowest rounded-xl ambient-shadow p-md flex flex-col gap-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-h1 text-h1 text-on-surface">
                {isUpdateMode ? 'ነጥቦችን ያሻሽሉ' : 'ነጥቦች ይምልክቱ'}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                {selectedClass?.name} • {selectedAssessment?.type} • ከ {selectedAssessment?.total_marks} ነጥብ
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
          
          <div className="mt-sm flex items-center bg-surface-container-low rounded-lg p-sm border border-surface-variant focus-within:border-primary transition-colors">
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
            <StudentMarkCard
              key={student.id}
              student={student}
              index={startIndex + index}
              totalMarks={selectedAssessment?.total_marks}
              onUpdateScore={updateScore}
              onToggleExcused={toggleExcused}
              onUpdateRemarks={updateRemarks}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </main>

      {/* Sticky Save Button Container */}
      <div className="fixed bottom-0 left-0 w-full bg-surface-container-lowest shadow-[0_-4px_15px_rgba(0,0,0,0.04)] px-container-padding py-md z-50 rounded-t-xl flex justify-center">
        <div className="w-full max-w-3xl">
          <button 
            onClick={async () => {
              const success = await saveMarks();
              if (success) {
                setShowSuccessModal(true);
              }
            }}
            disabled={saving || loading}
            className="w-full h-[48px] bg-primary text-on-primary font-button text-button rounded-lg flex items-center justify-center gap-sm transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined">
              {saving ? 'hourglass_empty' : 'save'}
            </span>
            {saving ? 'እያስቀመጠ ነው...' : `${isUpdateMode ? 'ነጥቦችን ያሻሽሉ' : 'ነጥቦችን ያስቀምጡ'} (${markedCount}/${students.length})`}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        classId={classId}
      />

    </div>
  );
}

// Default export with Suspense boundary
export default function TakeMarksPage() {
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
      <TakeMarksPageContent />
    </Suspense>
  );
}
