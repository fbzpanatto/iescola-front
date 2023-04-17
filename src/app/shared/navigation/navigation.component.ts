import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BreakpointObserver, MediaMatcher } from "@angular/cdk/layout";

@Component({
  standalone: true,
  imports: [MatToolbarModule, MatSidenavModule, MatIconModule, MatButtonModule, MatTooltipModule],
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit{

  opened = false;
  isLargeScreen = false;
  isMediumScreen = false;
  isSmallScreen = true;
  mobileQuery!: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor(
    private responsive: BreakpointObserver,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {

    this.mobileQuery = media.matchMedia('(max-width: 960px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  ngOnInit() {

    this.setBreakpointObserver();
  }

  ngAfterViewInit() {}

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
}
