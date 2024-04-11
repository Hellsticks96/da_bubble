import { Component, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { StartComponent } from '../start.component';
import { Location } from '@angular/common';
import { FirestoreService } from '../../firestore.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, AvatarComponent, FormsModule, StartComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  @Output() avatar = '';
  hide: any;
  accountCreated = false;
  accountData = {
    name: '',
    email: '',
    password: '',
    privacyPolicy: false
  }


  constructor(public location: Location, private firestore: FirestoreService) {

  }
  

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && this.accountCreated) {
      this.firestore.signUpWithEmailAndPassword(this.accountData.email, this.accountData.password);
    } else if (ngForm.submitted && ngForm.form.valid) {
      this.accountCreated = true;
    }
  }
}
