import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss']
})
export class MemoryGameComponent implements OnInit {

  interval: any;
  showTime: number;
  round: number;
  isShowing: boolean;
  isCorrect: boolean;
  isCorrect$ = this.memory.isCorrect$;

  constructor(private memory: MemoryService) { }

  ngOnInit() {
    this.round = 0;
    this.showTime = 0;

  }

  startBlocksButton() {
    this.round = this.memory.startRound();

    this.nextBlocksButton();
  }

  nextBlocksButton() {

    this.round = this.memory.nextRound();
    console.log("NExt: " + this.isCorrect$.value);

    if (this.isCorrect$.value) {
      console.log("Start NExt");
      this.isShowing = true;
      this.interval = setInterval(() => {
        console.log(this.showTime);
        this.showTime += 1;

        if (this.showTime >= 2) {
          console.log("Cleared");
          clearInterval(this.interval);
          this.showTime = 0;
          this.memory.setIsShowing(false);
        }
      }, 1000);
    }
  }

  correctValue() {
    return this.memory.isCorrect$.value;
  }
}
