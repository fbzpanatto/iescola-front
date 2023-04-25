import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";
import { Subscription } from "rxjs";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { CommonModule } from "@angular/common";
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
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
  private _tests: TestClasses[] = []

  private _classroom: string = ''
  private _school: string = ''

  completed: number = 0

  totalPerQuestion: { [key: number]: number } = {}

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService,
  ) {}

  ngOnInit(): void {

    this.navigationService.setActiveComponent({title: TestComponent.title, url: TestComponent.url});

    this._listSubscription = this.fetchData.getAllData<TestClasses>(TestComponent.url)
      .subscribe((tests) => {
        this._tests = tests
      })
  }

  ngOnDestroy() {
    this._listSubscription.unsubscribe()
  }

  registerAnswers(param: {testId: number, classId: number, classroom: string, school: string}) {

    this.classroom = param.classroom
    this.school = param.school

    this.fetchData.getQueryData('student/register-answers', 'classroom=' + param.classId + '&' + 'test=' + param.testId)
      .subscribe((payload) => {
        console.log('linkStudentsWithTests: ', payload)
        this.response = payload

        /* for(let student of this.response.students) {
          this.completed += student.studentTests[0].completed ? 1 : 0
        } */

        this.registerAnswersFlag = true
        this.totalizerPerQuestion()
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
          id: studentTest.id
        },
        studentAnswers: arrayOfAnswers,
        completed: !completed
      }

      this.fetchData.updateOneData('student-answers', studentTest.id, body)
        .subscribe((payload: any) => {
          this.completed = payload
          this.totalizerPerQuestion()
        })
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

  color(runtimeQuestion: { id: number, answer: string }) {


    let index = this.response.test.questions.findIndex((question: { id: number }) => question.id === runtimeQuestion.id)

    const question = this.response.test.questions[index]

    if(runtimeQuestion.answer === '') return '#ffffff'

    return question.answer === runtimeQuestion.answer.toUpperCase() ? '#80e5ff' : '#ff7f7f'
  }

  totalizerPerQuestion(){

     this.totalPerQuestion = {}

    for (let studentTest of this.response['studentTests']) {

      for (let answer of studentTest.student.test.answers) {

        let index = this.response.test.questions.findIndex((question: any) => question.id === answer.id)
        let comparsion = this.response.test.questions[index].answer === answer.answer
        if(comparsion) {
          if (this.totalPerQuestion[answer.id]) {
            this.totalPerQuestion[answer.id]++
          } else {
            this.totalPerQuestion[answer.id] = 1
          }
        } else {
          if (!this.totalPerQuestion[answer.id]) {
            this.totalPerQuestion[answer.id] = 0
          }
        }
      }
    }
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

  get mapToArray() {
    // SET 0 IF EMPTY
    return Object.entries(this.totalPerQuestion).map(([question, answer]) => ({key: question, value: answer}))
  }
}
