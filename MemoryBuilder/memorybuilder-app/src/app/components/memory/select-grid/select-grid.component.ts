import { Component, OnInit } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-select-grid',
  templateUrl: './select-grid.component.html',
  styleUrls: ['./select-grid.component.scss']
})
export class SelectGridComponent implements OnInit {

  selectGrid = new Array(8).fill(0).map((_, i) => i);

  constructor() { }

  ngOnInit() {
  }

}
