import { Component } from '@angular/core';
import { BasicComponent } from "../basic/basic.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FetchDataService } from "../../services/fetch-data.service";
import { NavigationService } from "../../services/navigation.service";

const CREATE = 'new'
const COMMAND = 'command'


@Component({
  standalone: true,
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BasicComponent {

  private isNew: boolean = false;

  constructor( route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService, router: Router) {
    super(router, route, fetchData, navigationService);
  }

  override ngOnInit(): void {

    this.route.params.subscribe((params) => {
      if(params[COMMAND] === CREATE) {
        this.isNew = !this.isNew
        console.log('new')
        return
      }
      console.log('edit')

    })

  }

}
