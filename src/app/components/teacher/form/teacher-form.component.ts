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

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [COMPONENT_IMPORTS],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class TeacherFormComponent implements OnInit, OnDestroy {

  private _id?: number

  private classes: any[] = []
  private disciplines: any[] = []

  private _classesName?: string
  private _disciplinesName?: string

  formService = inject(FormService)

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
  private classesNameBefore: string | undefined;
  private disciplinesNameBefore: string | undefined;

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

  delete() {

  }

  get id() {
    return this._id
  }

  set id(value: number | undefined) {
    this._id = value
  }

  openDisciplinesOptions() {

    let selectedDisciplines: any = this.form.value.teacherDisciplines

    if(!selectedDisciplines?.length) { selectedDisciplines = [] }

    const popupOptions: PopupOptions = {
      url: 'discipline',
      headers: HEADERS['discipline'],
      fetchedData: [...this.disciplines],
      multipleSelection: true,
      alreadySelected: selectedDisciplines
    }

    let subscription: Subscription

    subscription = this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.disciplinesName = result.map((item: any) => item.name).join(', ')
          let mappedResult = result.map((item: any) => item.id)
          this.form.controls.teacherDisciplines.patchValue(mappedResult)
        }
      })

    this.subscription?.add(subscription)

  }

  resetForm() {

    if(this.id) {
      this.disciplinesName = this.disciplinesNameBefore
      this.classesName = this.classesNameBefore
      this.formDir.resetForm(this.formService.originalValues);

      return
    }

    this.classesName = ''
    this.disciplinesName = ''
    this.form.reset()
    this.form.controls.teacherClasses.reset()
    this.form.controls.teacherDisciplines.reset()
    this.formDir.resetForm(this.formService.originalValues);
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

          this.classesName = result.map((item: any) => item.name).join(', ')
          let mappedResult = result.map((item: any) => item.id)

          this.form.controls.teacherClasses.patchValue(mappedResult)
        }
      })

    this.subscription?.add(subscription)
  }

  get disciplinesName(){
    return this._disciplinesName
  }

  set disciplinesName(value: string | undefined){
    this._disciplinesName = value
  }

  get classesName(){
    return this._classesName
  }

  set classesName(value: string | undefined){
    this._classesName = value
  }

  private updateForm(id: number) {

    this.id = id

    let subscription: Subscription

    subscription = this.fetch.getOneData('teacher', id)
      .subscribe((data: any) => {

        this.form.patchValue({
          name: data.name,
          birthDate: data.birthDate,
          teacherClasses: data.teacherClasses.map((item: any) => item.id),
          teacherDisciplines: data.teacherDisciplines.map((item: any) => item.id)
        })

        this.classesName = data.teacherClasses.map((item: any) => item.name).join(', ')
        this.disciplinesName = data.teacherDisciplines.map((item: any) => item.name).join(', ')

        this.classesNameBefore = this.classesName
        this.disciplinesNameBefore = this.disciplinesName

        this.formService.originalValues = this.form.value
      })

    this.subscription?.add(subscription)
  }

  updateData() {

      let subscription: Subscription

      const body = {
        name: this.form.controls.name.value,
        birthDate: this.form.controls.birthDate.value,
        // teacherClasses: this.form.controls.teacherClasses.value,
        // teacherDisciplines: this.form.controls.teacherDisciplines.value,
      }

      subscription = this.fetch.updateOneDataWithId('teacher', this.id as number, body)
        .subscribe((data: any) => {
          if(data) {
            this.formService.originalValues = this.form.value
            this.classesNameBefore = this.classesName
            this.disciplinesNameBefore = this.disciplinesName
          }
        })

      this.subscription?.add(subscription)
  }

  private newForm() {
    this.formDir.resetForm(this.formService.originalValues)
    this.form.reset()
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
}
