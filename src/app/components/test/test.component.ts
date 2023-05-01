import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";
import { Subscription } from "rxjs";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { CommonModule } from "@angular/common";
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, MatButtonModule, MatIconModule, RouterLink],
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['../../shared/styles/table.scss']
})
export class TestComponent implements OnInit, OnDestroy {

  static title = 'Testes'
  static url = 'test'
  static icon = 'quiz'

  private _listSubscription: Subscription = new Subscription()

  private _tests: TestClasses[] = []

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

  get tests() {
    return this._tests
  }

}
