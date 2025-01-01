import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberInvitationComponent } from './memberinvitation.component';

describe('MemberinvitationComponent', () => {
  let component: MemberInvitationComponent;
  let fixture: ComponentFixture<MemberInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberInvitationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MemberInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
