import { supabase } from '@/lib/supabase';
import { UstazModel } from '@/models/Ustaz';
import bcrypt from 'bcryptjs';

const TABLE_NAME = 'ustaz';

// Helper function to hash password using bcrypt
const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export interface CreateUstazPayload {
  full_name: string;
  phone_number?: string | null;
  is_active: boolean;
  must_change_password?: boolean | null;
  password: string;
}

export interface UpdateUstazPayload {
  full_name?: string;
  phone_number?: string | null;
  is_active?: boolean;
  must_change_password?: boolean | null;
  password?: string;
}

export interface LoginPayload {
  phone_number: string;
  password: string;
}

export interface LoginResponse {
  user: UstazModel;
  success: boolean;
  message?: string;
}

export const ustazService = {
  async create(payload: CreateUstazPayload): Promise<UstazModel> {
 const { password, ...otherFields } = payload;
    
    const createPayload = {
      ...otherFields,
      password_hash: hashPassword(password),
    };
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(createPayload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async getAll(): Promise<UstazModel[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getById(id: string): Promise<UstazModel | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error?.code === 'PGRST116') return null;
    if (error) throw new Error(error.message);

    return data;
  },

  async update(id: string, updates: UpdateUstazPayload): Promise<UstazModel> {
    const updatePayload: any = { ...updates };
    
    if (updates.password) {
      updatePayload.password_hash = hashPassword(updates.password);
      delete updatePayload.password;
    }

    const { data, error } = await supabase
      .from(TABLE_NAME)
      .update(updatePayload)
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

  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const { data, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('phone_number', payload.phone_number)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            user: {} as UstazModel,
            success: false,
            message: 'Invalid phone number or password'
          };
        }
        throw new Error(error.message);
      }

      if (!data.password_hash) {
        return {
          user: {} as UstazModel,
          success: false,
          message: 'Account not properly configured'
        };
      }

      const isMatch = bcrypt.compareSync(payload.password, data.password_hash);
      
      if (!isMatch) {
        return {
          user: {} as UstazModel,
          success: false,
          message: 'Invalid phone number or password'
        };
      }

      return {
        user: data,
        success: true,
        message: 'Login successful'
      };

    } catch (error) {
      return {
        user: {} as UstazModel,
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }
};