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
  colorPos: number;
  new: boolean;

  targetBlock = this.dnd.dropTarget("MEMORY", {
    canDrop: monitor => {
      return this.new
    },
    drop: monitor => {
      var block = monitor.getItem();
      this.colorPos = block["colorPos"];

      this.memory.updateMemoryGrid(this.pos, this.colorPos);
      
      console.log("Position: " + this.pos + " Colour: " + this.colorPos);
    }
  });

  constructor(private dnd: SkyhookDndService, private memory: MemoryService) { }

  ngOnInit() {
    this.pos = this.memoryBlock["pos"]
    this.colorPos = this.memoryBlock["colorPos"];
    this.new = true;
  }

  ngOnDestroy() {
    this.targetBlock.unsubscribe();
  }

  getStyle() {
    return { backgroundColor: Colours[this.colorPos]};
  }

}
