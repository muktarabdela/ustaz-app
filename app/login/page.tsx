"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login({
        phone_number: phoneNumber,
        password: password
      });

      if (result.success) {
        router.push("/");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
          nurel islam ustaz
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-error-container text-on-error-container p-sm rounded-lg text-sm font-body-md mb-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          
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
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                disabled={isLoading}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center h-full w-[24px]"
                disabled={isLoading}
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
            className="w-full h-[48px] mt-sm bg-primary text-on-primary font-button text-button rounded-lg flex items-center justify-center hover:bg-on-primary-fixed-variant transition-colors shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              "Login"
            )}
          </button>

        </form>
      </div>
    </div>
  );
}