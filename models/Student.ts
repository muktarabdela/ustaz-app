export interface StudentModel {
  id: string;
  full_name: string;
  parent_phone: string;
  class_id: string | null;
  is_active: boolean;
  created_at: string;
}