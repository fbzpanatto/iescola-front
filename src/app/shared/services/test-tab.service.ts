import { Injectable } from '@angular/core';
import {FetchDataService} from "./fetch-data.service";

@Injectable({
  providedIn: 'root'
})
export class TestTabService {

  constructor(
    private fetchData: FetchDataService
  ) { }
}
