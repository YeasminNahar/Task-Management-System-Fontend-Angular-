//import { Component } from '@angular/core';
// import { Component, OnInit } from '@angular/core';
// import { ChartDataSets, ChartOptions } from 'chart.js';
// import { Color, Label } from 'ng2-charts';

// @Component({
//   selector: 'app-dnpm install chart.jsashboard',
//   templateUrl: './dashboard.component.html',
//   styleUrls: ['./dashboard.component.css']
// })
// export class DashboardComponent {
//   constructor() { 
    
//   }

//   ngOnInit() {
//   }

  // public lineChartData: ChartDataset[] = [
  //   { data: [61, 59, 80, 65, 45, 55, 40, 56, 76, 65, 77, 60], label: 'Apple' },
  //   { data: [57, 50, 75, 87, 43, 46, 37, 48, 67, 56, 70, 50], label: 'Mi' },
  // ];
  
  // public lineChartLabels: LabelItem[] = {'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'};
    
  // public lineChartOptions = {
  //   responsive: true,
  // };
     
  // public lineChartLegend = true;
  // public lineChartType = 'line';
  // public lineChartPlugins = [];
// }
import { Component, OnInit } from '@angular/core';

  @Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  export class DashboardComponent implements OnInit {
    dashboardCounts: { title: string; count: number }[] = [];
  
    constructor() {}
  
    ngOnInit() {
      // Dynamic data (you can replace this with an API call)
      this.dashboardCounts = [
        { title: 'Pending Task', count: 5 },
        { title: 'Complete Task', count: 10 },
        { title: 'Total Task', count: 100 }
      ];
  
      // Simulate dynamic updates
      setInterval(() => {
        this.updateCounts();
      }, 5000); // Update counts every 5 seconds
    }
  
    updateCounts() {
      // Example of dynamic update logic
      this.dashboardCounts.forEach((item) => {
        item.count += Math.floor(Math.random() * 10); // Random increment
      });
    }
  }
  