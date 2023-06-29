import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ClassAnswers } from "./class-answers/class-answers.component";
import { TotalsComponent } from "./totals/totals.component";
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from "@angular/router";
import { TabSelectorService } from "../tab-selector.service";

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, MatTabsModule, ClassAnswers, TotalsComponent, RouterLink],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  selectedIndex?: number;

  constructor(private route: ActivatedRoute, private tabSelectorService: TabSelectorService, private router: Router) {}

  ngOnInit(): void {

    this.router.events.subscribe(async (event) => {
      if(event instanceof NavigationEnd ) {
        await this.tabSelectorService.destroyChart()
      }
    })

    this.route.paramMap.subscribe(params => {
      this.selectedIndex = this.getTabIndex(params.get('tab') as string);

      this.tabSelectorService.nextTabSelector(this.selectedIndex)
    });
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

  async navigate(event: MatTabChangeEvent) {
    const path = this.getTabUrl(event.index);

    if(event.index != 0 ) {
      await this.tabSelectorService.destroyChart()
    }

    this.tabSelectorService.nextTabSelector(event.index as number)

    const newPath = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
    history.replaceState({}, '', newPath + path)
  }
}
