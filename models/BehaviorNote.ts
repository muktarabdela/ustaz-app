/**
 * Matches 'note_type' enum in database
 */
export type NoteType = 'good' | 'issue';

export interface BehaviorNoteModel {
  id: string;
  student_id: string;
  note: string;
  type: NoteType;
  created_at: string;
}