import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import {map, Observable, shareReplay, Subscription} from "rxjs";
import { FetchDataService } from "../../services/fetch-data.service";
import {CurrentBimesterService} from "../../services/current-bimester.service";

@Component({
  selector: 'app-bimester',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule],
  templateUrl: './bimester.component.html',
  styleUrls: ['./bimester.component.scss']
})
export class BimesterComponent implements OnInit, OnDestroy {

  private _bimesterSelectedOption: { [key:string]: any } = {}
  private bimesterSubscription?: Subscription
  bimester?: any

  constructor(private fetchData: FetchDataService, private bimesterService: CurrentBimesterService) {}

  ngOnInit(): void {
    this.bimesterSubscription = this.getBimester<any>()
      .subscribe((result: any) => {
        this.bimester = result
        this.bimesterSelectedOption = [...result].pop()
        this.bimesterService.next(this.bimesterSelectedOption)
      })
  }

  ngOnDestroy(): void {
    this.bimesterSubscription?.unsubscribe()
  }

  getBimester<T>() {
    return this.fetchData.all<T>('bimester')
  }

  setBimester(event: {[p: string]: any}) {
    this.bimesterSelectedOption = event
  }

  get bimesterSelectedOption() {
    return this._bimesterSelectedOption
  }

  set bimesterSelectedOption(bimester: any) {
    this.bimesterService.next(bimester)
    this._bimesterSelectedOption = bimester
  }
}
