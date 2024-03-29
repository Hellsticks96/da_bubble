import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './start/login/login.component';
import { SignupComponent } from './start/signup/signup.component';
import { RecoveryComponent } from './start/recovery/recovery.component';
import { ResetPasswordComponent } from './start/reset-password/reset-password.component';

export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'login', component: LoginComponent },
    { path: 'singup', component: SignupComponent },
    { path: 'recovery', component: RecoveryComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
];
