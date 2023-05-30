import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TabSelectorService {

  private _destroyChart = new BehaviorSubject<boolean | undefined>(undefined)
  private _tabSubject = new BehaviorSubject<number | undefined>(undefined)

  tabSubject$ = this._tabSubject.asObservable()
  destroyChart$ = this._destroyChart.asObservable()

  constructor() { }

  nextTabSelector(number: number) {
    this._tabSubject.next(number)
  }

  async destroyChart() {
    await this._destroyChart.next(true)
  }
}
