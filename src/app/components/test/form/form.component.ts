import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { FetchDataService } from "src/app/shared/services/fetch-data.service";
import { combineLatest, map, Observable } from "rxjs";
import { Bimester, Classroom, Discipline, PopupOptions, Questions, TestCategory, Year } from "src/app/shared/interfaces/interfaces";
import { ActivatedRoute } from "@angular/router";
import { PopupService } from "src/app/shared/services/popup.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AutoFocusDirective } from "../../../shared/directives/auto-focus.directive";

const HEADERS: { [key: string]: any } = {
  teacher: [
    { key: 'id', label: 'Id' },
    { key: 'name', label: 'Professor' }
  ],
  classroom: [
    { key: 'id', label: '#' },
    { key: 'name', label: 'Sala' },
    { key: 'school', label: 'Escola' }
  ]
}

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule, AutoFocusDirective],
  templateUrl: './form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class FormComponent implements OnInit {

  private _id?: number

  private _counter = 1
  private _teacherName = ''
  private _classesName: string = ''

  private _classes?: Classroom[]
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
    testClasses: ['', {
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
          teacher: data.teacher.id,
          questions: this.updateQuestions(data.questions)
        })

        this.form.controls.testClasses.setValue(data.testClasses.map((item: any) => item.id))

        this.form.controls.testClasses.disable()
        this.form.controls.discipline.disable()
        this.form.controls.testCategory.disable()
        this.form.controls.bimester.disable()
        this.form.controls.year.disable()

        this.classes = data.teacher.classes as Classroom[]
        this.classesName = data.testClasses.map((item: any) => item.name).join(', ')
        this.disciplines = data.teacher.disciplines as Discipline[]
        this.teacherName = data.teacher.person.name

        this.selectedClasses(data.teacher.classes, data.testClasses)

        this._counter = data.questions.length + 1
      })
  }

  newForm() {
    this.form.controls.testClasses.setValue(null);
    this.form.controls.discipline.setValue(null);

    this.form.controls.testClasses.disable()
    this.form.controls.discipline.disable()
  }

  selectedClasses(allClasses: Classroom[], selectedClasses: Classroom[]) {
    allClasses.forEach(item1 => {
      selectedClasses.find((item2) => {
        if(item2.id === item1.id) {
          item1.selected = true
        }
      })
    });
    this.classes = allClasses
  }

  openClassesOptions() {

    const condition = this.form.controls.testClasses.disabled

    if (condition) return

    const popupOptions: PopupOptions = {
      url: 'teacher',
      headers: HEADERS['classroom'],
      fetchedData: this.classes,
      multipleSelection: true,
      alreadySelected: this.form.controls.testClasses.value
    }

    this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {
        if (result) {
          this.classesName = result.map((item: any) => item.name).join(', ')
          let mappedResult = result.map((item: any) => item.id)
          this.form.controls.testClasses.setValue(mappedResult)
        }
      })
  }

  openTeacherOptions() {

    if(this.id) {
      return
    }

    const popupOptions: PopupOptions = { url: 'teacher', headers: HEADERS['teacher'] }

    this.popupService.openPopup(popupOptions)
      .afterClosed()
      .subscribe((result: any) => {
        if (result != undefined) {

          this.disciplines = result.teacherDisciplines as Discipline[]
          this.classes = result.teacherClasses as Classroom[]

          this.form.controls.teacher.setValue(result)
          this.form.controls.discipline.enable()
          this.form.controls.testClasses.enable()
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

    let dontAllowEmpty = /^\S+$/

    const questionForm = this.fb.group({
      id: new FormControl<number | null>(this._counter ++, Validators.required),
      answer: new FormControl<string | null>('', [Validators.required, Validators.pattern(dontAllowEmpty)], )
    });

    this.questions.push(questionForm);
  }

  removeQuestion(questionIndex: number) {

    const index = (this.questions.length - 1)
    this._counter = this.questions.controls[index].get('id')?.value

    this.questions.controls.slice(questionIndex + 1).forEach((question: any) => {
      question.get('id')?.setValue(question.get('id')?.value - 1)
    })

    this.questions.removeAt(questionIndex);

    this.questions.length === 0 ? this._counter = 1 : null

    let body = {
      removeQuestion: (questionIndex + 1)
    }

    if(this.id){

      this.fetch.updateOneDataWithId('test',  Number(this.id), body)
        .subscribe((data: any) => {
          if(data) {}
        })
    }
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

  get classes() {
    return this._classes
  }

  set classes(value: Classroom[] | undefined) {
    this._classes = value
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

  get classesName(){
    return this._classesName
  }

  set classesName(value: string){
    this._classesName = value
  }

  get teacherName(){
    return this._teacherName
  }

  set teacherName(value: string){
    this._teacherName = value
  }

  onSubmit() {

    if(this.id) {
      this.updateData()
      return
    }

    this.createNewData()
  }

  createNewData() {
    const teacherId = (this.form.value.teacher as any).id

    const body = {
      name: this.form.value.name,
      category: { id: this.form.value.testCategory },
      discipline: { id: this.form.value.discipline },
      year: { id: this.form.value.year},
      bimester: { id: this.form.value.bimester },
      teacher: { id: teacherId },
      questions: this.form.value.questions,
      testClasses: this.form.value.testClasses
    }

    this.fetch.createOneData('test', body)
      .subscribe((data: any) => {
        if(data) {
          this.form.reset()
        }
      })
  }

  private updateData() {

    const body = {
      name: this.form.value.name,
      questions: this.form.value.questions,
    }

    this.fetch.updateOneDataWithId('test', this.id as number, body)
      .subscribe((data: any) => {
        if(data) {}
      })
  }

  delete() {
    this.fetch.deleteOneData('test', this.id as number)
      .subscribe((data: any) => {
        if(data) {}
      })
  }
}
