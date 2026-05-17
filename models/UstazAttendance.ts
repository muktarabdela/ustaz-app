export interface UstazAttendance {
    id: string;
    ustaz_id: string;
    check_in_time: Date;
    check_in_date: Date;
    latitude: number;
    longitude: number;
    status: "present" | "late" | "invalid";
    created_at: Date;
}