import { Component, OnInit } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-select-grid',
  templateUrl: './select-grid.component.html',
  styleUrls: ['./select-grid.component.scss']
})
export class SelectGridComponent implements OnInit {

  //selectGrid = new Array(8).fill(0).map((_, i) => i);
  selectGrid: Array<number>;
  colourSelect$ = this.memory.colourSelect$;
  colourSelect: number;

  constructor(private memory: MemoryService) {

    this.colourSelect$.subscribe(m => {
      console.log(m);
      this.colourSelect = m;
      this.selectGrid = new Array(this.colourSelect).fill(0).map((_, i) => i)
    })
  }

  ngOnInit() {
  }

}
