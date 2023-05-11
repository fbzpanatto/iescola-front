import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { FetchDataService } from "../../services/fetch-data.service";
import { GenericObjectArray } from "../../interfaces/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {AutoFocusDirective} from "../../directives/auto-focus.directive";

@Component({
  standalone: true,
  selector: 'app-popup',
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, AutoFocusDirective],
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {

  userOptions: GenericObjectArray = []
  headOptions: GenericObjectArray = this.data.headers
  searchInput = new FormControl('')
  title: string = this.data.title ?? 'Escolha uma opção'

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

  clearSearch() {
    this.searchInput.setValue('')
  }
}
