import { Component, Inject, ViewChild  } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogModule} from '@angular/material/dialog';
import {MatMenu, MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-edit-message',
  standalone: true,
  imports: [
    PickerComponent,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    MatDialogActions
  ],
  templateUrl: './dialog-edit-message.component.html',
  styleUrl: './dialog-edit-message.component.scss'
})
export class DialogEditMessageComponent {
  isPickerVisible: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){}

  togglePicker() {
    this.isPickerVisible = !this.isPickerVisible; 
  }

  addEmoji(event: any) {
    console.log(event.emoji);
  }
}
