import {AfterViewInit, Component, HostListener, inject, OnDestroy} from '@angular/core';
import { LoadingService } from "./shared/components/loading/loading.service";
import {FetchDataService} from "./shared/services/fetch-data.service";
import {Subscription} from "rxjs";

const TOKEN_KEY = 'token'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'iescola-front';

  private subscription: Subscription | undefined
  private fetchService = inject(FetchDataService)
  loadingService = inject(LoadingService)

  ngAfterViewInit(): void {

    this.subscription = this.fetchService.checkToken<any>().subscribe()
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
