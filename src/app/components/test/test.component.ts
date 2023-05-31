import { Component, Input, OnInit, Signal, signal } from '@angular/core';
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterModule} from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";
import { CommonModule } from "@angular/common";
import { FormComponent } from "./form/form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import { debounceTime, distinctUntilChanged, Observable, startWith } from "rxjs";

const CONFIG = {
  title: 'Testes',
  url: 'test',
  icon: 'quiz'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  standalone: true,
  selector: 'app-test',
  imports: [CommonModule, RouterModule, FormComponent, MatButtonModule, MatIconModule, ReactiveFormsModule, AutoFocusDirective],
  templateUrl: './test.component.html',
  styleUrls: ['test.component.scss', '../../shared/styles/table.scss']
})
export class TestComponent extends BasicComponent implements OnInit {

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  searchInput = new FormControl('')
  tests$?: Observable<TestClasses[]>

  @Input() command?: string

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService) {
    super( router, route, fetchData, navigationService );
  }

  ngOnInit(): void {

    if(!this.command) {
      this.searchInput.valueChanges
        .pipe( startWith(''), debounceTime(400), distinctUntilChanged() )
        .subscribe((value) => {
          if(!!value?.length) {
            this.tests$ = this.fetchFilteredData(value)
          } else {
            this.tests$ = this.getAll()
          }
        })
    }
  }

  getAll() {

    return this.basicGetAll<TestClasses>()
  }

  fetchFilteredData(search: string | null) {

    return this.basicGetQueryData<TestClasses>(`${TestComponent.url}`, 'search=' + search)
  }

  clearSearch() {

    this.searchInput.setValue('')
  }
}
