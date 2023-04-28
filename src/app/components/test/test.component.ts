import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";
import { Subscription } from "rxjs";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { CommonModule } from "@angular/common";
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule, MatIconModule],
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  static title = 'Testes'
  static url = 'test'
  static icon = 'quiz'

  registerAnswersFlag: boolean = false

  private _listSubscription: Subscription = new Subscription()
  private _tests: TestClasses[] = []

  private _test: { [key: string]: any } = {}
  private _studentTests: { [key: string]: any }[] = []

  private _classroom: string = ''
  private _school: string = ''

  private _totalByQuestion: any

  completed: number = 0

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {

    this.navigationService.setActiveComponent({title: TestComponent.title, url: TestComponent.url});

    this._listSubscription = this.fetchData.getAllData<TestClasses>(TestComponent.url)
      .subscribe((tests) => { this._tests = tests })
  }

  ngOnDestroy() {
    this._listSubscription.unsubscribe()
  }

  registerAnswers(param: {testId: number, classId: number, classroom: string, school: string}) {

    this.classroom = param.classroom
    this.school = param.school

    this.fetchData.getQueryData('student/register-answers', 'classroom=' + param.classId + '&' + 'test=' + param.testId)
      .subscribe((payload: any) => {

        const { test, studentTests, totalByQuestion, totalTestCompleted } = payload

        this.test = test
        this.studentTests = studentTests
        this.totalByQuestion = totalByQuestion
        this.completed = totalTestCompleted

        this.registerAnswersFlag = true
      })
  }

  updateAnswers(studentTest: any, arrayOfAnswers: { id: number, answer: string }[], runtimeQuestion: { id: number, answer: string }) {

    let index = arrayOfAnswers.findIndex((question) => question.id === runtimeQuestion.id)
    let result = arrayOfAnswers[index].answer === runtimeQuestion.answer

    if (!result) {

      arrayOfAnswers[index].answer = runtimeQuestion.answer

      const completed = arrayOfAnswers.every((answer) => answer.answer === '')

      let body = {
        student: {
          id: studentTest.student.id
        },
        test: {
          id: this.test.id
        },
        studentAnswers: arrayOfAnswers,
        completed: !completed
      }

      this.fetchData.updateOneData('student-answers', studentTest.id, body)
        .subscribe((payload: any) => {

          const { totalByQuestion, totalTestCompleted } = payload

          this.totalByQuestion = totalByQuestion
          this.completed = totalTestCompleted

        })
    }
  }

  // TODO: Se quiser que o retorno seja feito no Back, tem q usar o método abaixo a cada PUT de alternativa.
  studentScore(studentAnswers: { answer: string; id: number | string; }[]): number | string {

    const notCompleted = studentAnswers.every((question) => question.answer === '')

    if(!notCompleted) {
      return studentAnswers.reduce((acc: number, curr: { answer: any; id: any; }) => {
        if (curr.answer === this.test.questions.find((q: { id: number; }) => q.id === Number(curr.id))?.answer) {
          return acc + 1
        }
        return acc
      }, 0)
    }

    return 'Nulo'
  }

  color(runtimeQuestion: { id: number, answer: string }) {

    let index = this.test.questions.findIndex((question: { id: number }) => question.id === Number(runtimeQuestion.id))

    const question = this.test.questions[index]

    if(runtimeQuestion.answer === '') return '#ffffff'

    return question.answer === runtimeQuestion.answer.toUpperCase() ? '#80e5ff' : '#ff7f7f'

  }

  get tests() {
    return this._tests
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

  get test() {
    return this._test
  }

  set test(test: any) {
    this._test = test
  }

  get studentTests() {
    return this._studentTests
  }

  set studentTests(studentTest: any) {
    this._studentTests = studentTest
  }

  get totalByQuestion() {
    return this._totalByQuestion
  }

  set totalByQuestion(param: any) {
    this._totalByQuestion = param
  }
}
