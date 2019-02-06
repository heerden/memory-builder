import { Component, OnInit } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  startGrid = this.memory.startGrid$.value;
  colourSelect = this.memory.colourSelect$.value;
  roundTime = this.memory.roundTime$.value;

  constructor(private memory: MemoryService) { }

  ngOnInit() {
  }

  changeStartGrid (e) {
    this.memory.startGrid$.next(e.value);
  }

  changeColourSelect (e) {
    this.memory.colourSelect$.next(e.value);
  }

  changeRoundTime (e) {
    this.memory.roundTime$.next(e.value);
  }

}
