"use client";

import { useState, useEffect } from 'react';

interface LocationPermissionProps {
  onLocationGranted?: (coords: { lat: number; lng: number }) => void;
  onLocationDenied?: () => void;
}

export default function LocationPermission({ 
  onLocationGranted, 
  onLocationDenied 
}: LocationPermissionProps) {
  const [permissionStatus, setPermissionStatus] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  useEffect(() => {
    // Check if geolocation is supported
    if (!("geolocation" in navigator)) {
      setPermissionStatus('unsupported');
      return;
    }

    // Check current permission status
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      // Check if we already have permission
      const result = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      setLocation({ lat: result.coords.latitude, lng: result.coords.longitude });
      setPermissionStatus('granted');
      setShowPrompt(false);
      onLocationGranted?.({ lat: result.coords.latitude, lng: result.coords.longitude });
    } catch (error) {
      const geoError = error as GeolocationPositionError;
      if (geoError.code === 1) { // PERMISSION_DENIED
        setPermissionStatus('denied');
        onLocationDenied?.();
      } else {
        setPermissionStatus('prompt'); // Other errors, still need to ask
      }
    }
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setPermissionStatus('unsupported');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setLocation(coords);
        setPermissionStatus('granted');
        setShowPrompt(false);
        setIsLoading(false);
        onLocationGranted?.(coords);
      },
      (error) => {
        console.error("Error getting location:", error);
        setPermissionStatus('denied');
        setIsLoading(false);
        onLocationDenied?.();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute cache
      }
    );
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    setPermissionStatus('denied');
    onLocationDenied?.();
  };

  // Don't render anything if prompt is dismissed or already handled
  if (!showPrompt || permissionStatus === 'granted') {
    return null;
  }

  // Show a small, non-intrusive notification
  return (
    <div className=" top-4 right-4 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <span className="material-symbols-outlined text-blue-500 text-xl">location_on</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">Location Access Needed</h3>
            <p className="text-gray-600 text-xs mt-1">
              This app needs location access for attendance check-in. Please enable location services for the best experience.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={requestLocation}
            disabled={isLoading}
            className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Getting Location...' : 'Allow Location'}
          </button>
          <button
            onClick={dismissPrompt}
            className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
