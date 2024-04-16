import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { UsersList } from '../interfaces/users-list';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-pofile-info-card',
  standalone: true,
  imports: [MatDialogActions,MatButtonModule,MatIconModule],
  templateUrl: './pofile-info-card.component.html',
  styleUrl: './pofile-info-card.component.scss'
})
export class PofileInfoCardComponent {

constructor(@Inject(MAT_DIALOG_DATA) public data: UsersList, public dialogRef: MatDialogRef<PofileInfoCardComponent>,){
  
}
  onNoClick(){
    this.dialogRef.close();
  }
}
