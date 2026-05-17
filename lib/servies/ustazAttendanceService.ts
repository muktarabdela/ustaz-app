import { supabase } from '@/lib/supabase';
import { UstazAttendance } from '@/models/UstazAttendance';

const TABLE_NAME = 'ustaz_attendance';

export interface CreateUstazAttendancePayload {
  ustaz_id: string;
  check_in_time: Date;
  check_in_date: Date;
  latitude: number;
  longitude: number;
  status: "present" | "late" | "invalid";
}

export interface UpdateUstazAttendancePayload {
  check_in_time?: Date;
  latitude?: number;
  longitude?: number;
  status?: "present" | "late" | "invalid";
}

export const ustazAttendanceService = {
  async create(payload: CreateUstazAttendancePayload): Promise<UstazAttendance> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<UstazAttendance[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('check_in_time', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<UstazAttendance | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async getByUstaz(ustazId: string): Promise<UstazAttendance[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('ustaz_id', ustazId)
      .order('check_in_time', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getByDate(date: string): Promise<UstazAttendance[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('check_in_date', date)
      .order('check_in_time', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getByUstazAndDate(ustazId: string, date: string): Promise<UstazAttendance | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('ustaz_id', ustazId)
      .eq('check_in_date', date)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: UpdateUstazAttendancePayload): Promise<UstazAttendance> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async getTodayAttendance(ustazId: string): Promise<UstazAttendance | null> {
    const today = new Date().toISOString().split('T')[0];
    return this.getByUstazAndDate(ustazId, today);
  }
};
