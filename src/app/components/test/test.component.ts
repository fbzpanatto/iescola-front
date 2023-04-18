import { Component } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";
import { Subscription } from "rxjs";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { CommonModule } from "@angular/common";
import { Test } from "src/app/shared/interfaces/interfaces";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  static title = 'Testes'
  static url = 'test'
  static icon = 'quiz'
  static resource = 'test'

  private _tests: Test[] = []
  private _subscription: Subscription = new Subscription()

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.navigationService.setActiveComponent({title: TestComponent.title, url: TestComponent.url});

    this._subscription = this.fetchData.getAllData<Test>(TestComponent.resource)
      .subscribe((tests) => this._tests = tests)
  }

  get tests() {
    return this._tests
  }

}
