import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  form!: FormGroup;
  isEdit: boolean = false;
  editId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      description: ['']
    });

    // Check if editing task
    this.editId = this.route.snapshot.paramMap.get('id');
    if (this.editId) {
      this.isEdit = true;
      const task = this.taskService.getTaskById(this.editId);
      if (task) {
        // Format date for input field (YYYY-MM-DD)
        const taskData = { ...task };
        if (task.dueDate) {
          // If date is in string format, convert it for the date input
          const date = new Date(task.dueDate);
          if (!isNaN(date.getTime())) {
            // Format as YYYY-MM-DD for date input
            taskData.dueDate = date.toISOString().split('T')[0];
          }
        }
        this.form.patchValue(taskData);
      } else {
        // Task not found, redirect to list
        this.router.navigate(['/']);
      }
    }
  }

  save() {
    if (this.form.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.form.controls).forEach(key => {
        this.form.get(key)?.markAsTouched();
      });
      return;
    }

    const formValue = this.form.value;
    const data: Task = {
      id: this.editId || Date.now().toString(),
      assignedTo: formValue.assignedTo,
      status: formValue.status,
      dueDate: formValue.dueDate,
      priority: formValue.priority,
      description: formValue.description || ''
    };

    if (this.isEdit) {
      this.taskService.updateTask(data.id, data);
    } else {
      this.taskService.addTask(data);
    }

    this.router.navigate(['/']);
  }

  close() {
    this.router.navigate(['/']);
  }
}
