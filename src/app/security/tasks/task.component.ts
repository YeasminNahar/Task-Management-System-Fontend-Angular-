import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent {
  isList: boolean = true;
  isNew: boolean = true;
  toast!: toastPayload;

  listTasks: any = [];
  listTaskCategories: any = [];

  Task: {
    taskID: number,
    description: string,
    deadLine: string,
    taskCategoryID: number,
    isActive: boolean,
    updateBy: any,
    createBy: any,
    createDate: any,
    updateDate: any,
  } = {
    taskID: 0,
    description: "",
    deadLine: "",
    taskCategoryID: 0,
    updateBy: '',
    createBy: '',
    createDate: '',
    updateDate: '',
    isActive: true
  };

  pageIndex: number = 0;
  pageSize: number = 10;
  rowCount: number = 0;
  listPageSize: any = [5, 10, 20];
  pager: { pages: number[], totalPages: number } = { // Explicitly typed as number[]
    pages: [],
    totalPages: 0
  };

  constructor(private cs: CommonService,
              private httpClient: HttpClient,
              public authService: AuthService) {
    this.get();
    this.getTaskCategories();
  }

  ngOnInit(): void {
    this.get();
    this.getTaskCategories();
  }

  // Fetch all tasks with pagination
  get(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    const params = {
      pageIndex: this.pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    this.httpClient.get(this.authService.baseURL + '/api/Task', { headers: oHttpHeaders, params: params })
      .subscribe((res: any) => {
        if (res) {
          this.listTasks = res.tasks;
          this.rowCount = res.totalCount;
          this.updatePager();
        } else {
          this.showMessage('warning', 'Session expired, please login.');
        }
      });
  }

  // Fetch Task Categories for the dropdown
  getTaskCategories(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.get(this.authService.baseURL + '/api/TaskCategory', { headers: oHttpHeaders })
      .subscribe((res) => {
        if (res) {
          this.listTaskCategories = res;
        } else {
          this.showMessage('warning', 'Failed to load task categories.');
        }
      });
  }

  // Populate form for editing
  edit(item: any): void {
    this.Task = {
      taskID: item.taskID,
      description: item.description,
      deadLine: item.deadLine,
      taskCategoryID: item.taskCategoryID,
      isActive: item.isActive,
      updateBy: item.updateBy,
      createBy: item.createBy,
      createDate: item.createDate,
      updateDate: item.updateDate,
    };
    this.isList = false;
  }

  // Reset the form
  reset() {
    this.Task = {
      taskID: 0,
      description: "",
      deadLine: "",
      taskCategoryID: 0,
      updateBy: '',
      createBy: '',
      createDate: '',
      updateDate: '',
      isActive: true
    };
  }

  // Add a new task
  add(): void {
    if (!this.validateForm()) {
      return;
    }

    const taskCategoryID = Number(this.Task.taskCategoryID);

    if (isNaN(taskCategoryID) || taskCategoryID <= 0) {
      this.showMessage('error', 'Please select a valid task category.');
      return;
    }

    const payload = {
      description: this.Task.description,
      deadLine: this.Task.deadLine,
      updateBy: this.authService.UserInfo?.UserName || 'SystemUser',
      createBy: this.authService.UserInfo?.UserName || 'SystemUser',
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      isActive: this.Task.isActive,
      taskCategoryID: taskCategoryID,
    };

    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token,
    });

    this.httpClient.post(this.authService.baseURL + '/api/Task', payload, { headers: oHttpHeaders })
      .subscribe({
        next: (res) => {
          this.isList = true;
          this.get();
          this.showMessage('success', 'Task added successfully.');
          this.reset();
        },
        error: (err) => {
          const errorMsg = err.error?.errors?.TaskCategory
            ? `Validation Error: ${err.error.errors.TaskCategory[0]}`
            : 'Failed to add task. Please check the form data.';
          this.showMessage('error', errorMsg);
        }
      });
  }

  // Validate the form before submitting
  validateForm(): boolean {
    let isValid = true;

    if (
      !this.Task.description.trim() ||
      !this.Task.deadLine.trim() ||
      isNaN(Number(this.Task.taskCategoryID)) || // Check if taskCategoryID is a number
      Number(this.Task.taskCategoryID) <= 0 ||  // Ensure taskCategoryID is positive
      this.Task.isActive === undefined || this.Task.isActive === null
    ) {
      isValid = false;
      this.showMessage('warning', 'All fields are required.');
    }

    return isValid;
  }

  // Update an existing task
  update(): void {
    if (!this.validateForm()) {
      return;
    }

    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.put(this.authService.baseURL + '/api/Task/' + this.Task.taskID, this.Task, { headers: oHttpHeaders })
      .subscribe((res) => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Task updated successfully.');
      });
  }

  // Confirm task deletion
  removeConfirm(task: { taskID: number, description: string }) {
    this.Task.taskID = task.taskID;
    this.Task.description = task.description;
  }

  // Remove a task
  remove(task: { taskID: number, description: string }) {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.delete(this.authService.baseURL + '/api/Task/' + task.taskID, { headers: oHttpHeaders })
      .subscribe((res) => {
        this.isList = true;
        this.reset();
        this.get();
        this.showMessage('success', 'Task removed successfully.');
      });
  }

  // Display messages using toastr
  showMessage(type: string, message: string) {
    this.toast = {
      message: message,
      title: type.toUpperCase(),
      type: type,
      ic: {
        timeOut: 2500,
        closeButton: true,
      } as IndividualConfig,
    };
    this.cs.showToast(this.toast);
  }

  // Update the pager object based on the total number of rows and page size
  updatePager() {
    const totalPages = Math.ceil(this.rowCount / this.pageSize);
    this.pager.totalPages = totalPages;
    this.pager.pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  // Change page number
  changePageNumber(pageIndex: number) {
    if (pageIndex >= 0 && pageIndex < this.pager.totalPages) {
      this.pageIndex = pageIndex;
      this.get();
    }
  }

  // Change page size
  changePageSize() {
    this.pageIndex = 0; // Reset to first page
    this.get();
  }

  // Search method that triggers on page size change
  search(): void {
    this.pageIndex = 0; // Reset to first page when page size changes
    this.get();
  }
}
