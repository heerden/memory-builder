import { Component, OnInit } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';

@Component({
  selector: 'app-memory-grid',
  templateUrl: './memory-grid.component.html',
  styleUrls: ['./memory-grid.component.scss'],
  standalone: false
})
export class MemoryGridComponent implements OnInit {

  memoryGrid$ = this.memory.memoryGrid$;

  constructor(private memory: MemoryService) { }

  ngOnInit() {

  }

}
