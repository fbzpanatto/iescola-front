import { Injectable } from '@angular/core';
import { PopupComponent } from "../components/popup/popup.component";
import { MatDialog } from "@angular/material/dialog";
import { PopupOptions } from "../interfaces/interfaces";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    public dialog: MatDialog,
  ) { }

  openPopup(options: PopupOptions) {

    const { url, headers } = options

    return this.dialog.open(PopupComponent, {
      width: '400px',
      data: { url, headers },
    })
  }
}
