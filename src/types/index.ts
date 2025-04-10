export interface User {
  id: string;
  email: string;
  role: 'admin' | 'hr_agent' | 'manager';
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  type: 'agency' | 'client';
  address: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TempWorker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  skills: string[];
  availability: {
    start: Date;
    end: Date;
  }[];
  documents: Document[];
  missionHistory: string[]; // References to Mission IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Mission {
  id: string;
  clientId: string;
  title: string;
  description: string;
  requiredSkills: string[];
  location: string;
  startDate: Date;
  endDate: Date;
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
  assignedWorkerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  workerId: string;
  type: 'id' | 'contract' | 'certification' | 'other';
  title: string;
  url: string;
  expiryDate?: Date;
  status: 'valid' | 'expired' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIRequest {
  id: string;
  userId: string;
  query: string;
  context: Record<string, unknown>;
  response: string;
  model: 'claude' | 'gpt' | 'gemini';
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  completedAt?: Date;
}