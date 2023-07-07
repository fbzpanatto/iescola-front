import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from "../../../shared/components/popup/popup.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FetchDataService } from "../../../shared/services/fetch-data.service";
import {catchError, combineLatest, map, Observable, of, Subscription} from "rxjs";
import { AutoFocusDirective } from "../../../shared/directives/auto-focus.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { PopupOptions } from "../../../shared/interfaces/interfaces";
import { FormService } from "../../../shared/services/form.service";

const COMPONENT_IMPORTS = [CommonModule, AutoFocusDirective, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule]

const HEADERS: { [key: string]: any } = {
  classroom: [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Sala' },
    { key: 'school', label: 'Escola' }
  ]
}

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: COMPONENT_IMPORTS,
  templateUrl: './student-form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class StudentFormComponent implements OnInit, OnDestroy {

  private _id?: number

  form = this.fb.group({
    name: ['', {
      validators: [Validators.required],
    }],
    ra: ['', {
      validators: [Validators.required],
    }],
    dv: ['', {
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(1)],
    }],
    state: ['', {
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
    }],
    classroom: ['', {
      validators: [Validators.required],
    }],
    className: ['', {
      validators: [Validators.required],
    }],
    order: ['', {
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(2)],
    }],
    birthDate: ['', {
      validators: [Validators.required],
    }],
  })

  private _classrooms?: {[key: string]: any}[];
  private subscription?: Subscription

  private formService = inject(FormService)

  @ViewChild(FormGroupDirective) private formDir!: FormGroupDirective

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

    this.startForm()
  }

  startForm() {

    let subscription: Subscription

    subscription = combineLatest([
      this.fetch.all('classroom') as Observable<{[key: string]: any}[]>,
    ]).pipe(
      map(([classrooms]) => {
        this.classrooms = classrooms
      })
    ).subscribe(() => {
      let param = this.route.snapshot.params['command']
      !(isNaN(param)) ? this.updateForm(param) : this.newForm()
    })

    this.subscription?.add(subscription)
  }

  onSubmit() {

    if(this.id) {
      this.updateData()
      return
    }

    this.createNewData()
  }

  createNewData() {
    const classroom = (this.form.value.classroom as any).id

    const body = {
      name: this.form.value.name,
      ra: this.form.value.ra,
      order: this.form.value.order,
      birthDate: this.form.value.birthDate,
      dv: this.form.value.dv,
      state: this.form.value.state,
      classroom: { id: classroom },
    }

    this.fetch.createOneData('student', body)
      .subscribe((data: any) => {
        if(data) {
          this.resetForm()
        }
      })
  }

  resetForm() {
    this.formDir.resetForm(this.formService.originalValues);
  }

  private updateData() {

    interface Body {
      id: number,
      name: string,
      ra: string,
      order: string,
      birthDate: string,
      classroom?: { id: number },
      dv: string,
      state: string,
    }

    const body: Body = {
      id: this.id as number,
      name: this.form.value.name as string,
      ra: this.form.value.ra as string,
      order: this.form.value.order as string,
      birthDate: this.form.value.birthDate as string,
      classroom: { id: (this.form.value.classroom as any).id } as { id: number },
      dv: this.form.value.dv as string,
      state: this.form.value.state as string,
    }

    if(Number(this.formService.originalValues.classroom.id) === Number(body.classroom?.id)) {
      delete body.classroom
    } else {
      this.formService.originalValues.classroom = body.classroom
    }

    this.fetch.updateOneDataWithId('student', this.id as number, body)
      .pipe(
        catchError((err: any) => {
          console.log('err', err)
          return of(null)
        }),
      )
      .subscribe({
        next: (data: any) => {
          if(data) {
            this.formService.originalValues = this.form.value
            this.formDir.resetForm(this.formService.originalValues)
          }
        },
        error: (err: any) => {
          console.log(err)
        }
      })
  }

  private updateForm(id: number) {

    let subscription: Subscription

    this.id = id

    subscription = this.fetch.getOneData('student', id)
      .subscribe((data: any) => {

        this.form.patchValue({
          name: data.name,
          ra: data.ra,
          order: data.order,
          birthDate: data.birthDate,
          dv: data.dv,
          state: data.state,
        })

        this.classrooms?.find((classroom: any) => {
          if (classroom.id === data.classroom.id) {
            this.form.controls.classroom.patchValue(classroom)
            this.form.controls.className.patchValue(`${classroom.name + ' ' + classroom.school.slice(0, 30)}` ?? '')
          }
        })

        this.formService.originalValues = this.form.value
      })

    this.subscription?.add(subscription)
  }

  openClassesOptions() {

    const popupOptions: PopupOptions = {
      url: 'classroom',
      headers: HEADERS['classroom'],
      fetchedData: this.classrooms,
    }

    let subscription: Subscription

     subscription = this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {

          this.form.controls.className.patchValue(`${data.name + ' ' + data.school.slice(0, 30)}` ?? '')

          this.form.controls.classroom.setValue(data)
          this.form.controls.classroom.markAsDirty()
          this.form.controls.classroom.markAsTouched()
        }
      })

    this.subscription?.add(subscription)
  }

  private newForm() {
    this.formService.originalValues = this.form.value
  }

  get id() {
    return this._id
  }

  set id(value: number | undefined) {
    this._id = value
  }

  get classrooms(): {[key: string]: any}[] | undefined {
    return this._classrooms
  }

  set classrooms(value: {[key: string]: any}[] | undefined) {
    this._classrooms = value
  }

  delete() {

  }
}
