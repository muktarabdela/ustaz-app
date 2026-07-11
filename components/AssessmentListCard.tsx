import { AssessmentModel } from '@/models/Assessment';
import Link from 'next/link';

interface AssessmentListCardProps {
  assessment: AssessmentModel;
  classId: string;
}

export function AssessmentListCard({ assessment, classId }: AssessmentListCardProps) {
  return (
    <Link
      href={`/take-marks?classId=${classId}&assessmentId=${assessment.id}`}
      className="bg-surface-container-lowest rounded-xl ambient-shadow p-md flex flex-col gap-sm hover:bg-surface-container-low transition-colors"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-h3 text-h3 text-on-surface">
            {assessment.title}
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
            {assessment.type} • {assessment.total_marks} ነጥብ
          </p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant">
          chevron_right
        </span>
      </div>
    </Link>
  );
}
