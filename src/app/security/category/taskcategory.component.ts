import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

@Component({
  selector: 'app-taskcategory',
  templateUrl: './taskcategory.component.html',
  styleUrls: ['./taskcategory.component.css']
})
export class TaskCategoryComponent {
  isList: boolean = true;
  isNew: boolean = true;
  toast!: toastPayload;

  // Pagination variables
  pageIndex: number = 0;
  pageSize: number = 10; // Default page size
  rowCount: number = 0;
  listPageSize: any = [5, 10, 20];
  pageStart: number = 0;
  pageEnd: number = 0;
  totalRowsInList: number = 0;
  pagedItems: any = [];
  pager: {
    pages: any;
    totalPages: number;
  } = {
    pages: [],
    totalPages: 0,
  };

  constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService
  ) {
    this.get();
  }

  get(): void {
    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });
    this.httpClient
      .get(this.authService.baseURL + '/api/TaskCategory', { headers: oHttpHeaders })
      .subscribe((res) => {
        if (res) {
          this.listTaskCategory = res;
        } else {
          this.showMessage('warning', 'Session expired, please login.');
        }
      });
  }

  edit(item: any): void {
    this.TaskCategory = {
      taskCategoryId: item.taskCategoryId,
      name: item.name,
      updateBy:item.updateBy,
    createBy:item.createBy,
    createDate:item.createDate,
    updateDate:item.updateDate,
    isActive:item.isActive,

    };
    this.isList = false;
  }

  validateForm(): boolean {
    let isValid: boolean = true;
    if (
      this.TaskCategory.name === undefined ||
      this.TaskCategory.name === null ||
      this.TaskCategory.name === ''
    ) {
      isValid = false;
      this.showMessage('warning', 'Task Category name is required.');
    }
    return isValid;
  }

  reset(): void {
    this.TaskCategory = {
      taskCategoryId: 0,
      name: '',
      updateBy:'',
    createBy:'',
    createDate:'',
    updateDate:'',
    isActive:'',
    };
  }

  add(): void {
    if (!this.validateForm()) {
      this.showMessage('error', 'Task Category name is required.');
      return;
    }

    const payload = {
      name: this.TaskCategory.name,
      updateBy: this.authService.UserInfo.UserName || 'DefaultUser', // Set default or logged-in user
      createBy: this.authService.UserInfo.UserName || 'DefaultUser', // Set default or logged-in user
      createDate: new Date().toISOString(), // Automatically set the current date
      updateDate: new Date().toISOString(), // Automatically set the current date
      isActive: true, // Default value
    };

    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });

    this.httpClient
      .post(this.authService.baseURL + '/api/TaskCategory', payload, { headers: oHttpHeaders })
      .subscribe({
        next: () => {
          this.isList = true;
          this.get();
          this.showMessage('success', 'Data added.');
        },
        error: (error) => {
          console.error('Error response:', error);
          if (error.error?.errors) {
            console.error('Validation errors:', error.error.errors);
          }
          this.showMessage('error', 'Failed to add Task Category.');
        },
      });
  }

  update(): void {
    debugger
    if (!this.validateForm()) {
      return;
    }

    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });

    this.httpClient
      .put(
        `${this.authService.baseURL}/api/TaskCategory/${this.TaskCategory.taskCategoryId}`,
        this.TaskCategory,
        { headers: oHttpHeaders }
      )
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

  changePageSize(): void {
    this.pageIndex = 0; // Reset to the first page when the page size changes
    this.get(); // Fetch the data again based on the new page size
  }

  removeConfirm(taskCategory: { taskCategoryId: number; name: string }): void {
    this.TaskCategory.taskCategoryId = taskCategory.taskCategoryId;
    this.TaskCategory.name = taskCategory.name;
  }

  remove(taskCategory: { taskCategoryId: number; name: string }): void {
    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });
    this.httpClient
      .delete(this.authService.baseURL + '/api/TaskCategory/' + taskCategory.taskCategoryId, { headers: oHttpHeaders })
      .subscribe(() => {
        this.isList = true;
        this.reset();
        this.get();
        this.showMessage('success', 'Data deleted.');
      });
  }

  listTaskCategory: any = [];

  TaskCategory: {
    taskCategoryId: number;
    name: string;
    updateBy:string;
    createBy:string;
    createDate:any;
    updateDate:any;
    isActive:any;


    
  } = {
    taskCategoryId: 0,
    name: '',
    updateBy:'',
    createBy:'',
    createDate:'',
    updateDate:'',
    isActive:'',
  };

  showMessage(type: string, message: string): void {
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
}
