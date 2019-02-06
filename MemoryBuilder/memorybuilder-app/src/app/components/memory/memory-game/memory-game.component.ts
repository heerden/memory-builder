import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss']
})
export class MemoryGameComponent implements OnInit {

  round: number;

  constructor(private memory: MemoryService) { }

  ngOnInit() {
    this.restartButton();
  }

  startGameButton() {
    this.round = this.memory.startGame();
  }

  nextRoundButton() {
    this.round = this.memory.nextRound();
  }

  restartButton() {
    this.round = this.memory.restart();
  }

  notCorrectValue() {
    return !this.memory.isCorrect$.value;
  }

  activeMessageValue() {
    return this.memory.activeMessage$.value;
  }

}
