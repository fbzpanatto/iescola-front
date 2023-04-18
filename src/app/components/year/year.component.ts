import { Component, OnDestroy, OnInit } from '@angular/core';
import { FetchDataService } from "src/app/shared/services/fetch-data.service";
import { NavigationService } from "src/app/shared/services/navigation.service";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

interface Year {
  id: number,
  name: number,
  active: boolean
}

@Component({
  standalone: true,
  selector: 'app-year',
  templateUrl: './year.component.html',
  imports: [
    CommonModule
  ],
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit, OnDestroy {

  static title = 'Anos Letivos'
  static url = 'year'
  static icon = 'calendar_today'
  static resource = 'year'

  private _years: Year[] = []
  private _subscription: Subscription = new Subscription()

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {

    this.navigationService.setActiveComponent({title: YearComponent.title, url: YearComponent.url});

    this._subscription = this.fetchData.getAllData<Year>(YearComponent.resource)
      .subscribe((years) => this._years = years)
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

  get years() {
    return this._years
  }
}
