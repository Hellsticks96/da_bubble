import { Component, EventEmitter, Output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { SignupComponent } from "../signup/signup.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NgForm, NgModel } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
    selector: "app-avatar",
    standalone: true,
    imports: [MatButtonModule, SignupComponent, MatButtonToggleModule],
    templateUrl: "./avatar.component.html",
    styleUrl: "./avatar.component.scss",
})
export class AvatarComponent {
    avatar = "";
    error = false;
    accountCreated = false;
    @Output() submitAvatar = new EventEmitter<string>();

    constructor(private router: Router) {}

    selectAvatar(number: string) {
        this.avatar = number;
    }

    submit() {
        if (this.avatar !== "") {
            this.accountCreated = true;
            setTimeout(() => {
                this.submitAvatar.emit(this.avatar);
            }, 1500);
        } else {
            this.error = true;
        }
    }
}
