import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { HomePage } from './home.page';
import { ColumnMenuPopoverComponent } from './column-menu-popover.component';
import { SettingsMenuPopoverComponent } from './settings-menu-popover.component';

import { HomePageRoutingModule } from './home-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    DragDropModule,
    TranslateModule
  ],
  declarations: [
    HomePage,
    ColumnMenuPopoverComponent,
    SettingsMenuPopoverComponent
  ]
})
export class HomePageModule {}
