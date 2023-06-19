import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupService } from "../../../shared/services/popup.service";
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { FetchDataService } from "../../../shared/services/fetch-data.service";
import { combineLatest, map, Observable, Subscription } from "rxjs";
import { AutoFocusDirective } from "../../../shared/directives/auto-focus.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { PopupOptions } from "../../../shared/interfaces/interfaces";

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
  imports: [CommonModule, AutoFocusDirective, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule],
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
    classroom: ['', {
      validators: [Validators.required],
    }],
    order: ['', {
      validators: [Validators.required],
    }],
    birthDate: ['', {
      validators: [Validators.required],
    }],
  })

  private _classrooms?: {[key: string]: any}[];
  private subscription?: Subscription
  private _className?: string;

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

    let subscription: Subscription | undefined

    this.startForm()

    subscription = this.form.get('classroom')?.valueChanges
      .subscribe((value: any) => { this.className = `${value.name + ' ' + value.school.slice(0, 20)}` ?? '' })

    this.subscription?.add(subscription)
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
      classroom: { id: classroom },
    }

    this.fetch.createOneData('student', body)
      .subscribe((data: any) => {
        if(data) {
          this.form.reset()
        }
      })
  }

  private updateData() {

    const body = {
      id: this.id,
      name: this.form.value.name,
      ra: this.form.value.ra,
      order: this.form.value.order,
      birthDate: this.form.value.birthDate,
    }

    this.fetch.updateOneDataWithId('student', this.id as number, body)
      .subscribe((data: any) => {
        if(data) {}
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
        })

        this.classrooms?.find((classroom: any) => {
          if (classroom.id === data.classroom.id) {
            this.form.controls.classroom.setValue(classroom)
          }
        })
      })

    this.subscription?.add(subscription)
  }

  openClassesOptions() {

    const popupOptions: PopupOptions = {
      url: 'classroom',
      headers: HEADERS['classroom'],
      fetchedData: this.classrooms,
    }

    this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((data: any) => {
        if (data) {
          this.form.controls.classroom.setValue(data)
        }
      })
  }

  private newForm() {
  //   TODO: include category on body before send
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

  get className(){
    return this._className
  }

  set className(value: string | undefined){
    this._className = value
  }

  delete() {

  }
}
