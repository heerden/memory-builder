import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SkyhookDndModule } from '@angular-skyhook/core';
import { default as HTML5Backend } from 'react-dnd-html5-backend';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProfilePageComponent } from './components/profile/profile-page/profile-page.component';

import { CountdownComponent } from './components/countdown/countdown.component';

import { BoardComponent } from './components/chess-demo/board/board.component';
import { KnightComponent } from './components/chess-demo/knight/knight.component';
import { SquareComponent } from './components/chess-demo/square/square.component';
import { BoardSquareComponent } from './components/chess-demo/boardsquare/boardsquare.component'
import { GameService } from './components/chess-demo/services/game.service';

import { MemoryGameComponent } from './components/memory/memory-game/memory-game.component';
import { MemoryBlockComponent } from './components/memory/memory-block/memory-block.component';
import { SelectGridComponent } from './components/memory/select-grid/select-grid.component';
import { MemoryGridComponent } from './components/memory/memory-grid/memory-grid.component';
import { SelectBlockComponent } from './components/memory/select-block/select-block.component';
import { MemoryService } from './services/memory.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    KnightComponent,
    ProfilePageComponent,
    CountdownComponent,
    SquareComponent,
    BoardSquareComponent,
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
    GameService,
    MemoryService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
