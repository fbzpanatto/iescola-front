import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule} from "@angular/material/sidenav";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatListModule } from "@angular/material/list";
import { MatLineModule, MatRippleModule } from "@angular/material/core";

import { BreakpointObserver, MediaMatcher } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";

import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from "@angular/router";

import { NavigationService } from "src/app/shared/components/navigation/navigation.service";
import { ActiveComponent } from "src/app/shared/components/navigation/navigation.service";

import { map } from "rxjs";

import { HomeComponent } from "src/app/components/home/home.component";
import { TestComponent } from "src/app/components/test/test.component";
import { LoginModalService } from "../login/login-modal.service";
import { UserLoginDataService } from "../login/user-login-data.service";
import { StudentsComponent } from "../../../components/students/students.component";
import {TeacherComponent} from "../../../components/teacher/teacher.component";

// TODO: flat tree like aero
const MENU_TREE = [
  {
    title: HomeComponent.title,
    url: HomeComponent.url,
    icon: HomeComponent.icon,
  },
  {
    title: TestComponent.title,
    url: TestComponent.url,
    icon: TestComponent.icon,
  },
  {
    title: TeacherComponent.title,
    url: TeacherComponent.url,
    icon: TeacherComponent.icon,
  },
  {
    title: StudentsComponent.title,
    url: StudentsComponent.url,
    icon: StudentsComponent.icon,
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

  isHome = true;
  currentUrl = '';
  opened = false;
  isLargeScreen = false;
  isMediumScreen = false;
  isSmallScreen = true;
  mobileQuery!: MediaQueryList;

  private readonly _mobileQueryListener: () => void;

  protected readonly MENU_TREE = MENU_TREE;

  userLoginService = inject(UserLoginDataService)

  constructor(
    private loginModal: LoginModalService,
    private route: ActivatedRoute,
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

    this.navigationService.activeComponent$.subscribe(activeComponent => {
      this.isHome = activeComponent.url === HomeComponent.url;
    })

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

  previousPage() {
    this.navigationService.back();
  }

  doLogin() {
    this.loginModal.openLoginModal()
      .afterClosed()
      .subscribe()
  }

  async doLogout() {
    await this.userLoginService.clear()

  }
}
