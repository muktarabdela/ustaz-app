/**
 * Matches 'attendance_status' enum in database
 */
export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceModel {
  id: string;
  student_id: string;
  class_id: string;
  date: string; // YYYY-MM-DD (Gregorian for database compatibility)
  ethiopian_date: string; // Ethiopian date in YYYY-MM-DD format
  ethiopian_day: number; // Ethiopian day (1-30)
  ethiopian_month: number; // Ethiopian month (1-13)
  ethiopian_year: number; // Ethiopian year
  status: AttendanceStatus;
  recorded_by: string | null; // ustaz_id
  created_at: string;
}