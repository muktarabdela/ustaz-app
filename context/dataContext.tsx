"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Models
import { StudentModel } from '@/models/Student';
import { AttendanceModel } from '@/models/Attendance';
import { UstazModel } from '@/models/Ustaz';
import { ClassModel } from '@/models/Class';
import { BehaviorNoteModel } from '@/models/BehaviorNote';

// Services
import { studentService } from '@/lib/servies/studentService';
import { attendanceService } from '@/lib/servies/attendanceService';
import { ustazService } from '@/lib/servies/ustazService';
import { classService } from '@/lib/servies/classService';
import { behaviorNoteService } from '@/lib/servies/behaviorNoteService';
import { classUstazService } from '@/lib/servies/classUstazService';

type DataContextType = {
  students: StudentModel[];
  attendance: AttendanceModel[];
  ustaz: UstazModel[];
  classes: ClassModel[];
  behaviorNotes: BehaviorNoteModel[];
  ustazClasses: any[]; // Will contain class_ustaz with classes data

  loading: boolean;
  error: string | null;

  refreshData: () => Promise<void>;
  getUstazClasses: (ustazId: string) => Promise<void>;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [attendance, setAttendance] = useState<AttendanceModel[]>([]);
  const [ustaz, setUstaz] = useState<UstazModel[]>([]);
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [behaviorNotes, setBehaviorNotes] = useState<BehaviorNoteModel[]>([]);
  const [ustazClasses, setUstazClasses] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getUstazClasses = async (ustazId: string) => {
    try {
      const ustazClassesData = await classUstazService.getByUstaz(ustazId);
      setUstazClasses(ustazClassesData);
    } catch (err) {
      console.error('Error fetching ustaz classes:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch ustaz classes');
    }
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        studentsData,
        ustazData,
        classesData,
        behaviorNotesData
      ] = await Promise.all([
        studentService.getAll(),
        ustazService.getAll(),
        classService.getAll(),
        // NOTE: Behavior notes can be heavy → optional
        // You can remove this if not needed globally
        behaviorNoteService.getAll()
      ]);

      setStudents(studentsData);
      setUstaz(ustazData);
      setClasses(classesData);
      setBehaviorNotes(behaviorNotesData);

      // Attendance → load separately (better performance)
      const today = new Date().toISOString().split('T')[0];
      const attendanceData = await attendanceService.getByDate(today);

      setAttendance(attendanceData);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const value: DataContextType = {
    students,
    attendance,
    ustaz,
    classes,
    behaviorNotes,
    ustazClasses,
    loading,
    error,
    refreshData: fetchAllData,
    getUstazClasses,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export default DataContext;