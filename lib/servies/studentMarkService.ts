import { supabase } from '@/lib/supabase';
import { StudentMarkModel } from '@/models/StudentMark';

const TABLE_NAME = 'student_marks';

export const studentMarkService = {
  async create(payload: Omit<StudentMarkModel, 'id' | 'created_at'>): Promise<StudentMarkModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<StudentMarkModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<StudentMarkModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: Partial<StudentMarkModel>): Promise<StudentMarkModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByAssessment(assessmentId: string): Promise<StudentMarkModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('assessment_id', assessmentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getByStudent(studentId: string): Promise<StudentMarkModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async upsertBulk(records: Omit<StudentMarkModel, 'id' | 'created_at'>[]): Promise<StudentMarkModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .upsert(records, { onConflict: 'assessment_id,student_id' })
      .select();

    if (error) throw new Error(error.message);
    return data || [];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async checkMarksExists(assessmentId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('id')
      .eq('assessment_id', assessmentId)
      .limit(1);

    if (error) throw new Error(error.message);
    return (data && data.length > 0);
  }
};
