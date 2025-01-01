import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskCategoryComponent } from './security/category/taskcategory.component';
import { TaskDetailsComponent } from './security/task-details/task-details.component';
import { TaskComponent } from './security/tasks/task.component';
import { ReportsComponent } from './security/reports/reports.component';
import { CompanyComponent } from './security/company/company.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth/auth.guard';
import { MemberComponent } from './security/member-registration/member-registration.component';
import { FileAttachComponent } from './file-attach/file-attach.component';
import {TaskassignComponent} from './security/taskassign/taskassign.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MemberInvitationComponent } from './security/memberinvitation/memberinvitation.component';
/*import { TestComponent } from '@angular/core/testing';*/
import {CalendarViewComponent} from './security/calendar-view/calendar-view.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch:'full' },
  //{ path: '**', redirectTo: '/login' },
  { path: 'category', component: TaskCategoryComponent, canActivate:[authGuard] },
  { path: 'task', component: TaskComponent, canActivate:[authGuard] },
  { path: 'task-details', component: TaskDetailsComponent, canActivate:[authGuard] },
  { path: 'taskassign', component: TaskassignComponent, canActivate:[authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate:[authGuard] },
  { path: 'company', component: CompanyComponent, canActivate:[authGuard] },
  { path: 'member-registration', component: MemberComponent },
  { path: 'memberinvitation', component: MemberInvitationComponent },
  { path: 'file-attach', component: FileAttachComponent },
  { path: 'calendar-view', component: CalendarViewComponent },
  
  { path: 'dashboard', component: DashboardComponent, canActivate:[authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
