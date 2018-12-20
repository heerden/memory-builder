import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SkyhookDndModule } from '@angular-skyhook/core';
import { default as HTML5Backend } from 'react-dnd-html5-backend';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MemoryGameComponent } from './components/memory/memory-game/memory-game.component';
import { MemoryBlockComponent } from './components/memory/memory-block/memory-block.component';
import { ProfilePageComponent } from './components/profile/profile-page/profile-page.component';
import { CountdownComponent } from './components/countdown/countdown.component';

@NgModule({
  declarations: [
    AppComponent,
    MemoryGameComponent,
    MemoryBlockComponent,
    ProfilePageComponent,
    CountdownComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SkyhookDndModule.forRoot({ backend: HTML5Backend }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
