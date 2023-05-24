import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto'
import { ActivatedRoute } from "@angular/router";
import { FetchDataService } from "../../../../shared/services/fetch-data.service";

const CONFIG = {
  title: 'Teste / Analises',
  url: 'student-tests'
}

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss']
})
export class TotalsComponent implements OnInit {

  static title = CONFIG.title
  static url = CONFIG.url

  @ViewChild('chart', { static: true }) private chartRef?: ElementRef;

  private _testIdParam: string = ''
  private _classIdParam: string = ''
  private _data?: { [key: string]: any } = {}

  constructor( private route: ActivatedRoute, private fetchData: FetchDataService) {}

  ngOnInit(): void {

    this.start()

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
        this.data = response

        this.setChart()
      })
  }

  setChart() {

    for(let register in this.data) {
      // console.log(this.data[register])
    }

    console.log(this.data)

    new Chart(this.chartRef?.nativeElement, {
      type: 'bar',
      data: {
        labels: this.data.cityHall.question.map((obj: any) => obj.id),
        datasets:[
          {
            label: 'MUNICIPIO',
            data: [85, 79, 20 ,21 ,45 ,65 ,78 ,98, 65 ,45],
            borderColor: '#333',
            backgroundColor: '#179be0',
            borderWidth: 1
          },
        ]
      }
    })


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
}
