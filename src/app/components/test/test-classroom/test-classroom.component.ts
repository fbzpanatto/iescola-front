import { Component, OnInit } from '@angular/core';
import { MatTooltipModule } from "@angular/material/tooltip";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { map, switchMap } from "rxjs";
import { FetchDataService } from "../../../shared/services/fetch-data.service";
import { TestClasses } from "../../../shared/interfaces/interfaces";

@Component({
  standalone: true,
  selector: 'app-test-students',
  templateUrl: './test-classroom.component.html',
  imports: [
    CommonModule,
    MatTooltipModule
  ],
  styleUrls: ['../../../shared/styles/table.scss']
})
export class TestClassroom implements OnInit {

  private _testId: string = ''
  private _classId: string = ''

  private _test: { [key: string]: any } = {}
  private _studentTests: { [key: string]: any }[] = []
  private _classroom: string = ''
  private _school: string = ''
  private _totalByQuestion: any
  private _rateByQuestion: any

  testsCompleted: number = 0

  constructor(
    private route: ActivatedRoute,
    private fetchData: FetchDataService,
  ) { }

  ngOnInit(): void {

    this.start()

  }

  start() {
    this.route.parent?.params.pipe(
      switchMap(parentParams => {
        this.testId = parentParams['id']
        return this.route.params;
      }),
      map((params) => {
        this.classId = params['id']
        return { testId: this.testId, classId: this.classId }
      })
    ).subscribe(params => this.fetchTestStudents(params));
  }

  fetchTestStudents(params: {testId: string, classId: string}) {
    this.fetchData.getQueryData('student/register-answers', 'classroom=' + params.classId + '&' + 'test=' + params.testId)
      .subscribe((payload: any) => {

        const { test, studentTests, totalByQuestion, totalTestCompleted, rateByQuestion } = payload

        this.test = test
        this.studentTests = studentTests
        this.totalByQuestion = totalByQuestion
        this.testsCompleted = totalTestCompleted
        this.rateByQuestion = rateByQuestion
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

          const { test, studentTests, totalByQuestion, totalTestCompleted, rateByQuestion } = payload

          // ESTOU PERDENDO O TAB APÓS ATUALIZAR A RESPOSTA
          this.test = test
          this.studentTests = studentTests
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

    return question.answer === runtimeQuestion.answer.toUpperCase() ? '#80e5ff' : '#ff7f7f'

  }

  rateColor(rate: string) {

    const newRate = Number(rate.replace('%', ''))
    const colors = ['#FF7F7FFF', '#FF7F7FCC', '#FF7F7F99', '#FF7F7F66', '#FF7F7F33', '#C7FF7F33', '#99FF7F33', '#66FF7F33', '#33FF7F33', '#1EFF7F33'];
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

  get classId() {
    return this._classId
  }

  set classId(value: string) {
    this._classId = value
  }

  get testId() {
    return this._testId
  }

  set testId(value: string) {
    this._testId = value
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

}
