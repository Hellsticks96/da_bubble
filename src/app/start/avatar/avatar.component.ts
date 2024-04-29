import { Component, EventEmitter, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { SignupComponent } from '../signup/signup.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { NgForm, NgModel } from '@angular/forms';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [ MatButtonModule, SignupComponent, MatButtonToggleModule ],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent {
  avatar = '';
  error = false;
  @Output() submitAvatar = new EventEmitter<string>();

  selectAvatar(number: string) {
    this.avatar = number;
  }

  submit() {
    if(this.avatar !== '') {
      console.log(this.avatar)
      this.submitAvatar.emit(this.avatar)
    } else {
      this.error = true;
    }
  }
}
