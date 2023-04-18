import { Component } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";

@Component({
  standalone: true,
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {

  static title = 'Testes'
  static url = 'test'
  static icon = 'quiz'

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.setActiveComponent({title: TestComponent.title, url: TestComponent.url});
  }

}
