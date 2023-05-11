import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import { FetchDataService } from "../../services/fetch-data.service";
import {GenericObjectArray, PopupOptions} from "../../interfaces/interfaces";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AutoFocusDirective} from "../../directives/auto-focus.directive";

@Component({
  standalone: true,
  selector: 'app-popup',
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, AutoFocusDirective, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['../../styles/popup.scss']
})
export class PopupComponent implements OnInit {

  userOptions: GenericObjectArray = []
  headOptions: GenericObjectArray = []
  multiple: boolean = this.data.multipleSelection ?? false
  searchInput = new FormControl('')
  title: string = this.data.title ?? 'Escolha uma opção'

  selectAll:boolean = true

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopupOptions,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fetchDataService: FetchDataService,
  ) {}

  ngOnInit(): void {

    this.headOptions = this.data.headers as GenericObjectArray

    if(this.data.fetchedData) {
      this.userOptions = this.data.fetchedData

      this.userOptions = this.data.fetchedData.map((element: any) => {
        element.selected = true
        return element
      })

      return
    }

    this.getAllData()
  }

  getAllData(){
    this.fetchDataService.all(this.data.url as string).subscribe((response: any) => {
      this.userOptions = response
    })
  }

  close(element: any) {
    this.dialogRef.close(element);
  }

  clearSearch() {
    this.searchInput.setValue('')
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.userOptions.forEach(item => item['selected'] = this.selectAll);
  }

  toggleItemSelection(item: any) {
    item.selected = !item.selected;
    this.selectAll = this.userOptions.every(item => item['selected']);
  }
}
