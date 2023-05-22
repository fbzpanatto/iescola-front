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

  localSelected: GenericObjectArray = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopupOptions,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fetchDataService: FetchDataService,
  ) {}

  ngOnInit(): void {

    this.headOptions = this.data.headers as GenericObjectArray

    this.searchInput.valueChanges.subscribe((value: string | null) => {
      if(value === null) {return}

      this.userOptions = this.data.fetchedData?.filter((item: any) => {
        return item.name.toLowerCase().includes(value.toLowerCase())
      }) ?? []

      this.selectAll = this.userOptions.every(item => item['selected']);
    })

    if(this.data.fetchedData) {

      this.userOptions = this.data.fetchedData

      if(this.data.alreadySelected != null) {
        for(let id of this.data.alreadySelected) {
          const index = this.userOptions.findIndex((item: any) => item.id === id)

          if(index !== -1) {
            this.userOptions[index]['selected'] = true
            this.localSelected.push(this.userOptions[index])
          }
        }
      }

      this.selectAll = this.userOptions.every(item => item['selected']);

      return
    }

    this.getAllData()
  }

  getAllData(){
    this.fetchDataService.all(this.data.url as string).subscribe((response: any) => {
      this.userOptions = response
    })
  }

  close(element?: any, filter: boolean = false) {
    if(filter) {

      this.dialogRef.close(this.localSelected)
      return
    }
    this.dialogRef.close(element);
  }

  clearSearch() {
    this.searchInput.setValue('')
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll;
    this.userOptions.forEach(item => item['selected'] = this.selectAll);

    if(this.selectAll && this.searchInput.value === '') {
      this.localSelected = this.data.fetchedData?.map((item: any) => {
        item['selected'] = true;
        return item
      }) ?? []
    } else if(this.selectAll && this.searchInput.value !== '') {
      for( let option of this.userOptions ) {
        const index = this.localSelected.findIndex((item: any) => item.id === option['id'])

        if(index === -1) {
          this.localSelected.push(option)
        }
      }
    } else if (!this.selectAll && this.searchInput.value !== '') {
      for( let option of this.userOptions ) {
        const index = this.localSelected.findIndex((item: any) => item.id === option['id'])

        if(index !== -1) {
          this.localSelected.splice(index, 1)
        }
      }
    } else if (!this.selectAll && this.searchInput.value !== '' && this.userOptions.length > 0) {
      this.selectAll = true
    } else {
      this.localSelected = []
    }
  }

  toggleItemSelection(item: any) {

    item.selected = !item.selected;
    const index= this.localSelected.indexOf(item);

    if(item.selected && index === -1) {
      this.localSelected.push(item);
    } else if (!item.selected && index !== -1) {
      this.localSelected.splice(index, 1);
    }

    this.selectAll = this.userOptions.every(item => item['selected']);
  }
}
