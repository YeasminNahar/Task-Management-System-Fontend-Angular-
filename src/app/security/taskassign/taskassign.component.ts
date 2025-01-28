import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

@Component({
  selector: 'app-taskassign',
  templateUrl: './taskassign.component.html',
  styleUrls: ['./taskassign.component.css']
})
export class TaskassignComponent {
  isList: boolean = true; // Toggle between listing and form
  pageIndex: number = 0;
  pageSize: number = 10;
  rowCount: number = 0;
  listPageSize = [5, 10, 20];
  pager = { pages: [], totalPages: 0 };
  listTaskAssign: any[] = [];
  listTasks: any[] = [];
  listMembers: any[] = [];
  TaskAssign = {
    TaskAssignId: 0,
    TaskId: 0,
    MemberId: 0,
    isActive: true,
    updateBy: '',
    createBy: '',
    createDate: '',
    updateDate: ''
  };

  toast!: toastPayload;

  constructor(
    private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService
  ) {
    this.get();
    this.getTasks();
    this.getMembers();
  }
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || ''
    });
  }

  
  get(): void {
    const params = { pageIndex: this.pageIndex.toString(), pageSize: this.pageSize.toString() };
    this.httpClient.get(this.authService.baseURL + '/api/TaskAssign/GetTaskAssignsWithDetails', {
      headers: this.getHeaders(),
      params
    }).subscribe({
      next: (res: any) => {
        this.listTaskAssign = res || []; // Task Assign list
        this.listTasks = res || []; // Task Assign list
        this.rowCount = res.totalCount || 0;
  
        // Ensure listTasks and listMembers are updated
        // this.getTasks(); 
        // this.getMembers();
  
        console.log(this.listTaskAssign, 'Task Assign List');
        console.log(this.listTasks, 'Task  List');
        console.log('MemberList',this.listMembers)
        this.updatePager();
      },
      error: () => this.showMessage('warning', 'Failed to fetch task assignments. Please try again.')
    });
  }
  

  getTasks(): void {
    
    this.httpClient.get(this.authService.baseURL + '/api/Task/GetTask', { headers: this.getHeaders() }).subscribe({
      next: (res: any) => this.listTasks = res || [],
      error: () => this.showMessage('warning', 'Failed to fetch tasks.')
    });
  }

  getMembers(): void {
    this.httpClient.get(this.authService.baseURL + '/api/Member/GetMember', { headers: this.getHeaders() }).subscribe({
      next: (res: any) => this.listMembers = res || [],
      error: () => this.showMessage('warning', 'Failed to fetch members.')
    });
  }

  edit(item: any): void {
    console.log("Edit Item: ", item);
    this.TaskAssign = {
      TaskAssignId: item.taskAssignId || 0,
      TaskId: item.taskId || 0,
      MemberId: item.memberId || 0,
      isActive: item.isActive || false,
      updateBy: item.updateBy || '',
      createBy: item.createBy || '',
      createDate: item.createDate || '',
      updateDate: item.updateDate || ''
    };
    this.isList = false;
    console.log(this.TaskAssign);
  }

  reset() {
    this.TaskAssign = {
      TaskAssignId: 0,
      TaskId: 0,
      MemberId: 0,
      isActive: true,
      updateBy: '',
      createBy: '',
      createDate: '',
      updateDate: ''
    };
  }

  add(): void {
    if (!this.validateForm()) return;

    const payload = {
      isActive: this.TaskAssign.isActive,
      TaskId: this.TaskAssign.TaskId,
      TaskAssignId:this.TaskAssign.TaskAssignId,
      MemberId:this.TaskAssign.MemberId,
      createBy: this.authService.UserInfo?.UserName || 'SystemUser',
      updateBy: this.authService.UserInfo?.UserName || 'SystemUser',
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
      
    };

    this.httpClient.post(this.authService.baseURL + '/api/TaskAssign/PostTaskAssign', payload, {
      headers: this.getHeaders()
    }).subscribe({
      next: (res) => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Task assigned successfully.');
        this.reset();
      },
      error: () => this.showMessage('error', 'Failed to assign task.')
    });
    console.log(this.TaskAssign); 
  }

  update(): void {
    if (!this.validateForm()) {
      console.log('Validation failed. TaskAssign:', this.TaskAssign);
      return;
    }
  
    if (!this.TaskAssign?.TaskAssignId || this.TaskAssign.TaskAssignId <= 0) {
      console.error('Invalid TaskAssignId:', this.TaskAssign.TaskAssignId);
      this.showMessage('error', 'Invalid Task Assignment ID.');
      return;
    }
  
    console.log('TaskAssign to be updated:', JSON.stringify(this.TaskAssign));
    console.log('API Endpoint:', `${this.authService.baseURL}/api/TaskAssign/UpdateTaskAssign/${this.TaskAssign.TaskAssignId}`);
  
    this.httpClient.put(
      `${this.authService.baseURL}/api/TaskAssign/UpdateTaskAssign/${this.TaskAssign.TaskAssignId}`,
      this.TaskAssign,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res) => {
        console.log('Task assignment updated successfully:', res);
        this.isList = true;
        this.get();
        this.showMessage('success', 'Task assignment updated successfully.');
      },
      error: (err) => {
        console.error('Update failed:', err.error || err.message);
        this.showMessage('error', `Update failed: ${err.error?.message || 'Unknown error.'}`);
      },
    });
  }
  
  remove(taskAssignId: number): void {
    // Validate taskAssignId
    if (typeof taskAssignId !== 'number' || isNaN(taskAssignId) || taskAssignId <= 0) {
      console.error('Invalid TaskAssignId:', taskAssignId);
      this.showMessage('error', 'Invalid Task Assignment ID.');
      return;
    }
  
    // Confirm deletion
    const confirmDelete = confirm('Are you sure you want to delete this task assignment?');
    if (!confirmDelete) {
      this.showMessage('info', 'Task assignment deletion canceled.');
      return;
    }
  
    // Execute delete request
    this.httpClient.delete(`${this.authService.baseURL}/api/TaskAssign/DeleteTaskAssign/${taskAssignId}`, {
      headers: this.getHeaders(),
      responseType: 'text' // Specify responseType for proper error handling
    }).subscribe({
      next: (res:any) => {
        console.log('Delete response:', res);
        this.get();
        this.isList = true;
        this.reset(); // Refresh task assignments
        this.showMessage('success', 'Task assignment deleted successfully.');
        console.log(`Task assignment with ID ${taskAssignId} deleted successfully.`);
      },
      error: (err) => {
        // Log error details for debugging
        console.error('Failed to delete task assignment:', err);
        console.log('Error Details:', JSON.stringify(err, null, 2));
        // Show a user-friendly error message
        this.showMessage('error', `Failed to delete task assignment: ${err.error?.message || err.message || 'An unknown error occurred.'}`);
      }
    });
  }
  
  
  

  validateForm(): boolean {
    if (!this.TaskAssign.TaskId || !this.TaskAssign.MemberId) {
      this.showMessage('warning', 'Task and Member are required.');
      return false;
    }
    return true;
  }

  showMessage(type: string, message: string): void {
    this.toast = {
      message,
      title: type.toUpperCase(),
      type,
      ic: { timeOut: 2500, closeButton: true } as IndividualConfig
    };
    this.cs.showToast(this.toast);
  }

  updatePager(): void {
    const totalPages = Math.ceil(this.rowCount / this.pageSize);
    this.pager.totalPages = totalPages;
    // this.pager.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePageNumber(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.pager.totalPages) return;
    this.pageIndex = pageIndex;
    this.get();
  }

  changePageSize(): void {
    this.pageIndex = 0;
    this.get();
  }
}
