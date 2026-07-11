import { supabase } from '@/lib/supabase';
import { AssessmentModel } from '@/models/Assessment';

const TABLE_NAME = 'assessments';

export const assessmentService = {
  async create(payload: Omit<AssessmentModel, 'id' | 'created_at'>): Promise<AssessmentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<AssessmentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<AssessmentModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: Partial<AssessmentModel>): Promise<AssessmentModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByClass(classId: string): Promise<AssessmentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getPublished(): Promise<AssessmentModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('is_published', true)
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
