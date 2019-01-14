import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SkyhookDndModule } from '@angular-skyhook/core';
import { default as HTML5Backend } from 'react-dnd-html5-backend';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyhookDndModule.forRoot({ backend: HTML5Backend }),
  ],
  providers: [
    MemoryService,
  ],
  bootstrap: [AppComponent]
}
export class AppModule { }
