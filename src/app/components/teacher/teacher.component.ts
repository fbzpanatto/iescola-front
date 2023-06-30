import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/components/navigation/navigation.service";
import { combineLatest,  debounceTime,  distinctUntilChanged,  filter,  map,  Observable,  startWith,  Subscription,  tap } from "rxjs";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CurrentYearService } from "../../shared/components/year/current-year.service";
import { TeacherFormComponent } from "./form/teacher-form.component";

interface Teacher { id: number, name: string }

const COMPONENT_IMPORTS = [CommonModule, AutoFocusDirective, MatButtonModule, MatIconModule, ReactiveFormsModule, RouterLink, TeacherFormComponent]

const CONFIG = {
  title: 'Professores',
  url: 'teacher',
  icon: 'person'
}

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: COMPONENT_IMPORTS,
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss', '../../shared/styles/table.scss']
})
export class TeacherComponent extends BasicComponent implements OnInit, OnDestroy {

  @Input() command?: string

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  searchInput = new FormControl()
  teachers$?: Observable<Teacher[]>

  subscription?: Subscription

  clear = false
  private year?: { [key: string]: any }
  private textSearch: string | null = ''
  private yearService = inject(CurrentYearService)

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navService: NavigationService) {
    super( router, route, fetchData, navService );
  }

  ngOnInit(): void {

    if(!this.command) {

      let subscription

      subscription = combineLatest([
        this.yearService.currYear$
          .pipe(
            tap(() => this.clear = false),
            // change startWith to null to fetch all data
            map(result => result['id']), startWith(1)
          ),
        this.searchInput.valueChanges
          .pipe(startWith(''), debounceTime(400), distinctUntilChanged())
      ])
        .pipe( filter(([year, search]) =>  year || search))
        .subscribe(([year, search]) => {

          this.year = year
          this.textSearch = search

          if(!this.clear) {
            this.teachers$ = this.fetchFilteredData(Number(this.year), search)
          }

          this.clear = false
        })

      this.subscription?.add(subscription)
    }

  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe()

  }

  fetchFilteredData(year:number, search: string | null){

    let query = 'search=' + search + '&' + 'year=' + year

    return this.basicGetQueryData(`${TeacherComponent.url}`, query) as Observable<Teacher[]>
  }

  clearSearch() {

    this.searchInput.setValue('')
  }

  refresh() {

    this.clear = true
    this.clearSearch()
    this.teachers$ = this.fetchFilteredData(Number(this.year), '') as Observable<Teacher[]>
  }
}
