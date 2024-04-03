import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-channel-info',
  standalone: true,
  imports: [ MatButtonModule ],
  templateUrl: './dialog-channel-info.component.html',
  styleUrl: './dialog-channel-info.component.scss'
})
export class DialogChannelInfoComponent {
  constructor(public dialogRef: MatDialogRef<DialogChannelInfoComponent>) {

  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
