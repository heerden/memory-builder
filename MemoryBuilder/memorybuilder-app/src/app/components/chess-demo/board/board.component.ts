import { Component, OnInit } from '@angular/core';

import { Coord } from 'src/app/components/chess-demo/interfaces/coord';
import { GameService } from 'src/app/components/chess-demo/services/game.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  sixtyFour = new Array(64).fill(0).map((_, i) => i);

  knightPosition$ = this.game.knightPosition$;

  /* sourceRed = this.dnd.dragSource("RED" , {
    beginDrag: () => ({ name: 'RED'}),

  });

  sourceBlue = this.dnd.dragSource("BLUE" , {
    beginDrag: () => ({ name: 'BLUE'}),

  });

  target = this.dnd.dropTarget(["RED","BLUE"], {
    drop: monitor => {
      console.log('Dropped item: ', monitor.getItem());
    }

  });

  hovering$ = this.target.listen(m => m.isOver() && m.canDrop()); */

  constructor(private game: GameService) { 
  }

  ngOnDestroy() {
    /*this.sourceRed.unsubscribe();
    this.sourceBlue.unsubscribe();

    this.target.unsubscribe(); */
  }

  ngOnInit() {
    

  }

  xy(i): Coord {
    return {
      x: i % 8,
      y: Math.floor(i / 8)
    }
  }

  isBlack({x, y}: Coord) {
    return (x + y) % 2 === 1;
  }

  handleSquareClick(pos: Coord) {
    if (this.game.canMoveKnight(pos)) {
      this.game.moveKnight(pos);
    }
  }

}
