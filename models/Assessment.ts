export type AssessmentType = 'exam' | 'test' | 'assignment' | 'quiz' | 'project';

export interface AssessmentModel {
  id: string;
  title: string; // e.g., "Semester 1 Final Exam"
  type: AssessmentType;
  total_marks: number; // e.g., 100, 50, 10
  class_id: string;
  subject_id?: string; // Recommended: Link to a Subject/Course
  description: string | null;
  
  // Date of the assessment
  date: string | null; // Gregorian YYYY-MM-DD
  ethiopian_date: string | null; 
  
  created_by: string; // admin_id
  created_at: string;
  is_published: boolean; // Lets admin hide it from Ustaz until ready
}