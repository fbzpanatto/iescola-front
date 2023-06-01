import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrentYearService {

  private year = new Subject<{[p: string]: any}>()
  currYear$ = this.year.asObservable()

  constructor() { }

  next(year: {[p: string]: any}) {
    this.year.next(year)
  }
}
