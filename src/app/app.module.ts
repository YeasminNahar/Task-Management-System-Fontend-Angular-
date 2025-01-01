import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
//import { NgChartsModule } from 'ng2-charts';
import { TaskComponent } from './security/tasks/task.component';
import { MemberInvitationComponent } from './security/memberinvitation/memberinvitation.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ReportsComponent } from './security/reports/reports.component';
import { TaskCategoryComponent } from './security/category/taskcategory.component';
import {TaskDetailsComponent} from './security/task-details/task-details.component';
import {CalendarViewComponent} from './security/calendar-view/calendar-view.component';
import {TaskassignComponent} from './security/taskassign/taskassign.component';
import { CompanyComponent } from './security/company/company.component';
import { MemberComponent } from './security/member-registration/member-registration.component';
import { FileAttachComponent } from './file-attach/file-attach.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    CompanyComponent,
    TaskCategoryComponent,
    TaskComponent,
    ReportsComponent,
    MemberComponent,
    FileAttachComponent,
    MemberInvitationComponent,
    LoginComponent,
    CalendarViewComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() //,
    //NgChartsModule
    ,
    CommonModule,
    TaskDetailsComponent,
    ReactiveFormsModule,
    TaskassignComponent

],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
