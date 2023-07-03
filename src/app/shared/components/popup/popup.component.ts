import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FetchDataService } from "../../services/fetch-data.service";
import { ObjectLiteral, ObjectLiteralArray, PopupOptions } from "../../interfaces/interfaces";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutoFocusDirective } from "../../directives/auto-focus.directive";

@Component({
  standalone: true,
  selector: 'app-popup',
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, AutoFocusDirective, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['../../styles/popup.scss']
})
export class PopupComponent implements OnInit {

  userOptions: ObjectLiteralArray = []
  private originalData: any;
  headOptions: ObjectLiteralArray = []
  multiple: boolean = this.data.multipleSelection ?? false
  searchInput = new FormControl('')
  title: string = this.data.title ?? 'Escolha uma opção'

  selectAll:boolean = false

  localSelected: number[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopupOptions,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fetchDataService: FetchDataService,
  ) {}

  ngOnInit() {

    this.headOptions = this.data.headers as ObjectLiteralArray
    this.localSelected = []

    this.searchInput.valueChanges.subscribe((value: string | null) => {

      if(value === null) { return }

      if(this.data.fetchedData) {
        this.userOptions = this.data.fetchedData?.filter((item: any) => {
          return item.name?.toLowerCase().includes(value.toLowerCase()) ||
            item.school?.toLowerCase().includes(value.toLowerCase())
        }) ?? []
      }

      if(this.data.multipleSelection) {
        this.selectAll = this.userOptions.every(item => item['selected']);
      }
    })

    if(this.data.fetchedData) {
      this.originalData = [...this.data.fetchedData]
      this.userOptions = [...this.data.fetchedData]
    }

    if(this.data.alreadySelected) {
      this.localSelected = [...this.data.alreadySelected] as number[]

      this.userOptions.forEach(item => {
        item['selected'] = this.localSelected.includes(item['id']);
      })

      if(this.data.multipleSelection) {
        this.selectAll = this.userOptions.every(item => item['selected']);

        this.userOptions.sort((a, b) => {
          if(a['selected'] && !b['selected']) { return -1 }
          else if(!a['selected'] && b['selected']) { return 1 }
          else { return 0 }
        })
      }
    }
  }

  toggleSelectAll() {
    this.selectAll = !this.selectAll

    this.userOptions.forEach(item => {
      item['selected'] = this.selectAll;
    })

    if(this.selectAll) {
      this.localSelected = this.userOptions.map(item => item['id'])
    } else {
      this.localSelected = []
    }
  }

  toggleItemSelection(element: { [key: string]: any }) {
    const index = this.userOptions.findIndex(item => item['id'] === element['id'])
    this.userOptions[index]['selected'] = !this.userOptions[index]['selected']

    if(this.userOptions[index]['selected']) {
      this.localSelected.push(element['id'])
    } else {
      this.localSelected.splice(this.localSelected.indexOf(element['id']), 1)
    }

    if(this.data.multipleSelection) {
      this.selectAll = this.userOptions.every(item => item['selected']);
    }
  }

  close(element?: ObjectLiteral) {

    if (element) {
      this.dialogRef.close(element)
      return
    }

    let result = this.userOptions.filter(item => item['selected'])

    this.dialogRef.close(result)
  }

  clearSearch() {
    this.searchInput.setValue('')
  }
}
