// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-memberinvitation',
//   standalone: true,
//   imports: [],
//   templateUrl: './memberinvitation.component.html',
//   styleUrl: './memberinvitation.component.css'
// })
// export class MemberinvitationComponent {

// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IndividualConfig } from 'ngx-toastr';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonService, toastPayload } from 'src/app/services/common.service';

@Component({
  selector: 'app-member-invitation',
  templateUrl: './memberinvitation.component.html',
  styleUrls: ['./memberinvitation.component.css'],
})
export class MemberInvitationComponent implements OnInit {
  invitationForm!: FormGroup; // Reactive form group
  isList: boolean = true;
  listInvitations: any = [];
  toast!: toastPayload;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    public authService: AuthService,
    private cs: CommonService
  ) {}

  ngOnInit(): void {
    this.initForm(); // Initialize the form
    this.getInvitations(); // Fetch invitations
  }

  // Initialize the form
  initForm(): void {
    this.invitationForm = this.fb.group({
      taskId: [0, [Validators.required, Validators.min(1)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Fetch all invitations
  getInvitations(): void {
    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });

    this.httpClient
      .get(this.authService.baseURL + '/api/MemberInvitation', {
        headers: oHttpHeaders,
      })
      .subscribe((res) => {
        if (res) {
          this.listInvitations = res;
        } else {
          this.showMessage('warning', 'Session expired, please login.');
        }
      });
  }

  // Submit form data
  onSubmit(): void {
    if (this.invitationForm.invalid) {
      this.showMessage('warning', 'Please fill all required fields correctly.');
      return;
    }

    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });

    this.httpClient
      .post(this.authService.baseURL + '/api/MemberInvitation', this.invitationForm.value, {
        headers: oHttpHeaders,
      })
      .subscribe(() => {
        this.isList = true;
        this.getInvitations();
        this.showMessage('success', 'Invitation sent successfully.');
        this.resetForm();
      });
  }

  // Reset the form
  resetForm(): void {
    this.invitationForm.reset({ taskId: 0, email: '' });
  }

  // Remove an invitation
  remove(invitation: { taskId: number; email: string }): void {
    const oHttpHeaders = new HttpHeaders({
      Token: this.authService.UserInfo.Token,
    });

    this.httpClient
      .delete(`${this.authService.baseURL}/api/MemberInvitation/${invitation.taskId}`, {
        headers: oHttpHeaders,
      })
      .subscribe(() => {
        this.getInvitations();
        this.showMessage('success', 'Invitation removed successfully.');
      });
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

