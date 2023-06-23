import {inject, Injectable} from '@angular/core';
import {map, Observable, of, shareReplay, Subject, tap} from "rxjs";
import {FetchDataService} from "../../services/fetch-data.service";

@Injectable({
  providedIn: 'root'
})
export class CurrentYearService {

  private year = new Subject<{[p: string]: any}>()
  currYear$ = this.year.asObservable()

  private fetchData = inject(FetchDataService)

  constructor() {}

  get years$() {
    return this.fetchData.all('year')
      .pipe(
        tap((result: any) => {
          this.next([...result].pop())
        }),
        shareReplay()
      )
  }

  next(year: {[p: string]: any}) {
    this.year.next(year)
  }
}
