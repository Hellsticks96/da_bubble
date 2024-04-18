import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '../../firestore.service'; 
import { StartComponent } from '../start.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [StartComponent, MatButtonModule, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  oobCode: string;

  constructor(
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private router: Router
  ) {
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
    this.resetPasswordForm = new FormGroup({
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmNewPassword: new FormControl('', [Validators.required])
    }, { validators: this.passwordMatchValidator });
  }

  changePassword() {
    if (this.resetPasswordForm.invalid) {
      alert("Bitte überprüfen Sie Ihre Eingaben.");
      return;
    }
    const newPasswordControl = this.resetPasswordForm.get('newPassword');
    const newPassword = newPasswordControl ? newPasswordControl.value : null;

    this.firestoreService.confirmPasswordReset(this.oobCode, newPassword)
      .then(() => {
        alert("Passwort erfolgreich geändert.");
        this.router.navigate(['/login']);
      })
      .catch(error => {
        alert("Fehler beim Ändern des Passworts: " + error.message);
      });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmNewPassword = control.get('confirmNewPassword');
    return newPassword && confirmNewPassword && newPassword.value !== confirmNewPassword.value ? { mismatch: true } : null;
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
