import {
  AfterViewInit,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ClassAnswers } from "./class-answers/class-answers.component";
import { TotalsComponent } from "./totals/totals.component";
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, ClassAnswers, TotalsComponent, RouterLink],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterViewInit {

  selectedIndex?: number;
  componentRef?: ComponentRef<any>

  @ViewChild('chartContainer', { read: ViewContainerRef }) private chartContainer?: ViewContainerRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.selectedIndex = this.getTabIndex(params.get('tab') as string);
    });
  }

  ngAfterViewInit() {
    this.setComponent()
  }

  setComponent () {
    this.componentRef = this.chartContainer?.createComponent(TotalsComponent) as ComponentRef<any>
  }

  getTabIndex(tab: string): number {
    switch (tab) {
      case 'answers':
        return 0;
      case 'totals':
        return 1;
      default:
        return 0;
    }
  }

  getTabUrl(index: number): string {
    switch (index) {
      case 0:
        return 'answers';
      case 1:
        return 'totals';
      default:
        return 'answers';
    }
  }

  navigate(event: MatTabChangeEvent) {
    const path = this.getTabUrl(event.index);

    if(event.index === 1) {
      this.setComponent()
    } else {
      this.componentRef?.destroy()
    }

    const newPath = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
    history.replaceState({}, '', newPath + path)
  }
}
