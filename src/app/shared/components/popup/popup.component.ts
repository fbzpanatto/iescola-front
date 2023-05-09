import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FetchDataService } from "../../services/fetch-data.service";
import { GenericObjectArray } from "../../interfaces/interfaces";

@Component({
  standalone: true,
  selector: 'app-popup',
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  userOptions: GenericObjectArray = []
  headOptions: GenericObjectArray = this.data.headers

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fetchDataService: FetchDataService,
  ) {}

  ngOnInit(): void {
    if(this.data.url) {
      this.getAllData()
    }
  }

  getAllData(){
    this.fetchDataService.all(this.data.url).subscribe((response: any) => {
      this.userOptions = response

    })
  }

  close(element: any) {
    this.dialogRef.close(element);
  }

}
