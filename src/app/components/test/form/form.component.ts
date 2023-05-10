import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { FetchDataService } from "src/app/shared/services/fetch-data.service";
import { combineLatest, map, Observable } from "rxjs";
import { Bimester, Discipline, PopupOptions, Questions, TestCategory, Year } from "src/app/shared/interfaces/interfaces";
import { ActivatedRoute } from "@angular/router";
import { PopupService } from "src/app/shared/services/popup.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

const HEADERS: { [key: string]: any } = {
  teacher: [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Professor' }
  ],
  questions: [
    { key: 'id', label: 'Questão' },
    { key: 'answer', label: 'Gabarito' }
  ]
}

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class FormComponent implements OnInit {

  private _id?: number

  private _counter = 1

  private _teacherName = ''
  private _disciplines?: Discipline[]
  private _testCategories?: TestCategory[]
  private _bimesters?: Bimester[]
  private _years?: Year[]

  form = this.fb.group({
    name: ['', {
      validators: [Validators.required],
    }],
    testCategory: ['', {
      validators: [Validators.required],
    }],
    discipline: ['', {
      validators: [Validators.required],
    }],
    year: ['', {
      validators: [Validators.required],
    }],
    bimester: ['', {
      validators: [Validators.required],
    }],
    teacher: ['', {
      validators: [Validators.required],
    }],
    questions: this.fb.array([], {
      validators: [Validators.required],
    })
  })

  constructor(
    private popupService: PopupService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fetch: FetchDataService,
  ) {}

  ngOnInit(): void {

    this.startForm()

    this.form.get('teacher')?.valueChanges
      .subscribe((value: any) => { this.teacherName = value.name ?? '' })
  }

  startForm() {

    combineLatest([
      this.fetch.all('test-category') as Observable<TestCategory[]>,
      this.fetch.all('bimester') as Observable<Bimester[]>,
      this.fetch.all('year') as Observable<Year[]>,
      ]
    )
      .pipe(
        map(([testCategories, bimesters, years]) => {
          this.testCategories = testCategories
          this.bimesters = bimesters
          this.years = years
        })
      )
      .subscribe(() => {
        let param = this.route.snapshot.params['command']
        !(isNaN(param)) ? this.updateForm(param) : this.newForm()
      })

  }

  updateForm(id: number) {

    this.id = id

    this.fetch.getOneData('test', id)
      .subscribe((data: any) => {

        this.form.patchValue({
          name: data.name,
          testCategory: data.category.id,
          discipline: data.discipline.id,
          year: data.year.id,
          bimester: data.bimester.id,
          teacher: data.teacherPerson.id,
          questions: this.updateQuestions(data.questions)
        })

        this.disciplines = data.teacherDisciplines as Discipline[]
        this.teacherName = data.teacherPerson.person.name
        this._counter = data.questions.length + 1
      })
  }

  newForm() {
    this.form.controls.discipline.setValue(null);
    this.form.controls.discipline.disable()
  }

  openTeacherOptions() {

    const popupOptions: PopupOptions = { url: 'teacher', headers: HEADERS['teacher'] }

    this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.disciplines = result.teacherDisciplines as Discipline[]
          this.form.controls.teacher.setValue(result)
          this.form.controls.discipline.enable()
        }
      })
  }

  updateQuestions(questions: Questions[]) {
    return questions.map(question => {
      this.addQuestion(question)
      return question
    })
  }

  addQuestion(question?: Questions) {

    if(question) {
      const questionForm = this.fb.group({
        id: [question.id, Validators.required],
        answer: [question.answer, Validators.required]
      });

      this.questions.push(questionForm);
      return
    }

    const questionForm = this.fb.group({
      id: new FormControl<number | null>(this._counter ++, Validators.required),
      answer: new FormControl<string | null>('', Validators.required)
    });

    this.questions.push(questionForm);
  }

  removeQuestion(questionIndex: number) {

    const index = (this.questions.length - 1) as number
    this._counter = this.questions.controls[index].get('id')?.value

    this.questions.controls.slice(questionIndex + 1).forEach((question: any) => {
      question.get('id')?.setValue(question.get('id')?.value - 1)
    })

    this.questions.removeAt(questionIndex);

    this.questions.length === 0 ? this._counter = 1 : null
  }

  get questions() {
    return this.form.get('questions') as FormArray
  }

  get id() {
    return this._id
  }

  set id(value: number | undefined) {
    this._id = value
  }

  get disciplines() {
    return this._disciplines
  }

  set disciplines(value: Discipline[] | undefined) {
    this._disciplines = value
  }

  get testCategories() {
    return this._testCategories
  }

  set testCategories(value: TestCategory[] | undefined) {
    this._testCategories = value
  }

  get bimesters() {
    return this._bimesters
  }

  set bimesters(value: Bimester[] | undefined) {
    this._bimesters = value
  }

  get years() {
    return this._years
  }

  set years(value: Year[] | undefined) {
    this._years = value
  }

  get teacherName(){
    return this._teacherName
  }

  set teacherName(value: string){
    this._teacherName = value
  }
}
