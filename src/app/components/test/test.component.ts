import { Component } from '@angular/core';
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterModule} from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";
import { CommonModule } from "@angular/common";
import { FormComponent } from "../../shared/components/form/form.component";

const CONFIG = {
  title: 'Testes',
  url: 'test',
  icon: 'quiz'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  standalone: true,
  selector: 'app-test',
  imports: [CommonModule, RouterModule, FormComponent],
  templateUrl: './test.component.html',
  styleUrls: ['../../shared/styles/table.scss']
})
export class TestComponent extends BasicComponent {

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  private _tests: TestClasses[] = []

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService) {
    super(router, route, fetchData, navigationService);
  }

  override ngOnInit(): void {

    this.listSubscription = this.basicGetAll<TestClasses>()
      .subscribe((tests) => { this._tests = tests })
  }

  get tests() {
    return this._tests
  }

  get originalFormControls() {
    return [
      {
        key: 'id',
        formControlName: 'id',
        label: 'ID',
        disabled: true,
        required: false,
        hidden: true
      }
    ]
  }
}
