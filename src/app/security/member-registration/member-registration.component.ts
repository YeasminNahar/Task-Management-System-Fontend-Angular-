import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

@Component({
  selector: 'app-member',
  templateUrl: './member-registration.component.html',  // Update if necessary
  styleUrls: ['./member-registration.component.css']   // Update if necessary
})
export class MemberComponent {
  isList: boolean = true;
  isNew: boolean = true;
  toast!: toastPayload;

  constructor(private cs: CommonService,
    private httpClient: HttpClient,
    public authService: AuthService) {
    this.get();
  }

  // Fetch all members
  get(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });
    this.httpClient.get(this.authService.baseURL + '/api/Member', { headers: oHttpHeaders }).subscribe((res) => {
      if (res) {
        this.listMembers = res;
      } else {
        this.showMessage('warning', 'Session expired, please login.');
      }
    });
  }

  // Submit form logic
  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    if (this.isNew) {
      this.add();
    } else {
      this.update();
    }
  }

  // Validate the form
  validateForm(): boolean {
    let isValid: boolean = true;
    if (!this.Member.MemberName || !this.Member.Email || !this.Member.Password) {
      isValid = false;
      this.showMessage('warning', 'All fields are required.');
    }
    return isValid;
  }

  // Add a new member
  add(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.post(this.authService.baseURL + '/api/Member/CreateMember', this.Member, { headers: oHttpHeaders }).subscribe((res) => {
      this.isList = true;
      this.get();
      this.showMessage('success', 'Member added successfully.');
    });
  }

  // Update an existing member
  update(): void {
    const oHttpHeaders = new HttpHeaders({
      'Token': this.authService.UserInfo.Token
    });

    this.httpClient.put(this.authService.baseURL + '/api/Member/' + this.Member.MemberId, this.Member, { headers: oHttpHeaders }).subscribe((res) => {
      this.isList = true;
      this.get();
      this.showMessage('success', 'Member updated successfully.');
    });
  }

  // Handle file input for picture
  // onFileChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // You can implement file validation or upload logic here
  //     this.Member.picture = file;
  //   }
  // }

  listMembers: any = [];

  // Member object with Password and Picture added
  Member: {
    MemberId: number,
    MemberName: string,
    Email: string,
    Password: string,   // Added password property
    // Added picture property (File type)
    isActive: boolean
  } = {
    MemberId: 0,
    MemberName: "",
    Email: "",
    Password: "",   // Initialize password property
       // Initialize picture property
    isActive: true
  };

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
