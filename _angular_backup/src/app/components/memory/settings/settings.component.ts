import { Component, OnInit } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit {

  startGrid = this.memory.startGrid$.value;
  increaseGrid = this.memory.increaseGrid$.value;
  colourSelect = this.memory.colourSelect$.value;
  roundTime = this.memory.roundTime$.value;
  penaltyTime = this.memory.penaltyTime$.value;

  constructor(private memory: MemoryService) { }

  ngOnInit() {
  }

  changeStartGrid(e) {
    this.memory.startGrid$.next(e.value);
  }

  changeIncreaseGrid(e) {
    this.memory.increaseGrid$.next(e.value);
  }

  changeColourSelect(e) {
    this.memory.colourSelect$.next(e.value);
  }

  changeRoundTime(e) {
    this.memory.roundTime$.next(e.value);
  }

  changePenaltyTime(e) {
    this.memory.penaltyTime$.next(e.value);
  }

}
