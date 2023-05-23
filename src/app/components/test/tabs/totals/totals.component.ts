import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto'
import { ActivatedRoute, Router } from "@angular/router";
import { BasicComponent } from "../../../../shared/components/basic/basic.component";
import { FetchDataService } from "../../../../shared/services/fetch-data.service";
import { NavigationService } from "../../../../shared/services/navigation.service";


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
export class TotalsComponent extends BasicComponent implements OnInit {

  static title = CONFIG.title
  static url = CONFIG.url

  @ViewChild('chart', { static: true }) private chartRef?: ElementRef;

  private _testIdParam: string = ''
  private _classIdParam: string = ''

  constructor(
    router: Router,
    route: ActivatedRoute,
    fetchData: FetchDataService,
    navigationService: NavigationService) {
    super(router, route, fetchData, navigationService);
  }

  ngOnInit(): void {

    this.start()

    new Chart(this.chartRef?.nativeElement, {
      type: 'bar',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7','8', '9', '10', '11', '12'],
        datasets:[
          {
            label: 'MUNICIPIO',
            data: [85, 79, 20 ,21 ,45 ,65 ,78 ,98, 65 ,45 ,12 ,18],
            borderColor: '#333',
            backgroundColor: '#179be0',
            borderWidth: 1
          },
          {
            label: '5A',
            data: [85, 79, 20 ,21 ,45 ,65 ,78 ,98, 65 ,45 ,12 ,18],
            borderColor: '#333',
            backgroundColor: '#3cba9f',
            borderWidth: 1
          },
          {
            label: '5B',
            data: [100, 102, 101 ,98 ,45 ,80 ,200 ,250, 70 ,80 ,40 ,10],
            borderColor: '#333',
            backgroundColor: '#ffcc00',
            borderWidth: 1
          }
        ]
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
    this.basicGetQueryData(`${TotalsComponent.url}/analyzes`, 'classroom=' + params.classId + '&' + 'test=' + params.testId)
      .subscribe((data: any) => {
        console.log(data)
      })
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
