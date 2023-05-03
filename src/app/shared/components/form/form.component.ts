import { Component, Input } from '@angular/core';
import { BasicComponent } from "../basic/basic.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FetchDataService } from "../../services/fetch-data.service";
import { NavigationService } from "../../services/navigation.service";
import {JsonPipe} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

const CREATE = 'new'
const COMMAND = 'command'

@Component({
  standalone: true,
  selector: 'app-form',
  templateUrl: './form.component.html',
  imports: [
    JsonPipe,
    MatFormFieldModule,
    MatInputModule
  ],
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BasicComponent {

  private isNew: boolean = false;
  private _id: number | undefined
  private _element: any

  @Input() _originalControls: {} | undefined
  @Input() _formUrl: string = ''

  constructor( route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService, router: Router) {
    super(router, route, fetchData, navigationService);
  }

  override ngOnInit(): void {

    this.route.params.subscribe((params) => {

      if(params[COMMAND] === CREATE) {
        this.isNew = !this.isNew
        this.setBarTitle({title: 'Novo Teste'})
        return
      }

      this.id = params[COMMAND]
      this.setBarTitle({title: 'Editar Teste'})
      this.getElement()

    })

  }

  override ngAfterViewInit() {
    console.log(this.originalControls)
  }

  getElement<T>() {
    this.basicGetOneData<T>(this.formUrl, Number(this.id))
      .subscribe((data) => { this.element = data })
  }

  get originalControls() {
    return this._originalControls
  }

  get element() {
    return this._element
  }

  set element(element: any ) {
    this._element = element
  }

  get formUrl() {
    return this._formUrl
  }

  get id() {
    return this._id
  }

  set id(id: number | undefined) {
    this._id = id
  }

}
