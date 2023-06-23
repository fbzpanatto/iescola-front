import { Component,OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule } from "@angular/material/menu";
import { Observable } from "rxjs";
import { FetchDataService } from "../../services/fetch-data.service";
import { CurrentYearService } from "./current-year.service";

@Component({
  selector: 'app-year',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatMenuModule],
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit, OnDestroy {

  years$?: Observable<any>
  currentYear$?: Observable<any>

  constructor(private fetchData: FetchDataService, private yearService: CurrentYearService) {}

  ngOnInit(): void {

    this.years$ = this.yearService.years$
    this.currentYear$ = this.yearService.currYear$

  }

  ngOnDestroy(): void {
  }

  setYear(event: {[p: string]: any}) {
    this.yearService.next(event)
  }
}
