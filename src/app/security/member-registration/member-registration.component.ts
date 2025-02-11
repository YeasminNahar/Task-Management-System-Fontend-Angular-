import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

@Component({
  selector: 'app-member',
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.css']
})
export class MemberComponent {
  isList: boolean = true;
  isNew: boolean = true;
  toast!: toastPayload;
  listMembers: any = [];

  Member: any = {
    MemberId: 0,
    MemberName: "",
    Email: "",
    Password: "",
    isActive: true
  };

  constructor(private cs: CommonService, private httpClient: HttpClient, public authService: AuthService) {
    this.get();
  }

  get(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    const apiUrl = `${this.authService.baseURL}/api/Member/GetMember`; 
    console.log("Fetching Members from:", apiUrl);

    this.httpClient.get(apiUrl, { headers: oHttpHeaders }).subscribe(
      (res: any) => {
        this.listMembers = res;
      },
      (error) => {
        console.error("Error fetching members:", error);
        this.showMessage('error', 'Failed to fetch members.');
      }
    );
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    if (this.isNew) {
      this.add();
    } else {
      this.update();
    }
  }

  // 🔹 Validate form inputs
  validateForm(): boolean {
    if (!this.Member.MemberName || !this.Member.Email || !this.Member.Password) {
      this.showMessage('warning', 'All fields are required.');
      return false;
    }
    return true;
  }

  add(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    const apiUrl = `${this.authService.baseURL}/api/Member/CreateMember`;
    console.log("Adding Member to:", apiUrl, this.Member);

    this.httpClient.post(apiUrl, this.Member, { headers: oHttpHeaders }).subscribe(
      (res) => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Member added successfully.');
      },
      (error) => {
        console.error("Error adding member:", error);
        this.showMessage('error', 'Failed to add member.');
      }
    );
  }
  update(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    const apiUrl = `${this.authService.baseURL}/api/Member/UpdateMember/${this.Member.MemberId}`;
    console.log("Updating Member at:", apiUrl, this.Member);

    this.httpClient.put(apiUrl, this.Member, { headers: oHttpHeaders }).subscribe(
      (res) => {
        this.isList = true;
        this.get();
        this.showMessage('success', 'Member updated successfully.');
      },
      (error) => {
        console.error("Error updating member:", error);
        this.showMessage('error', 'Failed to update member.');
      }
    );
  }
  showMessage(type: string, message: string) {
    this.toast = {
      message: message,
      title: type.toUpperCase(),
      type: type,
      ic: {
        timeOut: 2500,
        closeButton: true,
      } as IndividualConfig,
    };
    this.cs.showToast(this.toast);
  }
}
