import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';
import { IndividualConfig } from 'ngx-toastr';
@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
  // username = localStorage.getItem('user');
  listTaskAssign: any[] = [];
  calendarData: { [date: string]: any[] } = {};
  currentMonthIndex: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  selectedTasks: any[] = [];
  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  months = [
    { name: 'January', days: 31 },
    { name: 'February', days: 28 }, // Adjust for leap year if needed
    { name: 'March', days: 31 },
    { name: 'April', days: 30 },
    { name: 'May', days: 31 },
    { name: 'June', days: 30 },
    { name: 'July', days: 31 },
    { name: 'August', days: 31 },
    { name: 'September', days: 30 },
    { name: 'October', days: 31 },
    { name: 'November', days: 30 },
    { name: 'December', days: 31 },
  ];

  toast!: toastPayload;
  constructor(
    private httpClient: HttpClient,
    public authService: AuthService,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    this.getTaskAssignments();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Token': this.authService.UserInfo?.Token || ''
    });
  }

  getTaskAssignments(): void {
    this.httpClient.get(this.authService.baseURL + '/api/TaskAssign/GetTaskAssignsWithDetails', {
      headers: this.getHeaders()
    }).subscribe({
      next: (res: any) => {
        this.listTaskAssign = res || [];
        this.organizeTasksByDate();
      },
      error: () => this.showMessage('warning', 'Failed to fetch task assignments.')
    });
  }

  organizeTasksByDate(): void {
    this.calendarData = {};
    this.listTaskAssign.forEach(task => {
      let taskDate = new Date(task.deadLine).toISOString().split('T')[0];
      if (!this.calendarData[taskDate]) {
        this.calendarData[taskDate] = [];
      }
      this.calendarData[taskDate].push(task);
    });
  }

  generateCalendar(): (number | null)[][] {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    const weeks: (number | null)[][] = [];
    let week: (number | null)[] = new Array(firstDayOfMonth).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      weeks.push([...week, ...new Array(7 - week.length).fill(null)]);
    }

    return weeks;
  }

  isTaskAssigned(day: number): boolean {
    const dateKey = new Date(this.currentYear, this.currentMonthIndex, day).toISOString().split('T')[0];
    return this.calendarData.hasOwnProperty(dateKey);
  }
  isTaskDeadline(day: number): boolean {
    return this.listTaskAssign.some(
      task => {
        const taskDate = new Date(task.deadLine);
        return (
          taskDate.getDate() === day &&
          taskDate.getMonth() === this.currentMonthIndex &&
          taskDate.getFullYear() === this.currentYear
        );
      }
    );
  }
  
  showTaskDetails(day: number): void {
    const dateKey = new Date(this.currentYear, this.currentMonthIndex, day).toISOString().split('T')[0];
    this.selectedTasks = this.calendarData[dateKey] || [];
  }

  changeMonth(offset: number): void {
    this.currentMonthIndex += offset;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    } else if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
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
}
