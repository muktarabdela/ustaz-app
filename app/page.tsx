import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";

export default function UstazDashboard() {
  return (
    <DashboardLayout>
      {/* Dashboard Header */}
      <div className="mb-xl text-center md:text-left">
        <h2 className="font-h1 text-h1 text-on-surface mb-2">
          Assalamu Alaikum, Ustaz Ahmed
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Monday, Oct 23
        </p>
      </div>

      {/* Classes Grid (Bento style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
        
        {/* Class Card 1 */}
        <article className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow flex flex-col justify-between border border-surface-container-low hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary-container/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">menu_book</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-3 py-1 rounded-full">
                15 Students
              </span>
            </div>
            <h3 className="font-h2 text-h2 text-on-surface mb-2">Qaida</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Room A1 • 09:00 AM
            </p>
          </div>
         <Link href="/take-attendance" className="w-full">
  <button className="w-full bg-primary text-on-primary font-button text-button h-12 rounded-lg hover:bg-surface-tint active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
    <span className="material-symbols-outlined text-sm">checklist</span>
    Take Attendance
  </button>
</Link>
        </article>

        {/* Class Card 2 */}
        <article className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow flex flex-col justify-between border border-surface-container-low hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">record_voice_over</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-3 py-1 rounded-full">
                12 Students
              </span>
            </div>
            <h3 className="font-h2 text-h2 text-on-surface mb-2">Hifz Level 1</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Main Hall • 11:30 AM
            </p>
          </div>
          <Link href="/take-attendance" className="w-full">
            <button className="w-full bg-primary text-on-primary font-button text-button h-12 rounded-lg hover:bg-surface-tint active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">checklist</span>
              Take Attendance
            </button>
          </Link>
        </article>

        {/* Class Card 3 */}
        <article className="bg-surface-container-lowest rounded-xl p-lg ambient-shadow flex flex-col justify-between border border-surface-container-low hover:shadow-md transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary-container/30 flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined">balance</span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container font-label-caps text-label-caps px-3 py-1 rounded-full">
                20 Students
              </span>
            </div>
            <h3 className="font-h2 text-h2 text-on-surface mb-2">Fiqh Basics</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Room B2 • 02:00 PM
            </p>
          </div>
          <Link href="/take-attendance" className="w-full">
            <button className="w-full bg-primary text-on-primary font-button text-button h-12 rounded-lg hover:bg-surface-tint active:scale-95 transition-all duration-200 shadow-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">checklist</span>
              Take Attendance
            </button>
          </Link>
        </article>

      </div>
    </DashboardLayout>
  );
}