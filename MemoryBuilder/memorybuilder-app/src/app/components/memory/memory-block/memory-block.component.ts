import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';
import { Colours, ColourContrasts } from 'src/app/interfaces/colours'

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
  wrong: boolean;

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
    this.wrong = this.memoryBlock["wrong"];
    //console.log("Init:: Position: " + this.pos + " Colour: " + this.colourPos, " Question: " + this.question);
  }

  ngOnDestroy() {
    this.targetBlock.unsubscribe();
  }

  getStyle() {
    if (this.question) {
      return { border: "2px dashed red"};
    
    } else if (this.wrong) {

      return {"backgroundColor": Colours[this.colourPos],
              "border": "3px dashed " + ColourContrasts[this.colourPos],
              "box-sizing": "border-box",
              "-moz-box-sizing": "border-box",
              "-webkit-box-sizing": "border-box",              
            }
    }
    else return { backgroundColor: Colours[this.colourPos], border: "2px solid black"};
  }


}
