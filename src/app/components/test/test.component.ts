import { Component } from '@angular/core';
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { BasicComponent, BasicImports } from "../basic/basic.component";
import { ActivatedRoute } from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";

const CONFIG = {
  title: 'Testes',
  url: 'test',
  icon: 'quiz'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  standalone: true,
  selector: 'app-test',
  imports: BasicImports,
  templateUrl: './test.component.html',
  styleUrls: ['../../shared/styles/table.scss']
})
export class TestComponent extends BasicComponent {

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  private _tests: TestClasses[] = []

  constructor( route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService) {
    super(route, fetchData, navigationService);
  }

  override ngOnInit(): void {

    this.listSubscription = this.basicGetAll<TestClasses>()
      .subscribe((tests) => { this._tests = tests })
  }

  get tests() {
    return this._tests
  }

}
