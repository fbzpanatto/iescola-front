import { Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { SystemDialogMessagesComponent } from "./system-dialog-messages.component";

@Injectable({
  providedIn: 'root'
})
export class SystemDialogMessagesServiceService {

  constructor(
    public dialog: MatDialog,
  ) { }

  openPopup(options: { title: string, message: string}) {

    const { title, message } = options

    return this.dialog.open(SystemDialogMessagesComponent, {
      width: '50%',
      maxWidth: '560px',
      minWidth: '360px',
      autoFocus: false,
      disableClose: true,
      data: { title, message },
    })
  }
}
