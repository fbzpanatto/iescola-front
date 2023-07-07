import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { FetchDataService } from "../../services/fetch-data.service";
import { ObjectLiteral, ObjectLiteralArray, PopupOptions } from "../../interfaces/interfaces";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AutoFocusDirective } from "../../directives/auto-focus.directive";
import { Subscription } from "rxjs";

@Component({
  standalone: true,
  selector: 'app-popup',
  imports: [CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatDialogModule, AutoFocusDirective, FormsModule],
  templateUrl: './popup.component.html',
  styleUrls: ['../../styles/popup.scss']
})
export class PopupComponent implements OnInit, OnDestroy {

  userOptions: ObjectLiteralArray = []
  private originalData: any;
  headOptions: ObjectLiteralArray = []
  multiple: boolean = this.data.multipleSelection ?? false
  searchInput = new FormControl('')
  title: string = this.data.title ?? 'Escolha uma opção'
  subscription?: Subscription

  selectAll:boolean = false

  localSelected: number[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PopupOptions,
    public dialogRef: MatDialogRef<PopupComponent>,
    private fetchDataService: FetchDataService,
  ) {}

  ngOnDestroy(): void {

    this.subscription?.unsubscribe()

  }

  ngOnInit() {

    let subscription

    this.headOptions = this.data.headers as ObjectLiteralArray
    this.localSelected = []

    subscription = this.searchInput.valueChanges.subscribe((value: string | null) => {

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

      this.sortBySelected()
    })

    this.subscription?.add(subscription)

    if(this.data.fetchedData !== undefined) {
      this.originalData = [...this.data.fetchedData]
      this.userOptions = [...this.data.fetchedData]

      if(this.data.alreadySelected) {
        this.localSelected = [...this.data.alreadySelected] as number[]

        this.userOptions.forEach(item => {
          item['selected'] = this.localSelected.includes(item['id']);
        })

        if(this.data.multipleSelection) {
          this.selectAll = this.userOptions.every(item => item['selected']);

          this.sortBySelected()

        }
      }
    } else {
      this.fetchOptions(this.data.url as string)
    }
  }

  fetchOptions(url: string) {

    console.log('fetching options')

    let subscription

    subscription = this.fetchDataService.all(url).subscribe((response: any) => { this.userOptions = response })
    this.subscription?.add(subscription)
  }

  toggleSelectAll() {

    this.selectAll = !this.selectAll

    for(let option of this.userOptions) { option['selected'] = this.selectAll }

    if(this.selectAll && this.searchInput.value === '') {
      this.localSelected = this.userOptions.map(item => item['id'])
    }
    else if (this.selectAll && this.searchInput.value !== '') {
      for(let option of this.userOptions) {
        if(!this.localSelected.includes(option['id'])) {
          this.localSelected.push(option['id'])
        }
      }
    }
    else if (!this.selectAll && this.searchInput.value !== '') {
      for(let option of this.userOptions) {
        if(this.localSelected.includes(option['id'])) {
          this.localSelected.splice(this.localSelected.indexOf(option['id']), 1)
        }
      }
    }
    else { this.localSelected = [] }
  }

  toggleItemSelection(element: { [key: string]: any }) {

    const index = this.userOptions.findIndex(item => item['id'] === element['id'])

    this.userOptions[index]['selected'] = !this.userOptions[index]['selected']

    this.userOptions[index]['selected'] ?
      this.localSelected.push(element['id']) :
      this.localSelected.splice(this.localSelected.indexOf(element['id']), 1)

    if(this.data.multipleSelection) { this.selectAll = this.userOptions.every(item => item['selected'])}
  }

  close(element?: ObjectLiteral) {

    if (element) { return this.dialogRef.close(element)}

    this.dialogRef.close(this.originalData.filter((item: any) => this.localSelected.includes(item['id'])))
  }

  clearSearch() {
    this.searchInput.setValue('')
  }

  sortBySelected() {
    this.userOptions.sort((a, b) => {
      if(a['selected'] && !b['selected']) { return -1 }
      else if(!a['selected'] && b['selected']) { return 1 }
      else { return 0 }
    })
  }
}
