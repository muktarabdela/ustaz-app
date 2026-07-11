import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/authContext';
import { useData } from '@/context/dataContext';
import { studentService } from '@/lib/servies/studentService';
import { assessmentService } from '@/lib/servies/assessmentService';
import { studentMarkService } from '@/lib/servies/studentMarkService';
import { classService } from '@/lib/servies/classService';
import { StudentModel } from '@/models/Student';
import { AssessmentModel } from '@/models/Assessment';
import { StudentMarkModel } from '@/models/StudentMark';
import { ClassModel } from '@/models/Class';
import { StudentWithMark, transformStudentsWithMarks } from '@/lib/utils/studentHelpers';

const ITEMS_PER_PAGE = 10;

export function useMarksData() {
  const { user } = useAuth();
  const { refreshData, assessments } = useData();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const assessmentId = searchParams.get('assessmentId');

  const [students, setStudents] = useState<StudentWithMark[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState<ClassModel | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAssessmentList, setShowAssessmentList] = useState(!assessmentId);

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

  // Function to handle updating student marks
  const updateScore = (id: string, score: number | null) => {
    setStudents((prev: StudentWithMark[]) =>
      prev.map((student: StudentWithMark) =>
        student.id === id ? { ...student, score } : student
      )
    );
  };

  const toggleExcused = (id: string) => {
    setStudents((prev: StudentWithMark[]) =>
      prev.map((student: StudentWithMark) =>
        student.id === id ? { ...student, is_excused: !student.is_excused, score: null } : student
      )
    );
  };

  const updateRemarks = (id: string, remarks: string) => {
    setStudents((prev: StudentWithMark[]) =>
      prev.map((student: StudentWithMark) =>
        student.id === id ? { ...student, remarks } : student
      )
    );
  };

  // Load class, assessment, and students from URL params
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

        // If assessmentId is provided, load that specific assessment
        if (assessmentId) {
          const assessmentData = assessments.find((a: AssessmentModel) => a.id === assessmentId);
          setSelectedAssessment(assessmentData || null);
          setShowAssessmentList(false);

          if (assessmentData) {
            // Get students for this class
            const studentsData = await studentService.getByClass(classId);

            // Get existing marks for this assessment
            const existingMarks = await studentMarkService.getByAssessment(assessmentId);

            // Check if we have existing marks (update mode)
            const hasExistingMarks = existingMarks.length > 0;
            setIsUpdateMode(hasExistingMarks);

            // Transform students with mark data
            const studentsWithMarks = transformStudentsWithMarks(studentsData, existingMarks);
            setStudents(studentsWithMarks);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [classId, assessmentId, assessments]);

  // Prevent accidental page refresh/exit when there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const markedCount = students.filter((s) => s.score !== null || s.is_excused).length;
      if (markedCount > 0) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [students]);

  // Save marks
  const saveMarks = async (): Promise<boolean> => {
    if (!selectedAssessment || !user?.id) {
      alert('እባክዎ መጀመሪያ ፈተና ይምረጡ');
      return false;
    }

    // Validate that no score exceeds total_marks
    const invalidScore = students.find(
      student => !student.is_excused && student.score !== null && student.score > selectedAssessment.total_marks
    );

    if (invalidScore) {
      alert(`ነጥብ ከ ${selectedAssessment.total_marks} አልፎ ሊሆን አይችልም። ${invalidScore.full_name} ለ ${invalidScore.score} ነጥብ ያስተካክሉ።`);
      return false;
    }

    try {
      setSaving(true);

      const markRecords = students.map(student => ({
        assessment_id: selectedAssessment.id,
        student_id: student.id,
        score: student.is_excused ? null : student.score,
        is_excused: student.is_excused,
        remarks: student.remarks,
        recorded_by: user.id,
        updated_at: new Date().toISOString()
      }));

      await studentMarkService.upsertBulk(markRecords);
      await refreshData();
      return true;

    } catch (error) {
      console.error('Error saving marks:', error);
      alert(`ነጥቦችን ማስቀመጥ አልተቻለም: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    // State
    students,
    paginatedStudents,
    filteredStudents,
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
    
    // Actions
    setCurrentPage,
    setSearchQuery,
    setShowSuccessModal,
    setShowAssessmentList,
    updateScore,
    toggleExcused,
    updateRemarks,
    saveMarks,
    
    // Params
    classId,
    assessmentId,
  };
}
