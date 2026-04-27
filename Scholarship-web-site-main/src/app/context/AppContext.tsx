import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { authService, scholarshipService, applicationService } from '../services/apiService';

export interface Scholarship {
  id: string;
  title: string;
  amount: number;
  deadline: string;
  category: string;
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  organization: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gpa: string;
  major: string;
  year: string;
  statement: string;
  status: 'submitted' | 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  documents: string[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
  token?: string;
}

interface AppContextType {
  user: User | null;
  login: (email: string, password: string, role: 'student' | 'admin') => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: 'student' | 'admin', otp: string) => Promise<{ success: boolean; message?: string }>;
  sendOtp: (email: string) => Promise<{ success: boolean; message?: string }>;
  scholarships: Scholarship[];
  applications: Application[];
  addApplication: (scholarshipId: string, details: any) => Promise<void>;
  deleteApplication: (applicationId: string) => Promise<void>;
  updateApplicationStatus: (applicationId: string, status: Application['status']) => Promise<void>;
  addScholarship: (scholarship: Omit<Scholarship, 'id'>) => Promise<void>;
  updateScholarship: (id: string, scholarship: Partial<Scholarship>) => Promise<void>;
  deleteScholarship: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const CURRENT_USER_KEY = 'edufund_current_user';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  });
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  const fetchScholarships = useCallback(async () => {
    try {
      const data = await scholarshipService.getAll();
      setScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    try {
      const data = user.role === 'admin' 
        ? await applicationService.getAll() 
        : await applicationService.getByStudentId(user.id);
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    await Promise.all([fetchScholarships(), fetchApplications()]);
  }, [fetchScholarships, fetchApplications]);

  useEffect(() => {
    fetchScholarships();
  }, [fetchScholarships]);

  useEffect(() => {
    if (user) {
      fetchApplications();
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      setApplications([]);
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user, fetchApplications]);

  const login = async (email: string, password: string, role: 'student' | 'admin'): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await authService.login({ email, password, role });
      setUser(data as User);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (email: string, password: string, name: string, role: 'student' | 'admin', otp: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const data = await authService.register({ email, password, name, role, otp });
      setUser(data as User);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const sendOtp = async (email: string): Promise<{ success: boolean; message?: string }> => {
    try {
      await authService.sendOtp(email);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const addApplication = async (scholarshipId: string, details: any) => {
    if (!user) return;
    try {
      await applicationService.create({ ...details, scholarshipId, studentId: user.id });
      await fetchApplications();
    } catch (error) {
      console.error('Error adding application:', error);
    }
  };

  const deleteApplication = async (applicationId: string) => {
    try {
      await applicationService.delete(applicationId);
      setApplications(prev => prev.filter(app => app.id !== applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: Application['status']) => {
    try {
      await applicationService.updateStatus(applicationId, status);
      setApplications(prev => prev.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const addScholarship = async (scholarship: Omit<Scholarship, 'id'>) => {
    try {
      await scholarshipService.create(scholarship);
      await fetchScholarships();
    } catch (error) {
      console.error('Error adding scholarship:', error);
    }
  };

  const updateScholarship = async (id: string, updates: Partial<Scholarship>) => {
    try {
      await scholarshipService.update(id, updates);
      await fetchScholarships();
    } catch (error) {
      console.error('Error updating scholarship:', error);
    }
  };

  const deleteScholarship = async (id: string) => {
    try {
      await scholarshipService.delete(id);
      setScholarships(prev => prev.filter(s => s.id !== id));
      setApplications(prev => prev.filter(app => app.scholarshipId !== id));
    } catch (error) {
      console.error('Error deleting scholarship:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      register,
      sendOtp,
      scholarships,
      applications,
      addApplication,
      deleteApplication,
      updateApplicationStatus,
      addScholarship,
      updateScholarship,
      deleteScholarship,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
