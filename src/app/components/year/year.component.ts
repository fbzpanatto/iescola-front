import { Component, OnInit } from '@angular/core';
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { CommonModule } from "@angular/common";
import { tap } from "rxjs";

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
export class YearComponent implements OnInit {

  static title = 'Anos Letivos'
  static url = 'year'
  static icon = 'calendar_today'
  static resource = 'year'

  private _years: Year[] = []

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {

    this.navigationService.setActiveComponent({title: YearComponent.title, url: YearComponent.url});

    return this.fetchData.getAllData<Year>(YearComponent.resource)
      .pipe(tap((years) => this._years = years))
      .subscribe()
  }

  get years() {
    return this._years
  }
}
