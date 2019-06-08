import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss']
})
export class MemoryGameComponent implements OnInit {

  round: number;
  blocks: number;

  constructor(private memory: MemoryService) { }

  ngOnInit() {
    this.restartButton();
  }

  startGameButton() {
    [this.round, this.blocks] = this.memory.startGame();
  }

  nextRoundButton() {
    [this.round, this.blocks] = this.memory.nextRound();
  }

  startRoundButton() {
    [this.round, this.blocks] = this.memory.startRound();
  }

  restartButton() {
    [this.round, this.blocks] = this.memory.restart();
  }


  // get value methods
  notCorrectValue() {
    return !this.memory.isCorrect$.value;
  }

  statusMessageValue() {
    return this.memory.statusMessage$.value;
  }

  memIntervalValue() {
    return this.memory.memInterval$.value;
  }

  isMemorisingValue() {
    return this.memory.isMemorising$.value;
  }

}
