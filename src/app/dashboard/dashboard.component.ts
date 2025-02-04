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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

  @Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
  })

  export class DashboardComponent  {
//api/Task/GetTaskCountByUsername
username=localStorage.getItem('user');
newTask: number = 0;
pendingTask: number = 0;
completedTask: number = 0; // Default page size
totalTask: number = 0;
status : number = 10;
userRole: string = '';

    dashboardCounts: { taskStatus: string; title: string; count: number }[] = [];
  
    constructor(
    private router:Router,
     public authService:AuthService,
     private httpClient:HttpClient
    ) {}
  
    ngOnInit() {
      
      this.updateCounts();
      this.userRole = this.authService.UserInfo.RoleName;
    }
    
      
    updateCounts() {
      const hd=new HttpHeaders({
        Token: this.authService.UserInfo.Token
      });

      this.httpClient.get<any>(this.authService.baseURL+'/api/Task/GetTaskCountByUsername?username='+this.username,{headers:hd})
      .subscribe({
        next: (response) => {
            if (response) {
              console.log(response)
                this.newTask = response.newTask ;              
                this.pendingTask = response.pendingTask;
                this.completedTask = response.completeTask;
                console.log('User Role:', this.userRole); 
                if (this.userRole === 'Member') {
                  this.totalTask = this.pendingTask + this.completedTask;
                } else {
                  this.totalTask = response.totalTask;
                }
                console.log('Total Task:', this.totalTask);
                this.dashboard();
            }
        },
        error: (error) => {
            console.error('Error fetching task counts:', error);
        }
    });
    
    }

    dashboard(){
      
      if(this.userRole == 'Admin'){
        this.dashboardCounts = [
          { taskStatus : 'new',  title: 'New Task', count: this.newTask },
          { taskStatus : 'pending',  title: 'Pending Task', count: this.pendingTask },
          { taskStatus : 'complete',  title: 'Complete Task', count: this.completedTask },
          { taskStatus : 'all',  title: 'Total Task', count: this.totalTask }
        ];
      }else{
        this.dashboardCounts = [
          { taskStatus : 'pending',  title: 'Pending Task', count: this.pendingTask },
          { taskStatus : 'complete',  title: 'Complete Task', count: this.completedTask },
          { taskStatus : 'all',  title: 'Total Task', count: this.totalTask }
        ];
      }

    }
    getTaskByStatus(taskStatus:string){
      debugger
        if(taskStatus==='new'){
           this.status = 0;
        }
        else if(taskStatus==='pending'){
          this.status=1;
        }
      else if(taskStatus==='complete'){
        this.status=2;
      }
      else
      {
        
        this.status=3;
      }
        this.router.navigate(['/task', this.username], {
          queryParams: { status: this.status},
        });
    }
  }
  