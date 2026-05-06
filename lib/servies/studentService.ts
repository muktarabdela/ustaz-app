import { supabase } from '@/lib/supabase';
import { StudentModel } from '@/models/Student';

const TABLE_NAME = 'students';

export const studentService = {
  async create(payload: Omit<StudentModel, 'id' | 'created_at'>): Promise<StudentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<StudentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, class:classes(*)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<StudentModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: Partial<StudentModel>): Promise<StudentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByClass(classId: string): Promise<StudentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('class_id', classId)
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getStudentCountByClass(classId: string): Promise<number> {
    const { data, error, count } = await supabase
      .from(TABLE_NAME)
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId)
      .eq('is_active', true);

    if (error) throw new Error(error.message);
    return count || 0;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};