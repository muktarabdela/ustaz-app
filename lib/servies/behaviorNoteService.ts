import { supabase } from '@/lib/supabase';
import { BehaviorNoteModel } from '@/models/BehaviorNote';

const TABLE_NAME = 'behavior_notes';

export const behaviorNoteService = {
  async create(payload: Omit<BehaviorNoteModel, 'id' | 'created_at'>): Promise<BehaviorNoteModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByStudent(studentId: string): Promise<BehaviorNoteModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<BehaviorNoteModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
};