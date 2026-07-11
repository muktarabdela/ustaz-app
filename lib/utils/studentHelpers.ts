import { StudentModel } from '@/models/Student';
import { StudentMarkModel } from '@/models/StudentMark';

export interface StudentWithMark extends StudentModel {
  score: number | null;
  is_excused: boolean;
  remarks: string | null;
  initials: string;
  avatarColor: string;
}

const AVATAR_COLORS = [
  "bg-secondary-container text-on-secondary-container",
  "bg-tertiary-container text-on-tertiary-container",
  "bg-surface-variant text-on-surface-variant",
];

/**
 * Transform student name to initials (max 2 characters)
 */
export function getInitials(fullName: string): string {
  return fullName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Get avatar color based on index
 */
export function getAvatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

/**
 * Transform students with mark data
 */
export function transformStudentsWithMarks(
  students: StudentModel[],
  existingMarks: StudentMarkModel[]
): StudentWithMark[] {
  return students.map((student, index) => {
    const mark = existingMarks.find(m => m.student_id === student.id);
    
    return {
      ...student,
      initials: getInitials(student.full_name),
      score: mark?.score ?? null,
      is_excused: mark?.is_excused ?? false,
      remarks: mark?.remarks ?? null,
      avatarColor: getAvatarColor(index)
    };
  });
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(markedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return (markedCount / totalCount) * 100;
}

/**
 * Count marked students (those with score or excused)
 */
export function countMarkedStudents(students: StudentWithMark[]): number {
  return students.filter((s) => s.score !== null || s.is_excused).length;
}
