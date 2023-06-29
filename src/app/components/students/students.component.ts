import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/components/navigation/navigation.service";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import { BimesterComponent } from "../../shared/components/bimester/bimester.component";
import { FormControl, ReactiveFormsModule} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { YearComponent } from "../../shared/components/year/year.component";
import { debounceTime, distinctUntilChanged, filter, map, Observable, startWith, Subscription, tap, combineLatest} from "rxjs";
import { StudentFormComponent } from "./form/student-form.component";
import { CurrentYearService } from "../../shared/components/year/current-year.service";

interface Student { id: string, order: string, name: string, classroom: string, school: string }

const COMPONENT_IMPORTS = [CommonModule, ReactiveFormsModule, AutoFocusDirective, BimesterComponent, MatButtonModule, MatIconModule, RouterLink, YearComponent, StudentFormComponent]

const CONFIG = {
  title: 'Alunos',
  url: 'student',
  icon: 'group'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  selector: 'app-students',
  standalone: true,
  imports: COMPONENT_IMPORTS,
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss', '../../shared/styles/table.scss']
})
export class StudentsComponent extends BasicComponent implements OnInit, OnDestroy {

  // this is the command that will be used to fetch data from the server
  // angular catches the url parameter and passes it to the component automatically
  @Input() command?: string

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  searchInput = new FormControl()
  students$?: Observable<Student[]>

  clear = false
  private year?: { [key: string]: any }
  private textSearch: string | null = ''
  private yearService = inject(CurrentYearService)

  subscription?: Subscription

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navService: NavigationService) {
    super( router, route, fetchData, navService );
  }

  ngOnDestroy(): void {

    this.subscription?.unsubscribe()

  }

  ngOnInit(): void {

    if(!this.command) {

      let subscription

      subscription = combineLatest([
        this.yearService.currYear$
          .pipe(
            tap(() => this.clear = false),
            map(result => result['id']), startWith(null)
          ),
        this.searchInput.valueChanges
          .pipe(startWith(''), debounceTime(400), distinctUntilChanged())
      ])
        .pipe( filter(([year, search]) =>  year || search))
        .subscribe(([year, search]) => {

          this.year = year
          this.textSearch = search

          if(!this.clear) {
            this.students$ = this.fetchFilteredData(Number(this.year), search)
          }

          this.clear = false
        })

      this.subscription?.add(subscription)
    }
  }

  fetchFilteredData(year:number, search: string | null){

    let query = 'search=' + search + '&' + 'year=' + year

    return this.basicGetQueryData(`${StudentsComponent.url}`, query) as Observable<Student[]>
  }

  clearSearch() {

    this.searchInput.setValue('')
  }

  refresh() {
    this.clear = true
    this.clearSearch()
    this.students$ = this.fetchFilteredData(Number(this.year), '') as Observable<Student[]>
  }
}
