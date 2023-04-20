import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";
import { Subscription} from "rxjs";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { CommonModule } from "@angular/common";
import { Test, TestClasses } from "src/app/shared/interfaces/interfaces";

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  static title = 'Testes'
  static url = 'test'
  static icon = 'quiz'

  registerAnswersFlag: boolean = false
  response: any = {}

  private _listSubscription: Subscription = new Subscription()
  private _dataToFront: { testId: number, classes: TestClasses[] }[] = []


  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {
    this.navigationService.setActiveComponent({title: TestComponent.title, url: TestComponent.url});

    this._listSubscription = this.fetchData.getAllData<Test>(TestComponent.url)
      .subscribe((tests) => {
        this._dataToFront = this.formatData(tests)
      })
  }

  ngOnDestroy() {
    this._listSubscription.unsubscribe()
  }

  formatData(response: any) {

    let dataToFront: { testId: number, classes: TestClasses[] }[] = []

    for (let test of response) {

      let tests: TestClasses[] = []

      for(let testClass of test.testClasses) {
        let data = {
          name: test.name,
          school: testClass.classroom.school.name,
          classroomId: testClass.classroom.id,
          classroom: testClass.classroom.name,
          year: test.year.name,
          bimester: test.bimester.name,
          category: test.category.name,
          teacher: test.teacher.person.name,
          discipline: test.discipline.name,
        }
        tests.push(data)
      }
      dataToFront.push({ testId: test.id, classes: tests })
    }
    return dataToFront
  }

  get data() {
    return this._dataToFront
  }

  registerAnswers(param: {testId: number, classId: number}) {
    this.fetchData.getQueryData('student/register-answers', 'classroom=' + param.classId + '&' + 'test=' + param.testId)
      .subscribe((payload) => {
        this.response = payload
        this.registerAnswersFlag = true
      })
  }
}
