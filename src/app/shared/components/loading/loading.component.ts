import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { LoadingService } from "./loading.service";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart, RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router
} from "@angular/router";

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, OnDestroy {

  @Input() routing: boolean = false
  @Input() detectRoutingOnGoing: boolean = false

  private subscription: any

  constructor(
    public loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if(this.detectRoutingOnGoing) {
      this.subscription.unsubscribe()
    }
  }

  ngOnInit(): void {

    if(this.detectRoutingOnGoing) {
      this.subscription = this.router.events
        .subscribe((event) => {
          if(
            event instanceof NavigationStart ||
            event instanceof RouteConfigLoadStart
          ) { this.turnOn() }
          else if (
            event instanceof NavigationEnd ||
            event instanceof NavigationError ||
            event instanceof NavigationCancel ||
            event instanceof RouteConfigLoadEnd
          ) { this.turOff()  }
        })
    }
  }

  turnOn() {
    this.loadingService.loadingOn()
  }

  turOff() {
    this.loadingService.loadingOff()
  }
}
