import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AvatarComponent } from '../avatar/avatar.component';
import { FormsModule, NgForm } from '@angular/forms';
import { StartComponent } from '../start.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, AvatarComponent, FormsModule, StartComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  hide: any;
  mailTest = false
  accountCreated = false;

  onSubmit(ngForm: NgForm) {
    if (ngForm.submitted && ngForm.form.valid && !this.mailTest) {
      this.accountCreated = true;
    }
  }

}
