import { AssessmentModel } from '@/models/Assessment';

/**
 * Count assessments for a specific class
 */
export function countAssessmentsByClass(assessments: AssessmentModel[], classId: string): number {
  return assessments.filter(a => a.class_id === classId).length;
}

/**
 * Get assessments for a specific class
 */
export function getAssessmentsByClass(assessments: AssessmentModel[], classId: string): AssessmentModel[] {
  return assessments.filter(a => a.class_id === classId);
}
