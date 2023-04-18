import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule} from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";
import { MatLineModule, MatRippleModule } from "@angular/material/core";

import { BreakpointObserver, MediaMatcher } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

import { NavigationService } from "src/app/shared/services/navigation.service";

import { ActiveComponent } from "src/app/shared/services/navigation.service";

import {map, tap} from "rxjs";

const MENU_TREE = [
  {
    title: 'Ínicio',
    url: 'home',
    icon: 'home',
  },
  {
    title: 'Anos Letivos',
    url: 'year',
    icon: 'calendar_today',
  }
]

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLinkActive,
    RouterLink,
    MatListModule,
    MatRippleModule,
    MatLineModule
  ],
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  opened = false;
  isLargeScreen = false;
  isMediumScreen = false;
  isSmallScreen = true;
  mobileQuery!: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  protected readonly MENU_TREE = MENU_TREE;

  constructor(
    private responsive: BreakpointObserver,
    private router: Router,
    private navigationService: NavigationService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {

    this.navigationService.activeComponent$
      .pipe(
        tap((activeComponent: ActiveComponent) => {
          console.log(activeComponent)
        })
      )
      .subscribe()
    this.setBreakpointObserver();
  }

  setBreakpointObserver() {

    const minWidth720 = '(min-width: 720px)'
    const minWidth960 = '(min-width: 960px)'

    this.responsive
      .observe([ minWidth720, minWidth960 ])
      .subscribe(result => {
        const breakpoints = result.breakpoints;

        this.isLargeScreen = breakpoints[minWidth960];
        this.isMediumScreen = !this.isLargeScreen && breakpoints[minWidth720];
        this.isSmallScreen = !this.isLargeScreen && !this.isMediumScreen;

        this.opened = this.isLargeScreen;
      });
  }

  get title$() {
    return this.navigationService.activeComponent$
      .pipe(
        map((activeComponent: ActiveComponent) => activeComponent.title)
      )
  }
}
