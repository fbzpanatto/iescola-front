import {
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto'
import { ActivatedRoute } from "@angular/router";
import { FetchDataService } from "../../../../shared/services/fetch-data.service";
import {TabSelectorService} from "../../tab-selector.service";

const CONFIG = {
  title: 'Teste / Analises',
  url: 'student-tests'
}

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './totals.component.html',
  styleUrls: ['../../../../shared/styles/table.scss']
})
export class TotalsComponent implements OnInit {

  static title = CONFIG.title
  static url = CONFIG.url

  @ViewChild('chart', { static: true }) private chartRef?: ElementRef;

  private _testIdParam: string = ''
  private _classIdParam: string = ''
  private _data?: { [key: string]: any } = {}
  private _questions = []
  private _school?: string
  private _classrooms: { [key: string]: any }[] = []

  private chart?: Chart

  constructor( private route: ActivatedRoute, private fetchData: FetchDataService, private tabSelectorService: TabSelectorService,) {}

  ngOnInit(): void {

    this.tabSelectorService.destroyChart$.subscribe(condition => {
      if(condition) {
        console.log('destruindo')
        this.destroyChart()
      }
    })

    this.tabSelectorService.tabSubject$
      .subscribe(tab => {
        if (tab === 1) {
          this.start()
        }
      })
  }

  start() {
    this.route.params.subscribe(params => {
      const { command, classId } = params
      this.classIdParam = classId
      this.testIdParam = command
      this.loadData({ testId: this.testIdParam, classId: this.classIdParam })
    })
  }

  loadData(params: {testId: string, classId: string}) {
    this.fetchData.getQueryData(`${TotalsComponent.url}/analyzes`, 'classroom=' + params.classId + '&' + 'test=' + params.testId)
      .subscribe((response: any) => {

        let accessor = Object.keys(response).shift() as typeof response
        this.school = response[accessor].school.name
        this.data = response

        this.classrooms = Object.keys(response).map(classroom => response[classroom])

        this.questions = this.data.cityHall.question.map((obj: any) => obj.id)

        this.setChart()
      })
  }

  setChart() {

    let mydataSets = []

    for(let register in this.data) {

      mydataSets.push({
        label: this.data[register].classroom,
        data: this.data[register].question.map((qt: any) => qt.rate),
        borderWidth: 1
      })
    }

    this.chart = new Chart(this.chartRef?.nativeElement, {
      type: 'bar',
      data: {
        labels: this.data.cityHall.question.map((obj: any) => obj.id),
        datasets: mydataSets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  }

  destroyChart() {
    this.chart?.destroy()
  }

  get questions() {
    return this._questions
  }

  set questions(questions: any) {
    this._questions = questions
  }

  get data() {
    return this._data
  }

  set data(response: any) {
    this._data = response
  }

  get classIdParam(): string {
    return this._classIdParam
  }

  set classIdParam(value: string) {
    this._classIdParam = value
  }

  get testIdParam(): string {
    return this._testIdParam
  }

  set testIdParam(value: string) {
    this._testIdParam = value
  }

  get school() {
    return this._school
  }

  set school(sc: string | undefined) {
    this._school = sc
  }

  get classrooms() {
    return this._classrooms
  }

  set classrooms(array: { [key: string]: any }[]) {
    this._classrooms = array
  }
}
