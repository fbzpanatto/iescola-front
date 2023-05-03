import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {tap} from "rxjs";
import {FetchDataService} from "../../../shared/services/fetch-data.service";

@Component({
  standalone: true,
  selector: 'app-test-edit',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.scss']
})
export class EditTest implements OnInit {

  static title = 'Editar teste'
  static url = 'test'

  private _testId: string = ''

  constructor(
    private route: ActivatedRoute,
    private fetchData: FetchDataService,
  ) {}

  ngOnInit(): void {

    this.start()

  }

  start() {
    this.route.params
      .pipe(tap( params => this.testId = params['id']))
      .subscribe(params => {
        this.createOrEditTest()
      })
  }

  createOrEditTest() {
    this.fetchData.getOneData(EditTest.url, parseInt(this.testId))
  }

  get testId(): string {
    return this._testId;
  }

  set testId(value: string) {
    this._testId = value;
  }



}
