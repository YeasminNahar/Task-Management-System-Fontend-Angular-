import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//import { CommonService, toastPayload } from './services/common.service';
//import { IndividualConfig } from 'ngx-toastr';

// import{jsPDF} from'jspdf';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username=localStorage.getItem('user');
  newTask: number = 0;
  pendingTask: number = 0;
  completedTask: number = 0; // Default page size
  totalTask: number = 0;
  status : number = 10;
  title = '';
  notificationsCount = 5;
  showNotificationList = false; // To toggle notification visibility
  notifications: string[] = []; // Empty list of notifications initially
  isList: boolean = true;
  userRole: string = '';
  colwidth : number = 10;
toggleNotificationList() {
  this.showNotificationList = !this.showNotificationList;
}



  // staticshowNotifications() {
  //   this.showNotificationList = !this.showNotificationList; // Toggle visibility
    
  // }
  // assignTaskNotification(taskName: string) {
  //   this.notifications.push(`A new task "${taskName}" has been assigned to you.`);
  //   this.notificationsCount = this.notifications.length; // Update the count
  // }
  // notificationsCount = 5; // Example: Replace with dynamic count
  // showNotifications() {
  //   console.log("Display notifications dropdown or modal");
  //   // Add logic to handle notification click
  //   alert('Notifications clicked!');
  // }
  //toast!: toastPayload;
  //isLogIn:boolean = false;
  //userName:string = '';
  /*userInfo:{
    UserName:string,
    isLoggedIn:boolean
  } ={
    UserName:'',
    isLoggedIn:false
  };*/
  dashboardCounts: { taskStatus: string; title: string; count: number }[] = [];
  
    constructor(
    private router:Router,
     public authService:AuthService,
     private httpClient:HttpClient
    ) {}
  
    ngOnInit() {
      
      this.userRole = this.authService.UserInfo.RoleName;
      if(this.userRole=='Admin'){
        this.colwidth = this.colwidth;
      }else{
        this.colwidth = 12;
      }
      this.updateCounts();
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
      
      this.dashboardCounts = [
        
        // { taskStatus : 'new',  title: 'New Task', count: this.newTask },
        { taskStatus : 'pending',  title: 'Pending Task', count: this.pendingTask },
        
      ];
      
    }
    showNotifications(taskStatus:string){
      
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
        this.showNotificationList = true;
    }
  
  

  logout(): void {
    this.authService.logout();
    //this.isLogIn = this.authService.isLoggedIn;
    //this.userInfo = this.authService.userInfo;
    //this.router.navigate([this.authService.UserInfo.RedirectURL]);
    this.router.navigate([this.authService.UserInfo.RedirectURL]).then(() => {
      window.location.reload(); // Reload page after navigation
    });
    
  }

  login():void{
    this.authService.logout();
   this.router.navigate([this.authService.UserInfo.RedirectURL]);
   this.router.navigate([this.authService.UserInfo.RedirectURL]).then(() => {
    window.location.reload(); // Reload page after navigation
  });
  }

  listModule:any=[
    {
    ModuleId:1,
    ModuleName:''
  }
  ];

  listMenu:any=[
    {
      MenuId:1,
      MenuName:'Home',
      ModuleId:1
    }
  ];
  
}
