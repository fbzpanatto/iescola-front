import { Injectable } from '@angular/core';
import { PopupOptionsComponent } from "../components/popup-options/popup-options.component";
import { MatDialog } from "@angular/material/dialog";
import { PopupOptions, Questions } from "../interfaces/interfaces";
import {PopupQuestionsComponent} from "../components/popup-questions/popup-questions.component";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    public dialog: MatDialog,
  ) { }

  openOptionsPopup(options: PopupOptions) {

    const { url, headers } = options

    return this.dialog.open(PopupOptionsComponent, {
      width: '400px',
      data: { url, headers },
    })
  }

  openQuestionsPopup(questions: Questions[]) {

    return this.dialog.open(PopupQuestionsComponent, {
      width: '400px',
      data: { questions },
    })
  }
}
