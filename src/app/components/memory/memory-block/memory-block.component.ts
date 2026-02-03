import { Component, OnInit, Input } from '@angular/core';
import { MemoryService } from 'src/app/services/memory.service';
import { Colours, ColourContrasts } from 'src/app/interfaces/colours'
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-memory-block',
  templateUrl: './memory-block.component.html',
  styleUrls: ['./memory-block.component.scss'],
  standalone: false
})
export class MemoryBlockComponent implements OnInit {

  @Input() memoryBlock: any;
  pos: number;
  colourPos: number;
  question: boolean;
  wrong: boolean;

  // Track the temporary preview color when a block is hovered
  previewColourPos: number | null = null;

  isMemorising$ = this.memory.isMemorising$;
  isMemorising: boolean;


  constructor(private memory: MemoryService) {
    this.isMemorising$.subscribe(m => {
      this.isMemorising = m;
    })
  }

  ngOnInit() {
    this.pos = this.memoryBlock["pos"]
    this.colourPos = this.memoryBlock["colourPos"];
    this.question = this.memoryBlock["question"];
    this.wrong = this.memoryBlock["wrong"];
  }

  drop(event: CdkDragDrop<any>) {
    if (this.isMemorising) return;

    // Clear preview on drop
    this.previewColourPos = null;

    const data = event.item.data;
    if (data && data.colourPos !== undefined) {
      this.colourPos = data.colourPos;
      this.question = false;
      this.memory.updateMemoryGrid(this.pos, this.colourPos, false);
    }
  }

  // Called when a draggable enters this drop zone
  enter(event: any) { // using any to avoid import issues if CdkDragEnter isn't imported, but good practice to import
    if (this.isMemorising) return;
    const data = event.item.data;
    if (data && data.colourPos !== undefined) {
      this.previewColourPos = data.colourPos;
    }
  }

  // Called when a draggable exits this drop zone
  exit(event: any) {
    // Revert preview
    this.previewColourPos = null;
  }

  getStyle() {
    // If there's a preview color (hover state), show it!
    if (this.previewColourPos !== null) {
      return { backgroundColor: Colours[this.previewColourPos], border: "2px solid black" };
    }

    if (this.question) {
      return { border: "2px dashed red" };

    } else if (this.wrong) {

      return {
        "backgroundColor": Colours[this.colourPos],
        "border": "3px dashed " + ColourContrasts[this.colourPos],
        "box-sizing": "border-box",
        "-moz-box-sizing": "border-box",
        "-webkit-box-sizing": "border-box",
      }
    }
    else return { backgroundColor: Colours[this.colourPos], border: "2px solid black" };
  }


}
