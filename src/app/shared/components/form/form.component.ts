import {AfterContentInit, Component, OnInit} from '@angular/core';
import { BasicComponent } from "../basic/basic.component";
import { ActivatedRoute, Router } from "@angular/router";
import { FetchDataService } from "../../services/fetch-data.service";
import { NavigationService } from "../../services/navigation.service";
import { CommonModule, JsonPipe } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MODELS } from "./models";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { PopupComponent } from "../popup/popup.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";

const CREATE = 'new'
const COMMAND = 'command'

@Component({
  standalone: true,
  selector: 'app-form',
  templateUrl: './form.component.html',
  imports: [
    JsonPipe,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
    MatDialogModule
  ],
  styleUrls: ['./form.component.scss']
})
export class FormComponent extends BasicComponent implements OnInit, AfterContentInit {

  private isNew: boolean = false;
  private _id: number | undefined
  element: any

  form = new FormGroup({})
  state:boolean = false;

  private _controls: any[] = []

  formUrl: string = ''

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    route: ActivatedRoute,
    fetchData: FetchDataService,
    navigationService: NavigationService,
    router: Router
  ) {
    super(router, route, fetchData, navigationService);
  }

  ngOnInit(): void {

    this.formUrl = this.route.parent?.snapshot.url[0].path as string

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

  ngAfterContentInit(): void {
    this.startForm().then(r => {this.state = r})
  }

  startForm() {

    const {controls} = MODELS.find((model) => model.url === this.formUrl)!

    return new Promise<boolean>((resolve) => {

      this.form = new FormGroup({})

      for(let element of controls!) {

        const control = this.fb.control(element.value)
        this.form.addControl(element.key, control)
      }

      this.controls = controls!

      resolve(true)

    })
  }

  getElement(): Promise<boolean> {

    return new Promise((resolve) => {

      this.basicGetOneData(this.formUrl, Number(this.id))
        .subscribe((data: any) => {
          this.element = data

          for(let prop in this.element) {
            if(this.form.get(prop)) {
              this.form.get(prop)?.setValue(this.element[prop])
              if(this.element[prop].id) {
                this.form.get(prop)?.setValue(this.element[prop].id)
              }
            }
          }
          resolve(true)
        })
    })
  }

  get id() {
    return this._id
  }

  set id(id: number | undefined) {
    this._id = id
  }

  get controls() {
    return this._controls
  }

  set controls(controls) {
    this._controls = controls
  }

  openDialog(control: {[key: string]: any}) {

    const { url, headers } = control

    const dialogRef = this.dialog.open(PopupComponent, {
      width: '400px',
      data: { url, headers },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });

  }
}
