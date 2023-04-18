import { Component, OnInit } from '@angular/core';
import { NavigationService } from "src/app/shared/services/navigation.service";

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  static title = 'Início'
  static url = 'home'
  static icon = 'home'

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationService.setActiveComponent({title: HomeComponent.title, url: HomeComponent.url});
  }
}
