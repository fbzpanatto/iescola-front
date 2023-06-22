import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private _originalValues: any;

  constructor() { }

  get originalValues() {
    return this._originalValues;
  }

  set originalValues(values: any) {
    this._originalValues = values;
  }
}
