import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { TaskCategoryComponent } from './security/category/taskcategory.component';
import { TaskComponent } from './security/tasks/task.component';
import { CompanyComponent } from './security/company/company.component';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
/*import { TestComponent } from '@angular/core/testing';*/

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch:'full' },
  //{ path: '**', redirectTo: '/login' },
  { path: 'category', component: TaskCategoryComponent, canActivate:[authGuard] },
  { path: 'task', component: TaskComponent, canActivate:[authGuard] },
  { path: 'company', component: CompanyComponent, canActivate:[authGuard] },
 
  { path: 'dashboard', component: DashboardComponent, canActivate:[authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
