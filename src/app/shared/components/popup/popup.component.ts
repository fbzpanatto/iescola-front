import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FetchDataService } from "../../services/fetch-data.service";

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['../../styles/table.scss']
})
export class PopupComponent implements OnInit {

  arrayOptions: any[] = []
  headers: any[] = this.data.headers
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fetchDataService: FetchDataService,
  ) {}

  ngOnInit(): void {
    this.getAllData()
  }

  getAllData(){
    this.fetchDataService.getAllData(this.data.url).subscribe((response: any) => {
      this.arrayOptions = response

    })
  }

  close(element: any) {
    this.dialogRef.close(element);
  }

}
