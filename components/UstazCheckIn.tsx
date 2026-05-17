"use client";

import { useState, useEffect } from 'react';
import { useData } from '@/context/dataContext';
import { ustazAttendanceService } from '@/lib/servies/ustazAttendanceService';

// Configuration constants
const CHECK_IN_LOCATION = {
  latitude: 9.059746207139524, // Default: Riyadh, Saudi Arabia - CHANGE THIS TO YOUR ACTUAL LOCATION
  longitude: 38.684364241449025,
  radius: 200 // meters
};


const CHECK_IN_TIME_RANGE = {
  start: { hour: 0, minute: 0 }, // 12:00 AM
  end: { hour: 23, minute: 59 } // 11:59 PM
};

const ALLOWED_DAYS = [1, 2, 3, 4, 5, 6, 7]; // Monday (1) to Sunday (7)

// Helper function to calculate distance using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Check if current time is within allowed range
const isTimeAllowed = (): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentMinutes = currentHour * 60 + currentMinute;

  const startMinutes = CHECK_IN_TIME_RANGE.start.hour * 60 + CHECK_IN_TIME_RANGE.start.minute;
  const endMinutes = CHECK_IN_TIME_RANGE.end.hour * 60 + CHECK_IN_TIME_RANGE.end.minute;

  return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
};

// Check if current day is allowed
const isDayAllowed = (): boolean => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return ALLOWED_DAYS.includes(dayOfWeek);
};

interface CheckInStatus {
  timeAllowed: boolean;
  dayAllowed: boolean;
  locationVerified: boolean;
  canCheckIn: boolean;
  distance?: number;
  userLocation?: { latitude: number; longitude: number };
}

export default function UstazCheckIn() {
  const { ustaz } = useData();
  const [loading, setLoading] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [status, setStatus] = useState<CheckInStatus>({
    timeAllowed: false,
    dayAllowed: false,
    locationVerified: false,
    canCheckIn: false
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');

  // Update status periodically
  useEffect(() => {
    const updateStatus = () => {
      const timeAllowed = isTimeAllowed();
      const dayAllowed = isDayAllowed();
      
      setStatus(prev => ({
        ...prev,
        timeAllowed,
        dayAllowed,
        canCheckIn: timeAllowed && dayAllowed && prev.locationVerified
      }));
    };

    updateStatus();
    const interval = setInterval(updateStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Get user location
  const getUserLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to retrieve your location'));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000 // 1 minute cache
        }
      );
    });
  };

  // Verify location
  const verifyLocation = async () => {
    setCheckingLocation(true);
    setMessage('Getting your location...');
    setMessageType('info');

    try {
      const userLocation = await getUserLocation();
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        CHECK_IN_LOCATION.latitude,
        CHECK_IN_LOCATION.longitude
      );

      const locationVerified = distance <= CHECK_IN_LOCATION.radius;

      setStatus(prev => ({
        ...prev,
        locationVerified,
        userLocation,
        distance,
        canCheckIn: prev.timeAllowed && prev.dayAllowed && locationVerified
      }));

      if (locationVerified) {
        setMessage(`Location verified! You are ${Math.round(distance)}m from the check-in point.`);
        setMessageType('success');
      } else {
        setMessage(`You are too far from the check-in point (${Math.round(distance)}m). Maximum allowed distance: ${CHECK_IN_LOCATION.radius}m.`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Location verification failed');
      setMessageType('error');
      setStatus(prev => ({
        ...prev,
        locationVerified: false,
        canCheckIn: false
      }));
    } finally {
      setCheckingLocation(false);
    }
  };

  // Handle check-in
  const handleCheckIn = async () => {
    if (!ustaz || ustaz.length === 0) {
      setMessage('No user found. Please log in first.');
      setMessageType('error');
      return;
    }

    if (!status.canCheckIn) {
      setMessage('Check-in is not allowed at this time or location.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('Processing check-in...');
    setMessageType('info');

    try {
      // Check if already checked in today
      const today = new Date().toISOString().split('T')[0];
      const existingAttendance = await ustazAttendanceService.getByUstazAndDate(ustaz[0].id, today);

      if (existingAttendance) {
        setMessage('You have already checked in today.');
        setMessageType('error');
        return;
      }

      // Create attendance record
      const now = new Date();
      const attendanceData = {
        ustaz_id: ustaz[0].id,
        check_in_time: now,
        check_in_date: now,
        latitude: status.userLocation!.latitude,
        longitude: status.userLocation!.longitude,
        status: (status.timeAllowed ? 'present' : 'late') as "present" | "late"
      };

      await ustazAttendanceService.create(attendanceData);

      setMessage('Check-in successful! Welcome.');
      setMessageType('success');

      // Reset location verification after successful check-in
      setStatus(prev => ({
        ...prev,
        locationVerified: false,
        userLocation: undefined,
        canCheckIn: false
      }));

    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Check-in failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w- mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Ustaz Check-In</h2>
      
      {/* Status Messages */}
      <div className="mb-6 space-y-2">
        <div className={`p-3 rounded ${status.dayAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className="font-semibold">Day Status:</span> {status.dayAllowed ? 'Allowed' : 'Not allowed (Mon-Fri only)'}
        </div>
        
        <div className={`p-3 rounded ${status.timeAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <span className="font-semibold">Time Status:</span> {status.timeAllowed ? 'Allowed (8:00-9:00 AM)' : 'Not allowed (8:00-9:00 AM only)'}
        </div>
        
        <div className={`p-3 rounded ${status.locationVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          <span className="font-semibold">Location Status:</span> {status.locationVerified ? 'Verified' : 'Not verified'}
          {status.distance !== undefined && (
            <span className="block text-sm mt-1">
              Distance: {Math.round(status.distance)}m (Max: {CHECK_IN_LOCATION.radius}m)
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!status.locationVerified && (
          <button
            onClick={verifyLocation}
            disabled={checkingLocation}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {checkingLocation ? 'Getting Location...' : 'Verify Location'}
          </button>
        )}

        <button
          onClick={handleCheckIn}
          disabled={!status.canCheckIn || loading}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Processing...' : 'Check In'}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mt-4 p-3 rounded ${messageType === 'success' ? 'bg-green-100 text-green-800' : messageType === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-semibold mb-2">Check-in Requirements:</h3>
        <ul className="list-disc list-inside space-y-1">
          <li>Only available Monday to Friday</li>
          <li>Time: 8:00 AM - 9:00 AM</li>
          <li>Must be within {CHECK_IN_LOCATION.radius}m of the designated location</li>
          <li>Location services must be enabled</li>
        </ul>
      </div>
    </div>
  );
}
