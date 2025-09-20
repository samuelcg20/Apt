export interface User {
  id: string;
  email: string;
  role: 'STUDENT' | 'COMPANY';
  createdAt: string;
  studentProfile?: StudentProfile;
}

export interface StudentProfile {
  id: string;
  name: string;
  university: string;
  yearOfStudy: number;
  skills: string[];
  bio?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  projects: PortfolioProject[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  link?: string;
  studentId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  domain: 'MARKETING' | 'CODING' | 'UIUX' | 'FINANCE';
  duration: string;
  deliverables: string;
  status: 'OPEN' | 'CLOSED';
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company: {
    id: string;
    email: string;
  };
  applications: Application[];
}

export interface Application {
  id: string;
  taskId: string;
  studentId: string;
  status: 'APPLIED' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  task?: Task;
  student?: StudentProfile;
}

export interface Review {
  id: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: {
    id: string;
    email: string;
    role: string;
  };
  reviewee: {
    id: string;
    email: string;
    role: string;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationInfo;
}
