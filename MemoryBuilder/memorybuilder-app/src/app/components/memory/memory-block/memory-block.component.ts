import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';
import { Colours } from 'src/app/interfaces/colours'

import { SkyhookDndService } from "@angular-skyhook/core";

@Component({
  selector: 'app-memory-block',
  templateUrl: './memory-block.component.html',
  styleUrls: ['./memory-block.component.scss']
})
export class MemoryBlockComponent implements OnInit {

  @Input() memoryBlock: any;
  pos: number;
  colourPos: number;
  question: boolean;

  isMemorising$ = this.memory.isMemorising$;
  isMemorising: boolean;

  targetBlock = this.dnd.dropTarget("MEMORY", {
    canDrop: monitor => {
      return !this.isMemorising;
    },
    drop: monitor => {
      var block = monitor.getItem();
      this.colourPos = block["colourPos"];
      this.question = false;

      this.memory.updateMemoryGrid(this.pos, this.colourPos, false);

      //console.log("Dropping:: Position: " + this.pos + " Colour: " + this.colourPos, " Question: " + this.question);
    }
  });

  constructor(private dnd: SkyhookDndService, private memory: MemoryService) { 

    this.isMemorising$.subscribe(m => {
      this.isMemorising = m;
    })
  }

  ngOnInit() {
    this.pos = this.memoryBlock["pos"]
    this.colourPos = this.memoryBlock["colourPos"];
    this.question = this.memoryBlock["question"];
    //console.log("Init:: Position: " + this.pos + " Colour: " + this.colourPos, " Question: " + this.question);
  }

  ngOnDestroy() {
    this.targetBlock.unsubscribe();
  }

  getStyle() {
    if (this.question) {
      return { border: "2px dashed red"};
    } else return { backgroundColor: Colours[this.colourPos], border: "2px solid black"};
  }

}
