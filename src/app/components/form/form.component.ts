import { Component } from '@angular/core';
import { BasicComponent } from "../basic/basic.component";
import {ActivatedRoute, Router} from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";


@Component({
  standalone: true,
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BasicComponent {

  constructor( route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService, router: Router) {
    super(router, route, fetchData, navigationService);
  }

  override ngOnInit(): void {

    const parentRouter = this.router.url.split('/').shift()
    console.log(parentRouter)

    this.route.params.subscribe((params) => {
      console.log(params)
    })

  }

}
