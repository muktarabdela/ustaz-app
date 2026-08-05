import { AssessmentModel } from '@/models/Assessment';

/**
 * Count assessments for a specific class (filtered by ustaz)
 */
export function countAssessmentsByClass(assessments: AssessmentModel[], classId: string, ustazId?: string): number {
  if (ustazId) {
    return assessments.filter(a => a.class_id === classId && a.ustaz_id === ustazId).length;
  }
  return assessments.filter(a => a.class_id === classId).length;
}

/**
 * Get assessments for a specific class (filtered by ustaz)
 */
export function getAssessmentsByClass(assessments: AssessmentModel[], classId: string, ustazId?: string): AssessmentModel[] {
  if (ustazId) {
    return assessments.filter(a => a.class_id === classId && a.ustaz_id === ustazId);
  }
  return assessments.filter(a => a.class_id === classId);
}
