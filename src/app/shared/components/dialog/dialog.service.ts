import { inject, Injectable } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "./dialog.component";

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  public dialog = inject(MatDialog)

  openDialog(message: string) {
    return this.dialog.open(DialogComponent, {
      width: '50%',
      maxWidth: '560px',
      minWidth: '360px',
      autoFocus: true,
      disableClose: true,
      data: { message },
    })
  }
}
