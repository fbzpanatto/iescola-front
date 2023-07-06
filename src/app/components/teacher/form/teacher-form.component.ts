import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AutoFocusDirective} from "../../../shared/directives/auto-focus.directive";
import {FormBuilder, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatInputModule} from "@angular/material/input";
import {MatNativeDateModule} from "@angular/material/core";
import {FormService} from "../../../shared/services/form.service";
import {combineLatest, map, Observable, Subscription} from "rxjs";
import {PopupService} from "../../../shared/components/popup/popup.service";
import {ActivatedRoute} from "@angular/router";
import {FetchDataService} from "../../../shared/services/fetch-data.service";
import {MatTooltipModule} from "@angular/material/tooltip";
import {Classroom, Discipline, PopupOptions} from "../../../shared/interfaces/interfaces";

const COMPONENT_IMPORTS = [CommonModule, AutoFocusDirective, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatTooltipModule]

const HEADERS: { [key: string]: any } = {
  discipline: [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Disciplina' }
  ],
  classroom: [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Sala' },
    { key: 'school', label: 'Escola' }
  ]
}

const ID = 'id'

interface DATA {
  birthDate: string,
  name: string,
  teacherClasses: any,
  teacherDisciplines: any
}

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [COMPONENT_IMPORTS],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class TeacherFormComponent implements OnInit, OnDestroy {

  private _id?: number

  private classes: Classroom[] = []
  private disciplines: Discipline[] = []

  @ViewChild(FormGroupDirective) private formDir!: FormGroupDirective
  formService = inject(FormService)

  private subscription?: Subscription

  form = this.fb.group({
    name: ['', {
      validators: [Validators.required],
    }],
    birthDate: ['', {
      validators: [Validators.required],
    }],
    disciplinesName: ['', {
      validators: [Validators.required],
    }],
    classesName: ['', {
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

    this.formService.originalValues = this.form.value

    this.startForm()
  }

  startForm() {

    let subscription: Subscription | undefined

    subscription = combineLatest([
      this.fetch.all('classroom') as Observable<Classroom[]>,
      this.fetch.all('discipline') as Observable<Discipline[]>,
    ])
      .pipe(
      map(([classrooms, disciplines]) => {
        this.classes = classrooms
        this.disciplines = disciplines
      })
    )
      .subscribe(() => {
        let param = this.route.snapshot.params['command']
        !(isNaN(param)) ? this.pathFormValues(param) : this.newForm()
      })

    this.subscription?.add(subscription)
  }

  onSubmit() {

    if(this.id) {
      this.sendDataToDB()
      return
    }

    this.createNewData()
  }

  delete() {
    //TODO: implementar
  }

  openDisciplinesOptions() {

    let selectedDisciplines: any = this.form.value.teacherDisciplines

    if(!selectedDisciplines?.length) { selectedDisciplines = [] }

    const popupOptions: PopupOptions = {
      url: 'discipline',
      headers: HEADERS['discipline'],
      fetchedData: [...this.disciplines],
      alreadySelected: [...selectedDisciplines],
      multipleSelection: true,
    }

    let subscription: Subscription

    subscription = this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {

        if (result !== undefined) {

          this.setInputValue('disciplinesName', result)
          this.form.controls.teacherDisciplines.patchValue(result.map((item: { [key: string]: any }) => item[ID]))
        }
      })

    this.subscription?.add(subscription)

  }

  openClassesOptions() {

    let selectedClasses: any = this.form.value.teacherClasses

    if(!selectedClasses?.length) { selectedClasses = [] }

    const popupOptions: PopupOptions = {
      url: 'classroom',
      headers: HEADERS['classroom'],
      fetchedData: [...this.classes],
      alreadySelected: [...selectedClasses],
      multipleSelection: true
    }

    let subscription: Subscription

    subscription = this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {

        if (result !== undefined) {

          this.setInputValue('classesName', result)
          this.form.controls.teacherClasses.patchValue(result.map((item: { [key: string]: any }) => item[ID]))

          // const selectedClasses = result.map((item: { [key: string]: any }) => item[ID])
          // const selectedFormClasses = this.formService.originalValues.teacherClasses
          //
          // if(selectedClasses.length > 0 && !selectedClasses.every((item: any) => selectedFormClasses.includes(item)) ) {
          //   this.setInputValue('classesName', result)
          //   this.form.controls.teacherClasses.patchValue(result.map((item: { [key: string]: any }) => item[ID]))
          // }
        }
      })

    this.subscription?.add(subscription)
  }

  setInputValue(inputName: string, data: any) {
    const control = this.form.get(inputName)

    control?.patchValue(data.map((item: any) => item.name).join(', '))
    control?.markAsDirty()
    control?.markAsTouched()
  }

  resetForm() {
    this.formDir.resetForm(this.formService.originalValues);
  }

  private pathFormValues(id: number) {

    this.id = id

    let subscription: Subscription

    subscription = this.fetch.getOneData<DATA>('teacher', id)
      .subscribe((data: DATA) => {

        this.form.patchValue({
          name: data.name,
          birthDate: data.birthDate,
          teacherClasses: data.teacherClasses.map((item: Classroom) => item.id),
          teacherDisciplines: data.teacherDisciplines.map((item: Discipline) => item.id)
        })

        this.setInputValue('classesName', data.teacherClasses)
        this.setInputValue('disciplinesName', data.teacherDisciplines)

        this.form.markAsPristine()
        this.form.markAsUntouched()

        this.formService.originalValues = this.form.value
      })

    this.subscription?.add(subscription)
  }

  sendDataToDB() {

    let subscription: Subscription

    const body = {
      name: this.form.controls.name.value,
      birthDate: this.form.controls.birthDate.value,
      teacherClasses: this.form.controls.teacherClasses.value,
      teacherDisciplines: this.form.controls.teacherDisciplines.value,
    }

    subscription = this.fetch.updateOneDataWithId('teacher', this.id as number, body)
      .subscribe((data: any) => {
        if(data) {
          this.formService.originalValues = this.form.value
          this.formDir.resetForm(this.formService.originalValues)
        }
      })

    this.subscription?.add(subscription)
  }

  private newForm() {
    this.formDir.resetForm(this.formService.originalValues)
  }

  createNewData() {

    let subscription: Subscription

    const body = {
      name: this.form.controls.name.value,
      birthDate: this.form.controls.birthDate.value,
      teacherClasses: this.form.controls.teacherClasses.value,
      teacherDisciplines: this.form.controls.teacherDisciplines.value,
    }

    subscription = this.fetch.createOneData('teacher', body)
      .subscribe((data: any) => {
        if(data) { this.resetForm() }
      })

    this.subscription?.add(subscription)
  }

  get id() {
    return this._id
  }

  set id(value: number | undefined) {
    this._id = value
  }
}
