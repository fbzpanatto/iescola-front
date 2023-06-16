import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetActiveComponentBarTitle } from "../../shared/methods/activeComponent";
import { BasicComponent } from "../../shared/components/basic/basic.component";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FetchDataService } from "../../shared/services/fetch-data.service";
import { NavigationService } from "../../shared/services/navigation.service";
import { AutoFocusDirective } from "../../shared/directives/auto-focus.directive";
import { BimesterComponent } from "../../shared/components/bimester/bimester.component";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { YearComponent } from "../../shared/components/year/year.component";
import { Observable} from "rxjs";
import { StudentFormComponent } from "./form/student-form.component";

interface Student { id: string, order: string, name: string, classroom: string, school: string }

const COMPONENTIMPORTS = [CommonModule, AutoFocusDirective, BimesterComponent, FormsModule, MatButtonModule, MatIconModule, RouterLink, YearComponent, StudentFormComponent]

const CONFIG = {
  title: 'Alunos',
  url: 'student',
  icon: 'group'
}

@SetActiveComponentBarTitle(CONFIG.title, CONFIG.url)
@Component({
  selector: 'app-students',
  standalone: true,
  imports: COMPONENTIMPORTS,
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss', '../../shared/styles/table.scss']
})
export class StudentsComponent extends BasicComponent implements OnInit, OnDestroy {

  @Input() command?: string

  static title = CONFIG.title
  static url = CONFIG.url
  static icon = CONFIG.icon

  students$?: Observable<Student[]>

  constructor( router:Router, route: ActivatedRoute, fetchData: FetchDataService, navService: NavigationService) {
    super( router, route, fetchData, navService );
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {

    if(!this.command) {
      this.students$ = this.fetchFilteredData('')
    }
  }

  fetchFilteredData(search: string){
    return this.basicGetQueryData(`${StudentsComponent.url}`, search) as Observable<Student[]>
  }

  refresh() {

  }
}
