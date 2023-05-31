import { AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import { TestClasses } from "src/app/shared/interfaces/interfaces";
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterModule} from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";
import { CommonModule } from "@angular/common";
import { FormComponent } from "./form/form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import { debounceTime, distinctUntilChanged, Observable, startWith } from "rxjs";

const CONFIG = {
  title: 'Testes',
  url: 'test',
  icon: 'quiz'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  standalone: true,
  selector: 'app-test',
  imports: [CommonModule, RouterModule, FormComponent, MatButtonModule,MatMenuModule, MatIconModule, ReactiveFormsModule, AutoFocusDirective],
  templateUrl: './test.component.html',
  styleUrls: ['test.component.scss', '../../shared/styles/table.scss']
})
export class TestComponent extends BasicComponent implements OnInit, AfterViewInit {

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  private _bimester: { [key:string]: any } = {}

  clear: boolean = false

  searchInput = new FormControl('')
  tests$?: Observable<TestClasses[]>
  bimester$?: Observable<{[key: string]: any}[]>

  @Input() command?: string
  @ViewChild(MatMenuTrigger) private menuTrigger?: MatMenuTrigger;

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navigationService: NavigationService) {
    super( router, route, fetchData, navigationService );
  }

  ngOnInit(): void {

    this.bimester$ = this.getBimester()

    if(!this.command) {

      this.searchInput.valueChanges
        .pipe( startWith(''), debounceTime(400), distinctUntilChanged() )
        .subscribe((value) => {

          if(!!value?.length) { this.tests$ = this.fetchFilteredData(value) }
          else if (!this.clear) { this.tests$ = this.getAll() }

          this.clear = false
        })
    }
  }

  ngAfterViewInit() {
    this.bimester$?.subscribe(bimester => {
      let last = bimester
      this.bimester = last.pop()
    })
  }

  getAll() {

    return this.basicGetAll<TestClasses>()
  }

  getBimester<T>() {
    return this.basicGetAll<T>('bimester')
  }

  fetchFilteredData(search: string | null) {

    return this.basicGetQueryData<TestClasses>(`${TestComponent.url}`, 'search=' + search)
  }

  clearSearch() {
    this.searchInput.setValue('')
  }

  refresh() {
    this.clear = true
    this.clearSearch()
    this.tests$ = this.getAll()
  }

  setBimester(event: any) {
    this.bimester = event
  }

  get bimester() {
    return this._bimester
  }

  set bimester(bimester: any) {
    this._bimester = bimester
  }
}
