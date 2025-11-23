export interface Task {
  id: string;
  assignedTo: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  dueDate: string | null;
  priority: 'Low' | 'Normal' | 'High';
  description?: string;
}
