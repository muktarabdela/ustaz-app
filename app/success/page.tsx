import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center font-body-md text-on-background p-container-padding">
      
      {/* FIXED: Changed max-w-md to max-w-[400px] */}
      <main className="w-full max-w-[400px] text-center">
        
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
           የ ዛሬ አቴዳንስ በተሳካ ሁኔታ ተቀምጧል።
        </h1>
        {/* Actions */}
        <div className="flex flex-col gap-sm">
          <Link href="/">
            <button className="w-full h-12 bg-surface-container-high hover:bg-surface-dim text-on-surface font-button text-button rounded-full flex items-center justify-center transition-colors">
              ወደ ዋና ገጽ ተመለስ
            </button>
          </Link>
        </div>

      </main>

    </div>
  );
}