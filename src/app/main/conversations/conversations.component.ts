import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { CommonModule } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { DialogAddChannelComponent } from '../../dialog-add-channel/dialog-add-channel.component';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatButtonToggleModule,
    CommonModule,
    MatDialogModule,
    DialogAddChannelComponent,
  ],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.scss',
})
export class ConversationsComponent {
  contacts = [
    {
      avatar: '6',
      name: 'Frederick Beck (Du)',
      online: true,
    },
    {
      avatar: '5',
      name: 'Sofia Müller',
      online: true,
    },
    {
      avatar: '4',
      name: 'Noah Braun',
      online: true,
    },
    {
      avatar: '1',
      name: 'Elise Roth',
      online: false,
    },
    {
      avatar: '2',
      name: 'Elias Neumann',
      online: true,
    },

    {
      avatar: '3',
      name: 'Steffen Hoffmann',
      online: true,
    },
  ];

  constructor(public dialog: MatDialog) {}
  
  openDialog() {
    this.dialog.open(DialogAddChannelComponent, {
      panelClass: 'custom-dialog'
    });
  }
}
