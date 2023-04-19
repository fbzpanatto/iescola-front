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

  private _subscription: Subscription = new Subscription()

  private _dataToFront: any[] = []

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.navigationService.setActiveComponent({title: TestComponent.title, url: TestComponent.url});

    this._subscription = this.fetchData.getAllData<Test>(TestComponent.resource)
      .subscribe((tests) => {
        this._dataToFront = this.formatData(tests)
      })
  }

  formatData(response: any) {

    let dataToFront = []

    for (let test of response) {

      let tests = []

      for(let testClass of test.testClasses) {
        let data = {
          name: test.name,
          classroom: testClass.classroom.name,
          year: test.year.name,
          bimester: test.bimester.name,
          category: test.category.name,
          teacher: test.teacher.person.name,
          discipline: test.discipline.name,
        }
        tests.push(data)
      }
      dataToFront.push({ 'id': test.id, tests: tests })
    }
    return dataToFront
  }

  get dataList() {
    return this._dataToFront
  }
}
