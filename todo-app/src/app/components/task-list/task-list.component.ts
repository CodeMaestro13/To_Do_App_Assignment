import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {

  tasks$!: Observable<Task[]>;
  private tasksSubscription?: Subscription;

  // DELETE MODAL STATE
  searchText: string = '';
  showDeleteModal = false;
  selectedTask: Task | null = null;
  filteredTasks: Task[] = [];
  allTasks: Task[] = [];
  dropdownOpenId: any | null = null; // track open dropdown

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
    
    // Subscribe to tasks observable to update filteredTasks
    this.tasksSubscription = this.tasks$.subscribe(tasks => {
      this.allTasks = tasks;
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  applyFilter(): void {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredTasks = [...this.allTasks];
    } else {
      const searchLower = this.searchText.toLowerCase().trim();
      this.filteredTasks = this.allTasks.filter(task =>
        task.assignedTo?.toLowerCase().includes(searchLower) ||
        task.status?.toLowerCase().includes(searchLower) ||
        task.priority?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.dueDate?.toLowerCase().includes(searchLower)
      );
    }
  }

  editTask(id: string) {
    this.dropdownOpenId = null; // Close dropdown
    this.router.navigate(['tasks/edit', id]);
  }

  toggleCompletion(task: Task) {
    this.dropdownOpenId = null; // Close dropdown
    this.taskService.updateTask(task.id, {
      ...task,
      status: task.status === 'Completed' ? 'Not Started' : 'Completed'
    });
  }

  /** SHOW DELETE POPUP */
  openDeleteModal(task: Task) {
    this.dropdownOpenId = null; // Close dropdown
    this.selectedTask = task;
    this.showDeleteModal = true;
  }

  /** CLOSE POPUP */
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedTask = null;
  }

  /** Close dropdown when clicking outside */
  closeDropdownOnOutsideClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.slds-dropdown-trigger')) {
      this.dropdownOpenId = null;
    }
  }

  /** CONFIRM DELETE */
  confirmDelete() {
    if (this.selectedTask) {
      this.taskService.deleteTask(this.selectedTask.id);
    }
    this.closeDeleteModal();
  }

  // added functions
  refresh(){
    // Refresh tasks from service
    this.taskService.getTasks();
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  openNewTask(){
    this.router.navigate(['tasks/new']);
  }

  toggleDropdown(id: any): void {
    this.dropdownOpenId = this.dropdownOpenId === id ? null : id;
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If it's already in a readable format, return as is
        return dateString;
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  }
}
