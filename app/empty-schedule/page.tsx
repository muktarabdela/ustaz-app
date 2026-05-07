import DashboardLayout from "@/components/DashboardLayout";

export default function EmptySchedulePage() {
  return (
    <DashboardLayout>
      
      {/* Welcome Header Area (Desktop only - Mobile uses the TopAppBar) */}
      <div className="hidden md:block mb-xl mt-2">
        <h1 className="font-h1 text-h1 text-on-surface">
          አሰላሙ አለይኩም, Ustaz Ahmed
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-xs">
          Here is your schedule for today.
        </p>
      </div>

      {/* Empty State Container */}
      <div className="flex flex-col items-center justify-center text-center px-4 py-16 md:py-32">
        
        {/* Illustration / Icon Container */}
        <div className="mb-lg w-48 h-48 rounded-full bg-surface-container-low flex items-center justify-center ambient-shadow relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-container to-surface-container-low opacity-50"></div>
          <span className="material-symbols-outlined text-primary text-[80px] z-10">
            menu_book
          </span>
        </div>

        {/* Text Content */}
        <h2 className="font-h1 text-h1 text-on-surface mb-sm">
          No classes assigned today.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-xl">
          You have a clear schedule. Please contact the administrator if you believe this is an error.
        </p>

        {/* Action Button */}
        <button className="font-button text-button text-primary px-lg py-sm rounded-full hover:bg-surface-container-low transition-colors duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">mail</span>
          <span>Contact Admin</span>
        </button>
        
      </div>
      
    </DashboardLayout>
  );
}