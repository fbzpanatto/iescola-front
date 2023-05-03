import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FetchDataService } from "../../services/fetch-data.service";
import { NavigationService } from "../../services/navigation.service";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { Subscription } from "rxjs";

const COMMAND = 'command'

export const BasicImports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatTooltipModule,
  MatButtonModule,
  MatIconModule,
  RouterLink
]

@Component({
  standalone: true,
  templateUrl: './basic.component.html',
  imports: BasicImports,
})
export class BasicComponent implements OnInit, OnDestroy {

  isForm: boolean = false
  private _url: string = '';
  protected listSubscription: Subscription = new Subscription()

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected fetchData: FetchDataService,
    protected navigationService: NavigationService
  ) {
    const { title, url } = (this as any).constructor;
    Object.assign(this, { title, url });
    this.url = url;
    this.setBarTitle({title: title, url: url})

    this.route.params.subscribe((params) => {
      if(params[COMMAND]) {
        this.isForm = !this.isForm
        return
      }
    })
  }

   ngOnInit(): void {}

   ngOnDestroy(): void {
     this.listSubscription.unsubscribe()
   }

  navigateTo(commands: any[]) {
    this.router.navigate(commands, { relativeTo: this.route })
  }

  private setBarTitle(param: {title: string, url: string}) {
    this.navigationService.setActiveComponent(param);
  }

  protected basicGetAll<T>(resource = this.url) {
    return this.fetchData.getAllData<T>(resource);
  }

  protected basicGetQueryData<T>(resource = this.url, query: string) {
    return this.fetchData.getQueryData<T>(resource, query);
  }

  protected basicUpdateOneData<T>(resource = this.url, id: number, data: T) {
    return this.fetchData.updateOneData<T>(resource, id, data);
  }

  get url() {
    return this._url;
  }

  set url(url: string) {
    this._url = url;
  }


}
