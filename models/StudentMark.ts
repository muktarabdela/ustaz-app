export interface StudentMarkModel {
  id: string;
  assessment_id: string; // Links to AssessmentModel
  student_id: string;    // Links to StudentModel
  
  score: number | null;  // Nullable because a student might not be graded yet
  is_excused: boolean;   // Differentiates between a '0' (failed) and 'excused/absent'
  remarks: string | null; // Optional feedback from Ustaz
  
  recorded_by: string;   // ustaz_id
  updated_at: string;    // Crucial for auditing changes
  created_at: string;
}