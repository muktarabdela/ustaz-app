import Link from 'next/link';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  message?: string;
  buttonText?: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  classId,
  message = 'ነጥቦች በተሳካ ሁኔታ ተቀምጠዋል።',
  buttonText = 'ወደ ፈተናዎች ዝርዝር ተመለስ',
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-container-padding">
      <div className="bg-surface-container-lowest rounded-xl p-md max-w-[400px] w-full text-center">
        {/* Success Icon */}
        <div className="mb-lg flex justify-center">
          <div className="w-24 h-24 bg-primary-container rounded-full flex items-center justify-center ambient-shadow">
            <span
              className="material-symbols-outlined text-[48px] text-on-primary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
        </div>

        {/* Headline & Message */}
        <h1 className="font-h1 text-h1 text-on-surface mb-sm">
          {message}
        </h1>

        {/* Actions */}
        <div className="flex flex-col gap-sm">
          <Link href={`/`} onClick={onClose}>
            <button className="w-full h-12 bg-primary text-on-primary font-button text-button rounded-full flex items-center justify-center transition-colors">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
