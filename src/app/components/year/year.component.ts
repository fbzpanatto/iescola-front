import { Component, OnDestroy, OnInit } from '@angular/core';
import { FetchDataService } from "src/app/shared/services/fetch-data.service";
import { NavigationService } from "src/app/shared/components/navigation/navigation.service";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { Year } from "src/app/shared/interfaces/interfaces";

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

  private _years: any
  private _subscription: Subscription = new Subscription()

  form = this.fb.group({
    name: [null, [Validators.required]],
    active: [null, [Validators.required]]
  })

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {

    this.navigationService.setActiveComponent({title: YearComponent.title, url: YearComponent.url});

    this._subscription = this.fetchData.all<Year>(YearComponent.resource)
      .subscribe((years) => this._years = years)
  }

  ngOnDestroy() {
    this._subscription.unsubscribe()
  }

  get years() {
    return this._years
  }
}
