import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterModule} from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";
import { CommonModule } from "@angular/common";
import { TestFormComponent } from "./form/test-form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  Subscription,
  tap
} from "rxjs";
import { BimesterComponent } from "../../shared/components/bimester/bimester.component";
import { YearComponent } from "../../shared/components/year/year.component";
import { CurrentBimesterService } from "../../shared/services/current-bimester.service";
import { CurrentYearService } from "../../shared/services/current-year.service";

const CONFIG = {
  title: 'Testes',
  url: 'test',
  icon: 'quiz'
}

const COMPONENTIMPORTS = [CommonModule, RouterModule, TestFormComponent, MatButtonModule, MatIconModule, ReactiveFormsModule, AutoFocusDirective, BimesterComponent, YearComponent]

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  standalone: true,
  selector: 'app-test',
  imports: COMPONENTIMPORTS,
  templateUrl: './test.component.html',
  styleUrls: ['test.component.scss', '../../shared/styles/table.scss']
})
export class TestComponent extends BasicComponent implements OnInit, OnDestroy {

  @Input() command?: string

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  searchInput = new FormControl()
  tests$?: Observable<TestClasses[]>

  clear = false
  private bimester?: { [key: string]: any }
  private year?: { [key: string]: any }
  private textSearch: string | null = ''

  private searchInputSubscription?: Subscription
  private combineSubscription?: Subscription

  private bimesterService = inject(CurrentBimesterService)
  private yearService = inject(CurrentYearService)

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navService: NavigationService) {
    super( router, route, fetchData, navService );
  }

  ngOnInit(): void {

    if(!this.command) {

      this.combineSubscription = combineLatest([
        this.bimesterService.currBimester$
          .pipe(
            tap(() => this.clear = false),
            map(result => result['id']), startWith(null)
          ),
        this.yearService.currYear$
          .pipe(
            tap(() => this.clear = false),
            map(result => result['id']), startWith(null)
          ),
        this.searchInput.valueChanges
          .pipe(startWith(''), debounceTime(400), distinctUntilChanged())
      ])
        .pipe( filter(([bimester, year, search]) => bimester || year || search))
        .subscribe(([bimester, year, search]) => {

          this.bimester = bimester
          this.year = year
          this.textSearch = search

          if(!this.clear) {
            this.tests$ = this.fetchFilteredData(Number(this.bimester), Number(this.year), search) as Observable<TestClasses[]>
          }

          this.clear = false
        })
    }
  }

  ngOnDestroy() {

    this.combineSubscription?.unsubscribe()
    this.searchInputSubscription?.unsubscribe()
  }

  fetchFilteredData(bimester: number, year: number, search: string | null) {

    let query = 'search=' + search + '&' + 'bimester=' + bimester + '&' + 'year=' + year

    return this.basicGetQueryData<TestClasses>(`${TestComponent.url}`, query)
  }

  clearSearch() {

    this.searchInput.setValue('')
  }

  refresh() {
    this.clear = true
    this.clearSearch()
    this.tests$ = this.fetchFilteredData(Number(this.bimester), Number(this.year), '') as Observable<TestClasses[]>
  }
}
