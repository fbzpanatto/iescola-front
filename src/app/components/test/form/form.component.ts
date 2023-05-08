import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { FetchDataService } from "src/app/shared/services/fetch-data.service";
import { combineLatest, map, Observable } from "rxjs";
import {Bimester, Discipline, PopupOptions, Questions, TestCategory, Year} from "src/app/shared/interfaces/interfaces";
import { ActivatedRoute } from "@angular/router";
import { PopupService } from "src/app/shared/services/popup.service";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";

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
      this.fetch.all('discipline') as Observable<Discipline[]>,
      this.fetch.all('test-category') as Observable<TestCategory[]>,
      this.fetch.all('bimester') as Observable<Bimester[]>,
      this.fetch.all('year') as Observable<Year[]>,
      ]
    )
      .pipe(
        map(([disciplines, testCategories, bimesters, years]) => {
          this.disciplines = disciplines
          this.testCategories = testCategories
          this.bimesters = bimesters
          this.years = years
        })
      )
      .subscribe(() => {
        let param = this.route.snapshot.params['command']
        !(isNaN(param)) ? this.updateForm(param) : null
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

        this.teacherName = data.teacherPerson.person.name
      })
  }

  openOptions(formControlName: string, url?: string) {

    const popupOptions: PopupOptions = { url: url, headers: HEADERS[formControlName] }

    this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) { this.form.get(formControlName)?.setValue(result)}
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
      id: ['', Validators.required],
      answer: ['', Validators.required]
    });

    this.questions.push(questionForm);
  }

  removeQuestion(questionIndex: number) {

    this.questions.removeAt(questionIndex);
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
