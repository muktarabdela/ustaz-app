import { supabase } from '@/lib/supabase';
import { AttendanceModel } from '@/models/Attendance';
import { toEthiopian } from 'ethiopian-calendar-new';

const TABLE_NAME = 'attendance';

// Helper function to convert Gregorian date to Ethiopian date components
const convertToEthiopianDate = (gregorianDate: string) => {
  const date = new Date(gregorianDate);
  const ethDate = toEthiopian(date.getFullYear(), date.getMonth() + 1, date.getDate());
  
  return {
    ethiopian_date: `${ethDate.year}-${ethDate.month.toString().padStart(2, '0')}-${ethDate.day.toString().padStart(2, '0')}`,
    ethiopian_day: ethDate.day,
    ethiopian_month: ethDate.month,
    ethiopian_year: ethDate.year
  };
};

// Define a type for attendance creation without Ethiopian fields (they'll be added automatically)
type AttendanceCreatePayload = Omit<AttendanceModel, 'id' | 'created_at' | 'ethiopian_date' | 'ethiopian_day' | 'ethiopian_month' | 'ethiopian_year'>;

export const attendanceService = {
  async create(payload: AttendanceCreatePayload): Promise<AttendanceModel> {
    // Add Ethiopian date components
    const ethiopianDate = convertToEthiopianDate(payload.date);
    const enhancedPayload = { ...payload, ...ethiopianDate };
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(enhancedPayload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByDate(date: string, classId?: string) {
    let query = supabase
      .from(TABLE_NAME)
      .select('*, student:students(*)')
      .eq('date', date);

    if (classId) {
      query = query.eq('class_id', classId);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  async upsertBulk(records: AttendanceCreatePayload[]) {
    // Add Ethiopian date components to each record
    const enhancedRecords = records.map(record => {
      const ethiopianDate = convertToEthiopianDate(record.date);
      return { ...record, ...ethiopianDate };
    });
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(enhancedRecords, { onConflict: 'student_id,date' })
      .select();

    if (error) throw new Error(error.message);
    return data;
  }
};