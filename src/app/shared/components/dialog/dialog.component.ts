import {Component, Inject, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './dialog.component.html',
  styleUrls: ['../../styles/popup.scss']
})
export class DialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogComponent>,
  ) {}

  ngOnInit(): void {
    console.log(this.data)
  }

  close(condition: boolean = false) {
    this.dialogRef.close(condition)
  }

  get message() {
    return this.data.message
  }

  get title() {
    return 'Remover questão'
  }

}
