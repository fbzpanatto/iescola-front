import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";
import {NavigationEnd, Router} from "@angular/router";
import {MatSidenavContent} from "@angular/material/sidenav";
import { Location } from '@angular/common';

export interface ActiveComponent {
  title: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  matSidenavContent?: MatSidenavContent;

  private history: string[] = [];
  private _subject = new BehaviorSubject<ActiveComponent>({title: '', url: ''});

  activeComponent$: Observable<ActiveComponent> = this._subject.asObservable()

  constructor(
    private router: Router,
    private location: Location
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }

      this.matSidenavContent?.scrollTo({ top: 0, left: 0 });
    })
  }

  back() {

    // TODO: Review this logic

    this.history.pop();

    if (this.history.length > 0) {
      this.location.back();
    } else {
      let path = this.location.path();
      if(path.includes('/')) {
        path = path.substring(0, path.lastIndexOf('/'));
      }
      this.router.navigateByUrl(path).finally(() => null);
    }
  }

  setActiveComponent(activeComponent: ActiveComponent) {
    this._subject.next(activeComponent);
  }

}
