import { Component, OnInit } from '@angular/core';
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router} from "@angular/router";
import { FetchDataService } from "../../../../shared/services/fetch-data.service";
import { NavigationService } from "../../../../shared/components/navigation/navigation.service";
import { BasicComponent } from "../../../../shared/components/basic/basic.component";
import { SetActiveComponentBarTitle } from "../../../../shared/methods/activeComponent";
import { PopupService } from "../../../../shared/components/popup/popup.service";
import { PopupOptions } from "../../../../shared/interfaces/interfaces";
import {TabSelectorService} from "../../tab-selector.service";

const HEADERS: { [key: string]: any } = {
  teacher: [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Professor' }
  ],
  classroom: [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Sala' }
  ]
}

const CONFIG = {
  title: 'Teste / Sala de aula',
  url: 'student-tests'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  standalone: true,
  selector: 'app-class-answers',
  templateUrl: './class-answers.component.html',
  imports: [CommonModule, MatTooltipModule],
  styleUrls: ['../../../../shared/styles/table.scss']
})
export class ClassAnswers extends BasicComponent implements OnInit {

  static title = CONFIG.title
  static url = CONFIG.url

  private _testIdParam: string = ''
  private _classIdParam: string = ''
  private _classroom: string = ''
  private _school: string = ''

  private _test: { [key: string]: any } = {}
  private _testGiver: { [key: string]: any } = {}
  private _studentTests: { [key: string]: any }[] = []
  private _totalByQuestion: { id: number, total: number }[] = []
  private _rateByQuestion: { id: number, rate: string }[] = []

  testsCompleted: number = 0

  constructor(
    router: Router,
    route: ActivatedRoute,
    fetchData: FetchDataService,
    navigationService: NavigationService,
    private tabSelectorService: TabSelectorService,
    private popupService: PopupService) {
    super(router, route, fetchData, navigationService);
  }

  ngOnInit(): void {

    this.tabSelectorService.tabSubject$
      .subscribe(tab => {
        if (tab === 0) { this.start() }
      })
  }

  start() {

    this.route.params.subscribe((params) => {
      const { command, classId } = params
      this.classIdParam = classId
      this.testIdParam = command

      this.loadData({ testId: this.testIdParam, classId: this.classIdParam })
    })
  }

  loadData(params: {testId: string, classId: string}) {
    this.basicGetQueryData(`${ClassAnswers.url}/register-answers`, 'classroom=' + params.classId + '&' + 'test=' + params.testId)
      .subscribe((payload: any) => {

        const { test, classroom, studentTests, totalByQuestion, totalTestCompleted, rateByQuestion, testGiver } = payload

        for(let st of studentTests) {
          if(!st.student.test.completed) {st.student.test.score = 'Nulo'}
        }

        this.test = test
        this.classroom = classroom.name
        this.school = classroom.school
        this.studentTests = studentTests
        this.totalByQuestion = totalByQuestion
        this.testsCompleted = totalTestCompleted
        this.rateByQuestion = rateByQuestion
        this.testGiver = testGiver
      })
  }

  updateAnswers(studentTestHTML: any, arrayOfAnswers: { id: number, answer: string }[], runtimeQuestion: { id: number, answer: string }) {

    let index = arrayOfAnswers.findIndex((question) => question.id === runtimeQuestion.id)
    let result = arrayOfAnswers[index].answer === runtimeQuestion.answer

    if (!result) {

      arrayOfAnswers[index].answer = runtimeQuestion.answer.toUpperCase().trim()

      const completed = arrayOfAnswers.every((answer) => answer.answer === '')

      let body = {
        test: { id: this.test.id },
        studentTest: { id: studentTestHTML.id },
        registeredInClass: { id: this.classIdParam },
        studentAnswers: arrayOfAnswers,
        completed: !completed,
      }

      this.basicUpdateOneData(ClassAnswers.url, studentTestHTML.id, body)
        .subscribe((payload: any) => {

          const { test, studentTests, totalByQuestion, totalTestCompleted, rateByQuestion } = payload

          const index = studentTests.findIndex((st: any) => st.student.id === studentTestHTML.student.id)

          if(studentTests[index].student.test.completed) {
            this.studentTests[index].student.test.score = studentTests[index].student.test.score
          } else {
            this.studentTests[index].student.test.score = 'Nulo'
          }

          this.test = test
          this.totalByQuestion = totalByQuestion
          this.testsCompleted = totalTestCompleted
          this.rateByQuestion = rateByQuestion

        })
    }
  }

  correctAnswer(runtimeQuestion: { id: number, answer: string }) {

    let index = this.test.questions.findIndex((question: { id: number }) => question.id === Number(runtimeQuestion.id))

    const question = this.test.questions[index]

    if(runtimeQuestion.answer === '') return '#ffffff'

    const condition = question.answer.includes(runtimeQuestion.answer.toUpperCase())

    return condition ? '#80e5ff' : '#ff7f7f'

  }

  rateColor(rate: string) {

    const newRate = Number(rate.replace('%', ''))
    const colors = [
      '#FF000080', // vermelho
      '#FF330080',
      '#FF660080',
      '#FF990080',
      '#FFCC0080',
      '#FFFF0080', // amarelo
      '#CCFF0080',
      '#99FF0080',
      '#66FF0080',
      '#33FF0080'  // verde
    ];

    if(newRate >= 0 && newRate <= 10) return colors[0]
    if(newRate > 10 && newRate <= 20) return colors[1]
    if(newRate > 20 && newRate <= 30) return colors[2]
    if(newRate > 30 && newRate <= 40) return colors[3]
    if(newRate > 40 && newRate <= 50) return colors[4]
    if(newRate > 50 && newRate <= 60) return colors[5]
    if(newRate > 60 && newRate <= 70) return colors[6]
    if(newRate > 70 && newRate <= 80) return colors[7]
    if(newRate > 80 && newRate <= 90) return colors[8]
    if(newRate > 90 && newRate <= 100) return colors[9]
    return '#ffffff'
  }

  addTestGiver() {

    const popupOptions: PopupOptions = { url: 'teacher', headers: HEADERS['teacher'] }

    this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((payload: any) => {

          if (payload.id) {
            const { id, name: person } = payload

            let body = {
              testGiver: {
                id: id
              },
              test: {
                id: this.testIdParam
              },
              classroom: {
                id: this.classIdParam
              }
            }

            this.basicUpdateWithBody('test-classes', body)
              .subscribe((payload: any) => {
                this.testGiver = { id, person }
              })
          }
      })
  }

  get classIdParam() {
    return this._classIdParam
  }

  set classIdParam(value: string) {
    this._classIdParam = value
  }

  get testIdParam() {
    return this._testIdParam
  }

  set testIdParam(value: string) {
    this._testIdParam = value
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

  get rateByQuestion() {
    return this._rateByQuestion
  }

  set rateByQuestion(param: any) {
    this._rateByQuestion = param
  }

  get testGiver() {
    return this._testGiver
  }

  set testGiver(param: any) {
    this._testGiver = param
  }

}
