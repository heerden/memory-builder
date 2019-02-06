import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SkyhookDndModule } from '@angular-skyhook/core';
import { default as HTML5Backend } from 'react-dnd-html5-backend';

import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfilePageComponent } from './components/profile/profile-page/profile-page.component';

import { CountdownComponent } from './components/countdown/countdown.component';

import { MemoryGameComponent } from './components/memory/memory-game/memory-game.component';
import { MemoryBlockComponent } from './components/memory/memory-block/memory-block.component';
import { SelectGridComponent } from './components/memory/select-grid/select-grid.component';
import { MemoryGridComponent } from './components/memory/memory-grid/memory-grid.component';
import { SelectBlockComponent } from './components/memory/select-block/select-block.component';
import { MemoryService } from './services/memory.service';
import { SettingsComponent } from './components/memory/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ProfilePageComponent,
    CountdownComponent,
    MemoryGameComponent,
    MemoryBlockComponent,
    SelectGridComponent,
    MemoryGridComponent,
    SelectBlockComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    SkyhookDndModule.forRoot({ backend: HTML5Backend }),
    SliderModule,
    ButtonModule,
  ],
  providers: [
    MemoryService,
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
