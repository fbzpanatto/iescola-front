import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import { MatIconModule} from "@angular/material/icon";

@Component({
  standalone: true,
  selector: 'app-system-dialog-messages',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './system-dialog-messages.component.html',
  styleUrls: ['./system-dialog-messages.component.scss', '../../styles/popup.scss']
})
export class SystemDialogMessagesComponent {

  title?: string
  message?: string

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SystemDialogMessagesComponent>,
  ) {
    this.title = this.data.title
    this.message = this.data.message
  }

  close() {
    this.dialogRef.close()
  }
}
