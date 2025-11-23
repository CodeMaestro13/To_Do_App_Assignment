import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasks$!: Observable<Task[]>;

  // DELETE MODAL STATE
  searchText: string = '';
  showDeleteModal = false;
  selectedTask: Task | null = null;
  filteredTasks: Task[] = [];
  dropdownOpenId: any | null = null; // track open dropdown

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tasks$ = this.taskService.tasks$;
  }

  editTask(id: string) {
    this.router.navigate(['/edit', id]);
  }

  toggleCompletion(task: Task) {
    this.taskService.updateTask(task.id, {
      ...task,
      status: task.status === 'Completed' ? 'Not Started' : 'Completed'
    });
  }

  /** SHOW DELETE POPUP */
  openDeleteModal(task: Task) {
    this.selectedTask = task;
    this.showDeleteModal = true;
  }

  /** CLOSE POPUP */
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedTask = null;
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
    window.location.reload();

  }

  openNewTask(){
    this.router.navigate(['tasks/new']);

  }

  toggleDropdown(id: any): void {
    this.dropdownOpenId = this.dropdownOpenId === id ? null : id;
  }
}
