import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutoFocusDirective} from "../../../shared/directives/auto-focus.directive";
import {FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {FormService} from "../../../shared/services/form.service";
import {Subscription} from "rxjs";
import {PopupService} from "../../../shared/components/popup/popup.service";
import {ActivatedRoute} from "@angular/router";
import {FetchDataService} from "../../../shared/services/fetch-data.service";

const COMPONENT_IMPORTS = [CommonModule, AutoFocusDirective, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule]

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [COMPONENT_IMPORTS],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class TeacherFormComponent implements OnInit, OnDestroy {

  private _id?: number

  private formService = inject(FormService)

  @ViewChild(FormGroupDirective) private formDir!: FormGroupDirective

  private subscription?: Subscription

  form = this.fb.group({
    name: ['', {
      validators: [Validators.required],
    }],
    birthDate: ['', {
      validators: [Validators.required],
    }],
    teacherClasses: ['', {
      validators: [Validators.required],
    }],
    teacherDisciplines: ['', {
      validators: [Validators.required],
    }],
  })

  constructor(
    private popupService: PopupService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fetch: FetchDataService,
  ) {}

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }

  ngOnInit(): void {
  }

  onSubmit() {

  }

  resetForm() {

  }

  delete() {

  }

  get id() {
    return this._id
  }

  set id(value: number | undefined) {
    this._id = value
  }
}
