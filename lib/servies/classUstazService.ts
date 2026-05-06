import { supabase } from '@/lib/supabase';
import { ClassUstazModel } from '@/models/ClassUstaz';

const TABLE_NAME = 'class_ustaz';

export const classUstazService = {
  async assign(class_id: string, ustaz_id: string): Promise<ClassUstazModel> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert({ class_id, ustaz_id })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getByClass(class_id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, ustaz:ustaz(*)')
      .eq('class_id', class_id);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getByUstaz(ustaz_id: string) {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, classes:classes(*)')
      .eq('ustaz_id', ustaz_id);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async remove(class_id: string, ustaz_id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .match({ class_id, ustaz_id });

    if (error) throw new Error(error.message);
  }
};