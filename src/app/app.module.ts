import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, provideHttpClient } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot(),
    AppRoutingModule,
    DragDropModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(),
    provideTranslateHttpLoader()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
