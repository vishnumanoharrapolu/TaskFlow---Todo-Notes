export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  color: string;
  pinned: boolean;
  createdAt: number;
  updatedAt: number;
  subtasks: Subtask[];
  category: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: number;
}
