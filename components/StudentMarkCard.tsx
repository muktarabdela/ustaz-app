import { StudentWithMark } from '@/lib/utils/studentHelpers';
import { AssessmentModel } from '@/models/Assessment';

interface StudentMarkCardProps {
  student: StudentWithMark;
  index: number;
  totalMarks: number | undefined;
  onUpdateScore: (id: string, score: number | null) => void;
  onToggleExcused: (id: string) => void;
  onUpdateRemarks: (id: string, remarks: string) => void;
}

export function StudentMarkCard({
  student,
  index,
  totalMarks,
  onUpdateScore,
  onToggleExcused,
  onUpdateRemarks,
}: StudentMarkCardProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl ambient-shadow p-md flex flex-col gap-sm">
      <div className="flex items-center gap-sm mb-xs">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-button text-on-primary text-sm shrink-0">
          {index + 1}
        </div>
        <div className="flex-grow">
          <h3 className="font-button text-button text-on-surface">
            {student.full_name}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-sm">
        {/* Score Input */}
        <div className="flex items-center gap-sm">
          <div className="flex-1 flex items-center bg-surface-container-low rounded-lg p-sm border border-surface-variant focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant mr-sm text-sm">
              grade
            </span>
            <div className="relative flex items-center flex-1">
              <input
                type="number"
                min="0"
                max={totalMarks}
                placeholder="ነጥብ"
                value={student.score ?? ''}
                onChange={(e) => onUpdateScore(student.id, e.target.value ? parseFloat(e.target.value) : null)}
                disabled={student.is_excused}
                className="bg-transparent border-none focus:ring-0 w-full font-button text-button text-on-surface p-0 outline-none"
              />
              <span className="text-on-surface-variant text-sm absolute right-0 top-0 mr-sm mt-sm">
                / {totalMarks}
              </span>
            </div>
          </div>

          {/* Excused Toggle */}
          <button
            onClick={() => onToggleExcused(student.id)}
            className={`h-12 px-4 rounded-lg flex items-center justify-center gap-xs transition-transform active:scale-95 ${
              student.is_excused
                ? "bg-tertiary-container text-on-tertiary-container border-none"
                : "bg-surface-container-high text-on-surface-variant border border-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {student.is_excused ? 'check_circle' : 'cancel'}
            </span>
            <span className="font-label-caps text-label-caps">
              {student.is_excused ? 'የለም' : 'የለም'}
            </span>
          </button>
        </div>

        {/* Remarks Input */}
        <input
          type="text"
          placeholder="ማስታወሻ (አማራጭ)"
          value={student.remarks ?? ''}
          onChange={(e) => onUpdateRemarks(student.id, e.target.value)}
          className="bg-surface-container-low border border-surface-variant rounded-lg p-sm font-body-md text-body-md text-on-surface focus:border-primary focus:ring-0 outline-none transition-colors"
        />
      </div>
    </div>
  );
}
