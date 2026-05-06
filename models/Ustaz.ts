export interface UstazModel {
  id: string;
  full_name: string;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  phone_number: string | null;
  password_hash: string | null;
  must_change_password: boolean | null;
}