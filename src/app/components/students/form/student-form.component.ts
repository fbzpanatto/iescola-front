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
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";

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
  })

  private _classrooms?: {[key: string]: any}[];
  private subscription?: Subscription

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

    let observable: Subscription

    observable = combineLatest([
      this.fetch.all('classroom') as Observable<{[key: string]: any}[]>,
    ]).pipe(
      map(([classrooms]) => {
        this.classrooms = classrooms
      })
    ).subscribe(() => {
      let param = this.route.snapshot.params['command']
      !(isNaN(param)) ? this.updateForm(param) : this.newForm()
    })

    this.subscription?.add(observable)
  }

  onSubmit() {

  }

  private updateForm(id: number) {

    let observable: Subscription

    this.id = id

    observable = this.fetch.getOneData('student', id)
      .subscribe((data: any) => {

        this.form.patchValue({
          name: data.name,
          ra: data.ra,
          classroom: data.classroom,
        })
      })

    this.subscription?.add(observable)
  }

  private newForm() {

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
