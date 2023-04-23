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

  private _classroom: string = ''
  private _school: string = ''

  private _currentArrayOfAnswers?: { id: number, answer: string }[]


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

  registerAnswers(param: {testId: number, classId: number, classroom: string, school: string}) {

    this.classroom = param.classroom
    this.school = param.school

    this.fetchData.getQueryData('student/register-answers', 'classroom=' + param.classId + '&' + 'test=' + param.testId)
      .subscribe((payload) => {
        this.response = payload
        this.registerAnswersFlag = true
      })
  }

  get data() {
    return this._dataToFront
  }

  get classroom() {
    return this._classroom
  }

  set classroom(param: string) {
    this._classroom = param
  }

  get school() {
    return this._school.toUpperCase()
  }

  set school(param: string) {
    this._school = param
  }

  updateAnswers(studentTest: any, arrayOfAnswers: { id: number, answer: string }[], runtimeQuestion: { id: number, answer: string }) {

    let index = arrayOfAnswers.findIndex((question) => question.id === runtimeQuestion.id)
    let result = arrayOfAnswers[index].answer === runtimeQuestion.answer

    if (!result) {

      arrayOfAnswers[index].answer = runtimeQuestion.answer

      let body = {
        student: {
          id: studentTest.studentId
        },
        test: {
          id: studentTest.testId
        },
        studentAnswers: arrayOfAnswers
      }

      this.fetchData.updateOneData('student-answers', studentTest.id, body).subscribe()
    }
  }

  studentTotal(studentAnswers: any) {

    let total = 0
    let empty = 0
    let totalQuestions = this.response.test.questions.length

    for (let [index, answer] of studentAnswers.entries()) {

      if(answer.answer === '') {
        empty++
      }

      if(answer.answer === this.response.test.questions[index].answer) {
        total++
      }
    }

    return empty === totalQuestions ? 'Nulo' : total
  }
}
