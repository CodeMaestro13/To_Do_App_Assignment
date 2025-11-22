export interface Task {
  id: string;         // use uuid or timestamp
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;  // ISO date string
  dueDate?: string;
}
