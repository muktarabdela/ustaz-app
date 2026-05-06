"use client";

import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-container-padding antialiased">
      
      {/* 
        FIXED: Replaced 'max-w-sm' with 'max-w-[400px]' so the card is the correct width!
      */}
      <div className="w-full max-w-[400px] bg-surface-container-lowest rounded-xl ambient-shadow p-xl border border-surface-variant flex flex-col">
        
        {/* Header/Logo */}
        <div className="flex justify-center mb-md text-primary">
          <span 
            className="material-symbols-outlined text-[48px]" 
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mosque
          </span>
        </div>
        <h1 className="font-h1 text-h1 text-on-surface text-center mb-xl">
          Islamic Academy Attendance
        </h1>

        {/* Form */}
        <form action="/" className="flex flex-col gap-lg">
          
          {/* Phone Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="phone">
              Phone Number
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-md text-on-surface-variant">
                phone_iphone
              </span>
              <input 
                className="w-full h-[48px] pl-[48px] pr-md py-sm bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                id="phone" 
                placeholder="Enter your phone number" 
                type="tel"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-caps text-label-caps text-on-surface-variant" htmlFor="password">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-md text-on-surface-variant">
                lock
              </span>
              <input 
                className="w-full h-[48px] pl-[48px] pr-[48px] py-sm bg-surface border border-outline-variant rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors" 
                id="password" 
                placeholder="Enter your password" 
                type={showPassword ? "text" : "password"}
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-full w-[24px]"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full h-[48px] mt-sm bg-primary text-on-primary font-button text-button rounded-lg flex items-center justify-center hover:bg-on-primary-fixed-variant transition-colors shadow-sm active:scale-95"
          >
            Login
          </button>

        </form>
      </div>
    </div>
  );
}