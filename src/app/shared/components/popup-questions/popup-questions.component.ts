import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Questions } from "../../interfaces/interfaces";

@Component({
  standalone: true,
  selector: 'app-popup-questions',
  imports: [CommonModule],
  templateUrl: './popup-questions.component.html',
  styleUrls: ['../../styles/table.scss']
})
export class PopupQuestionsComponent implements OnInit {

  questions: Questions[] = this.data.questions

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupQuestionsComponent>
  ) {}

  ngOnInit(): void {

    console.log(this.questions)

  }

  close(element: any) {
    this.dialogRef.close(element);
  }
}
