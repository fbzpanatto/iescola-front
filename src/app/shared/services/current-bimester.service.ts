import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrentBimesterService {

  private _bimester = new Subject<{[p: string]: any}>()
  currBimester$ = this._bimester.asObservable()

  constructor() { }

  next(bimester: {[p: string]: any}) {
    this._bimester.next(bimester)
  }
}
