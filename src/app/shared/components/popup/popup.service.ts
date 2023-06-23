import { Injectable } from '@angular/core';
import { PopupComponent } from "./popup.component";
import { MatDialog } from "@angular/material/dialog";
import { PopupOptions } from "../../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    public dialog: MatDialog,
  ) { }

  openPopup(options: PopupOptions) {

    const { url, headers, fetchedData, multipleSelection, alreadySelected } = options

    return this.dialog.open(PopupComponent, {
      width: '50%',
      maxWidth: '560px',
      minWidth: '360px',
      autoFocus: true,
      disableClose: true,
      data: { url, headers, fetchedData, multipleSelection, alreadySelected },
    })
  }
}
