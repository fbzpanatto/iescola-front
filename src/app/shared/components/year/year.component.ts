import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import {map, Observable, shareReplay, Subscription} from "rxjs";
import { FetchDataService } from "../../services/fetch-data.service";
import {CurrentYearService} from "../../services/current-year.service";

@Component({
  selector: 'app-year',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule],
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit, OnDestroy {

  private _yearSelectedOption: { [key:string]: any } = {}
  private yearSubscription?: Subscription
  year: any

  constructor(private fetchData: FetchDataService, private yearService: CurrentYearService) {}

  ngOnInit(): void {
    this.yearSubscription = this.getYear<any>()
      .pipe(
        shareReplay()
      )
      .subscribe((result: any) => {
        this.year = result
        this.yearSelectedOption = [...result].pop()
        this.yearService.next(this.yearSelectedOption)
      })
  }

  ngOnDestroy(): void {
    this.yearSubscription?.unsubscribe()
  }

  getYear<T>() {
    return this.fetchData.all<T>('year')
  }

  setYear(event: {[p: string]: any}) {
    this.yearSelectedOption = event
    this.yearService.next(this.yearSelectedOption)
  }

  get yearSelectedOption() {
    return this._yearSelectedOption
  }

  set yearSelectedOption(year: any) {
    this._yearSelectedOption = year
  }
}
