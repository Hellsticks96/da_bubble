import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './start/login/login.component';
import { SignupComponent } from './start/signup/signup.component';
import { RecoveryComponent } from './start/recovery/recovery.component';
import { ResetPasswordComponent } from './start/reset-password/reset-password.component';
import { PrivacyPolicyComponent } from './start/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './start/legal-notice/legal-notice.component';
import { ChatComponent } from './main/chat/chat.component';
import { ThreadComponent } from './main/thread/thread.component';

export const routes: Routes = [


  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recovery', component: RecoveryComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'legal-notice', component: LegalNoticeComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', redirectTo: 'chat', outlet: 'chatOutlet', pathMatch: 'full' },
      { path: 'chat', outlet: 'chatOutlet', component: ChatComponent },
      { path: 'thread', outlet: 'threadOutlet', component: ThreadComponent }
    ],
  },
];


// { path: '', component: MainComponent },
// { path: 'login', component: LoginComponent },
// { path: 'signup', component: SignupComponent },
// { path: 'recovery', component: RecoveryComponent },
// { path: 'reset-password', component: ResetPasswordComponent },
// { path: 'legal-notice', component: LegalNoticeComponent },
// { path: 'privacy-policy', component: PrivacyPolicyComponent },