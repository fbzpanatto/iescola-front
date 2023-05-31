import {Component, Input, OnInit, Signal, signal} from '@angular/core';
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
import { toObservable, toSignal } from '@angular/core/rxjs-interop'
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
  tests: Signal<TestClasses[] | undefined> = signal([])

  @Input() command?: string

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService) {
    super( router, route, fetchData, navigationService );

    if(!this.command) {
      this.tests = toSignal(this.getAll())
    }
  }

  ngOnInit(): void {

    this.searchInput.valueChanges
      .pipe( startWith(''), debounceTime(400), distinctUntilChanged() )
      .subscribe((value) => { this.fetchFilteredData(value) })
  }

  getAll() {
    return this.basicGetAll<TestClasses>()
  }

  fetchFilteredData(search: string | null) {
    console.log(search)
  }

  clearSearch() {
    this.searchInput.setValue('')
  }
}
