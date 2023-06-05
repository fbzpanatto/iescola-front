import { Injectable } from '@angular/core';
import { LoginComponent } from "../components/login/login.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
  providedIn: 'root'
})
export class LoginModalService {

  constructor( public dialog: MatDialog ) { }

  openLoginModal() {

    return this.dialog.open(LoginComponent, {
      width: '50%',
      maxWidth: '560px',
      minWidth: '360px',
      autoFocus: true,
      disableClose: true,
      data: {}
    })
  }
}
