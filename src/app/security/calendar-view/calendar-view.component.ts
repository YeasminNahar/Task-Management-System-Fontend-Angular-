import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {
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

  daysOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  currentMonthIndex: number = new Date().getMonth(); // Default to the current month
  currentYear: number = new Date().getFullYear();
  tasks = [
    { date: new Date(2025, 0, 5), details: 'Complete design review ' },
    { date: new Date(2025, 1, 14), details: 'Valentine\'s Day event' },
    { date: new Date(2025, 5, 20), details: 'Team meeting' },
    { date: new Date(2025, 10, 25), details: 'Christmas Celebration' },
  ];

  selectedTask: string | null = null;

  ngOnInit(): void {
    // Adjust February for leap year if necessary
    if ((this.currentYear % 4 === 0 && this.currentYear % 100 !== 0) || this.currentYear % 400 === 0) {
      this.months[1].days = 29;
    }
  }

  generateCalendar(): (number | null)[][] {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1).getDay();
    const daysInMonth = this.months[this.currentMonthIndex].days;

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
    return this.tasks.some(
      task =>
        task.date.getDate() === day &&
        task.date.getMonth() === this.currentMonthIndex &&
        task.date.getFullYear() === this.currentYear
    );
  }

  showTaskDetails(day: number): void {
    const task = this.tasks.find(
      t => t.date.getDate() === day && t.date.getMonth() === this.currentMonthIndex
    );
    this.selectedTask = task ? task.details : null;
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
}
