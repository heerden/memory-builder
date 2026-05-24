import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss'],
  standalone: false
})
export class MemoryGameComponent implements OnInit {

  round: number;
  blocks: number;

  showInfo = true;
  showWarning = true;

  constructor(private memory: MemoryService) { }

  ngOnInit() {
    this.round = this.memory.round;
    this.blocks = this.memory.blocks;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        this.showInfo = sessionStorage.getItem('memory_builder_hide_info') !== 'true';
      } catch (e) {
        console.error('Error reading info visibility state from sessionStorage', e);
      }
    }
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

  closeInfo() {
    this.showInfo = false;
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        sessionStorage.setItem('memory_builder_hide_info', 'true');
      } catch (e) {
        console.error('Error saving info visibility state to sessionStorage', e);
      }
    }
  }

  closeWarning() {
    this.showWarning = false
  }
}
