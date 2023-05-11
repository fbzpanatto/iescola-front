import { Component, OnInit } from '@angular/core';
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
import {AutoFocusDirective} from "../../shared/directives/auto-focus.directive";

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

  private _tests: TestClasses[] = []

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService) {
    super(router, route, fetchData, navigationService);
  }

  ngOnInit(): void {

    this.searchInput.valueChanges.subscribe((value) => {
      console.log(value)
    })

    // TODO: only do getAll if there is no params
    this.getAll()
  }

  getAll() {
    this.basicGetAll<TestClasses>()
      .subscribe((tests) => { this._tests = tests })
  }

  get tests() {
    return this._tests
  }

  clearSearch() {
    this.searchInput.setValue('')
  }
}
