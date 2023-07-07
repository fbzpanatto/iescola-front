import { Component, HostListener } from '@angular/core';
import { LoadingService } from "./shared/components/loading/loading.service";

const TOKEN_KEY = 'token'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iescola-front';

  // @HostListener('window:beforeunload', ['$event']) clearLocalStorage(event: any) {
  //   localStorage.removeItem(TOKEN_KEY)
  // }

  constructor(public loadingService: LoadingService,) {}
}
