import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
//import { CommonService, toastPayload } from './services/common.service';
//import { IndividualConfig } from 'ngx-toastr';

// import{jsPDF} from'jspdf';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = '';
  notificationsCount = 5; // Initially, no notifications
  showNotificationList = false; // To toggle notification visibility
  notifications: string[] = []; // Empty list of notifications initially
  isList: boolean = true;
  userRole: string = '';
  pendingTask: number = 0;
  status : number = 10;
  showNotifications() {
    this.showNotificationList = !this.showNotificationList; // Toggle visibility
    
  }

  // Call this method when a task is assigned to add a notification
  assignTaskNotification(taskName: string) {
    this.notifications.push(`A new task "${taskName}" has been assigned to you.`);
    this.notificationsCount = this.notifications.length; // Update the count
  }
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
  constructor(public authService: AuthService, 
    private router: Router
    //,private cs:CommonService
    ) {
    //this.userInfo = this.authService.userInfo;
  }

  logout(): void {
    this.authService.logout();
    //this.isLogIn = this.authService.isLoggedIn;
    //this.userInfo = this.authService.userInfo;
    this.router.navigate([this.authService.UserInfo.RedirectURL]);
  }

  login():void{
    this.authService.logout();
    this.router.navigate([this.authService.UserInfo.RedirectURL]);
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
