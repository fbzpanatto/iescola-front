import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule} from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

import { BreakpointObserver, MediaMatcher } from "@angular/cdk/layout";

import { animate, style, transition, trigger } from "@angular/animations";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, RouterLinkActive } from "@angular/router";

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
    RouterLink
  ],
  animations: [
    trigger('simpleFade', [
      transition('*=>1', [
        style({ opacity:0 }), animate(350)
        ])
      ])
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

  constructor(
    private responsive: BreakpointObserver,
    private router: Router,
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
