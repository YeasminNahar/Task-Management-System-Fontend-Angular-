import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
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

  username=localStorage.getItem('user');
  // Flags to toggle between list and new task views
  isList: boolean = true;
  isNew: boolean = true;
  toast!: toastPayload;
  status:any=0;
  userRole: string = '';
  adminRoleId: string = '3F8FFDB7-3EFB-4FDF-9504-8452548F2EE7'; // Admin Role GUID
  userRoleId: string = 'USER_ROLE_GUID'; // Add your User Role GUID here if needed
  // Pagination properties
  pageIndex: number = 0;
  pageSize: number = 10;
  rowCount: number = 0;
  listPageSize: any = [5, 10, 20];
  pager: { pages: number[], totalPages: number } = { pages: [], totalPages: 0 };

  // Task data properties
  listTasks: any = [];
  listTaskCategories: any = [];
  Task: {
    TaskId: number,
    description: string,
    deadLine: string,
    taskCategoryID: number,
    isActive: boolean,
    updateBy: any,
    createBy: any,
    createDate: any,
    updateDate: any,
  } = {
      TaskId: 0,
      description: "",
      deadLine: "",
      taskCategoryID: 0,
      updateBy: '',
      createBy: '',
      createDate: '',
      updateDate: '',
      isActive: true
    };

    ngOnInit(): void {
      this.userRole = this.authService.UserInfo.RoleName;

    }
      
    
  // Constructor with necessary service injections
  constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService,
    private activeRoute: ActivatedRoute,
  ) {

    this.activeRoute.params.subscribe(params => {
      this.username = params['username'];
    });

    this.activeRoute.queryParams.subscribe(queryParams => {
      this.status = queryParams['status'];
     });

     this.get();
     this.getTaskCategories();
  }




  // Fetch all tasks with pagination
  get(): void {
    // debugger
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    const params = {
      pageIndex: this.pageIndex.toString(),
      pageSize: this.pageSize.toString()
    };

    // this.httpClient.get(this.authService.baseURL + '/api/Task', { headers: oHttpHeaders, params: params })
    this.httpClient.get(this.authService.baseURL + '/api/Task/GetTask?username='+this.username + '&status=' + this.status, { headers: oHttpHeaders })
    .subscribe((res: any) => {
      console.log('API Response:', res); // Check if taskId is present and correctly formatted
      if (res) {
        this.listTasks = res;
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

  // Edit task for updating
  edit(item: any): void {
    console.log("Edit Item: ", item); // Log the item for debugging

    this.Task = {
      TaskId: item.taskId, // Map taskId (API response) to TaskId
      description: item.description,
      deadLine: item.deadLine ? item.deadLine.split('T')[0] : '', // Ensure "yyyy-MM-dd" format
      taskCategoryID: item.taskCategoryId, // Use taskCategoryId from the response
      isActive: item.isActive,
      updateBy: item.updateBy,
      createBy: item.createBy,
      createDate: item.createDate,
      updateDate: item.updateDate,
      
    };
    this.isList = false;

    console.log(this.Task); // Log the updated Task object for debugging
  }


  // Reset the form
  reset() {
    this.Task = {
      TaskId: 0,
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

    this.httpClient.post(this.authService.baseURL + '/api/Task/PostTask', payload, { headers: oHttpHeaders })
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

  // Validate form before submitting
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
      console.log(this.Task)
      console.log('Task in update:', this.Task);
      return;
    }

    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });
    alert(this.Task.TaskId)

    this.httpClient.put(this.authService.baseURL + '/api/Task/PutTask/' + this.Task.TaskId, this.Task, { headers: oHttpHeaders })
      .subscribe({
        next: () => {
          this.isList = true;
          this.get();
          this.showMessage('success', 'Data updated successfully.');
        },
        error: (err) => {
          console.error('Update failed:', err.error || err.message);
          this.showMessage('error', `Update failed: ${err.error?.message || 'Unknown error.'}`);
        },
      });

  }




  // Confirm task deletion
  removeConfirm(task: { taskId: number, description: string }): void {
    this.Task.TaskId = task.taskId;
    this.Task.description = task.description;
    this.Task.deadLine = 'delete';
  }

  // Remove a task
  
  remove(task: { TaskId: number, description: string }): void {
    if (!task.TaskId) {
      console.error('TaskId is undefined!');
      return;
    }
  
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });
  
    this.httpClient.delete(`${this.authService.baseURL}/api/Task/DeleteTask/${task.TaskId}`, {
      headers: oHttpHeaders,
      responseType: 'text'
    }).subscribe({
      next: (res: any) => {
        console.log('Delete response:', res);
        this.isList = true;
        this.reset();
        this.get();
        this.showMessage('success', res || 'Task removed successfully.');
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
        console.log('Error Details:', JSON.stringify(err, null, 2));
        this.showMessage('error', `Failed to remove task: ${err.error?.message || err.message || 'Unknown error.'}`);
      }
    });
  }
  
   // Confirm task deletion
   completeConfirm(task: { taskId: number, description: string }): void {
    this.Task.TaskId = task.taskId;
    this.Task.description = task.description;
    this.Task.deadLine = 'complete';

  }

  // Remove a task
  
  complete(task: { TaskId: number, description: string }): void {
    if (!task.TaskId) {
      console.error('TaskId is undefined!');
      return;
    }
  
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });
  
    this.httpClient.get(`${this.authService.baseURL}/api/Task/CompleteTask?id=` + task.TaskId, {
      headers: oHttpHeaders,
      responseType: 'text'
    }).subscribe({
      next: (res: any) => {
        console.log('Complete response:', res);
        this.isList = true;
        this.reset();
        this.get();
        this.showMessage('success', res || 'Task complete successfully.');
      },
      error: (err) => {
        console.error('Failed to delete task:', err);
        console.log('Error Details:', JSON.stringify(err, null, 2));
        this.showMessage('error', `Failed to complete task: ${err.error?.message || err.message || 'Unknown error.'}`);
      }
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

  // Update pager based on row count and page size
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
