import { Component } from '@angular/core';
import { LoadingService } from "./shared/components/loading/loading.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'iescola-front';

  constructor(public loadingService: LoadingService,) {
  }
}
