import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { PopupComponent } from "../../../shared/components/popup/popup.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FetchDataService } from "../../../shared/services/fetch-data.service";
import { Observable } from "rxjs";
import { Bimester, Discipline, TestCategory, Year } from "../../../shared/interfaces/interfaces";

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatDialogModule],
  templateUrl: './form.component.html',
  styleUrls: ['../../../shared/styles/form.scss']
})
export class FormComponent implements OnInit {

  private _teacherName?: string
  private _disciplines?: Observable<Discipline[]>
  private _testCategories?: Observable<Discipline[]>
  private _bimesters?: Observable<Bimester[]>
  private _years?: Observable<Year[]>

  form = this.fb.group({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    teacher: new FormControl('', [Validators.required]),
    discipline: new FormControl('', [Validators.required]),
    testCategory: new FormControl('', [Validators.required]),
    bimester: new FormControl('', [Validators.required]),
    year: new FormControl('', [Validators.required]),
  })

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private fetch: FetchDataService,
  ) {}

  ngOnInit(): void {

    this.disciplines = this.fetch.all('discipline')
    this.testCategories = this.fetch.all('test-category')
    this.bimesters = this.fetch.all('bimester')
    this.years = this.fetch.all('year')

    this.form.get('teacher')?.valueChanges.subscribe((value: any) => {
      this.teacherName = value.name ?? ''
    })
  }

  openDialog(formControlName: string, url: string) {

    const headers = [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Professor' }
    ]

    const dialogRef = this.dialog.open(PopupComponent, {
      width: '400px',
      data: { url, headers },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.form.get(formControlName)?.setValue(result)
    });
  }

  get disciplines() {
    return this._disciplines
  }

  set disciplines(value: Observable<Discipline[]> | undefined) {
    this._disciplines = value
  }

  get testCategories() {
    return this._testCategories
  }

  set testCategories(value: Observable<TestCategory[]> | undefined) {
    this._testCategories = value
  }

  get bimesters() {
    return this._bimesters
  }

  set bimesters(value: Observable<Bimester[]> | undefined) {
    this._bimesters = value
  }

  get years() {
    return this._years
  }

  set years(value: Observable<Year[]> | undefined) {
    this._years = value
  }

  get teacherName(){
    return this._teacherName
  }

  set teacherName(value: string | undefined){
    this._teacherName = value
  }

}
