import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';

import localePt from '@angular/common/locales/pt';
import localePtExtra from '@angular/common/locales/extra/pt';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { NavigationComponent } from "./shared/components/navigation/navigation.component";

import { MatIconRegistry } from "@angular/material/icon";
import { registerLocaleData } from "@angular/common";

import { CustomReuseStrategy } from "./shared/methods/reuseStrategy";
import { RouteReuseStrategy } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { DisableControlDirective } from './shared/directives/disable-control.directive';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LoadingInterceptor} from "./shared/interceptors/loading.interceptor";
import { AuthService} from "./shared/interceptors/auth.service";

@NgModule({
  declarations: [
    AppComponent,
    DisableControlDirective,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NavigationComponent,
    HttpClientModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'pt-BR'
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuseStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    registerLocaleData(localePt, 'pt-BR');
    registerLocaleData(localePt, 'pt-BR', localePtExtra);

    const icons = [
      'account_circle',
      'add',
      'apps',
      'arrow_right',
      'arrow_back_ios',
      'article',
      'backspace',
      'brightness_2',
      'calendar',
      'check',
      'circle_FILL0',
      'circle_FILL1',
      'check_box_fill',
      'check_box_blank',
      'chevron_right',
      'close',
      'close_fullscreen',
      'cloud_circle',
      'delete',
      'domain',
      'done',
      'email',
      'error',
      'event',
      'expand_more',
      'filter',
      'filter_alt_off',
      'folder',
      'help',
      'info',
      'fullscreen',
      'fullscreen_exit',
      'group',
      'keyboard_arrow_down',
      'keyboard_arrow_left',
      'keyboard_arrow_right',
      'keyboard_arrow_up',
      'language',
      'list',
      'login',
      'loop',
      'menu',
      'menu48',
      'pause_circle',
      'play_circle',
      'picture_as_pdf',
      'person',
      'phone',
      'power_settings_new',
      'redo',
      'refresh',
      'rename_outline',
      'report',
      'search',
      'settings',
      'settings_account',
      'storage',
      'stop_circle',
      'table',
      'translate',
      'flight_land',
      'flight_takeoff',
      'task',
      'undo',
      'unknown_med',
      'view_headline',
      'vpn_key',
      'wb_sunny'
    ];

    icons.forEach((icon) => {
      iconRegistry.addSvgIcon(
        icon,
        sanitizer.bypassSecurityTrustResourceUrl(
          `assets/mat-icons/${icon}.svg`
        )
      );
    });
  }
}
