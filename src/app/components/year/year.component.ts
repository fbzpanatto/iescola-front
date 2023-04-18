import { Component, OnInit } from '@angular/core';
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";

@Component({
  standalone: true,
  selector: 'app-year',
  templateUrl: './year.component.html',
  styleUrls: ['./year.component.scss']
})
export class YearComponent implements OnInit {

  static title = 'Anos Letivos'
  static url = 'year'

  constructor(
    private fetchData: FetchDataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {

    this.navigationService.setActiveComponent({title: YearComponent.title, url: YearComponent.url});

    this.fetchData.getAllData()
      .subscribe(data => {
        console.log(data)
    })
  }
}
