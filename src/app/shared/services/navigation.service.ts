import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

export interface ActiveComponent {
  title: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private _subject = new BehaviorSubject<ActiveComponent>({title: '', url: ''});

  activeComponent$: Observable<ActiveComponent> = this._subject.asObservable()

  constructor() { }

  setActiveComponent(activeComponent: ActiveComponent) {
    this._subject.next(activeComponent);
  }

}
