import { Component, Input } from '@angular/core';
import { map } from 'rxjs/operators';
import { SkyhookDndService } from "@angular-skyhook/core";

import { GameService } from 'src/app/components/chess-demo/services/game.service';
import { Coord } from 'src/app/components/chess-demo/interfaces/coord';
import { ItemTypes } from 'src/app/components/chess-demo/interfaces/constants';

@Component({
  selector: 'app-board-square',
  templateUrl: './boardsquare.component.html',
  styleUrls: ['./boardsquare.component.scss']
})
export class BoardSquareComponent {

  @Input() position: Coord;
  get black() {
       const { x, y } = this.position;
       return (x + y) % 2 === 1;
  }

  target = this.dnd.dropTarget(ItemTypes.KNIGHT, {
    canDrop: monitor => {
      //console.log(this.position);
      return this.game.canMoveKnight(this.position);
    },
    drop: monitor => {
      this.game.moveKnight(this.position);
    }
  });

  collected$ = this.target.listen(m => ({
    canDrop: m.canDrop(),
    isOver: m.isOver(),
  }));

  showOverlay$ = this.collected$.pipe(map(c => c.isOver || c.canDrop));
  
  overlayStyle$ = this.collected$.pipe(map(coll => {
    let { canDrop, isOver } = coll;
    let bg: string = "rgba(0,0,0,0)";
    if (canDrop && isOver) { bg = 'green'; }
    else if (canDrop && !isOver) { bg = 'yellow'; }
    else if (!canDrop && isOver) { bg = 'red'; }
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%',
      zIndex: 1,
      opacity: 0.5,
      backgroundColor: bg
    }
  }));

  constructor(private dnd: SkyhookDndService, private game: GameService) {}

  ngOnDestroy() {
    this.target.unsubscribe();
  }
}
