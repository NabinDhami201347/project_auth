export interface Profile {
  id: number;
  photo: string;
  address: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  joinedDate: string | null;
  studentId: number;
}

// Define the main data type
export interface UserData {
  id: number;
  name: string;
  email: string;
  crn: string;
  role: string;
  semester: string | null;
  profile: Profile;
}
