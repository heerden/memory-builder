import { Component, OnInit, Input } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { Colours } from 'src/app/interfaces/colours'

@Component({
  selector: 'app-select-block',
  templateUrl: './select-block.component.html',
  styleUrls: ['./select-block.component.scss']
})
export class SelectBlockComponent implements OnInit {

  @Input() colourPos: number;

  sourceBlock = this.dnd.dragSource("MEMORY", {
    beginDrag: () => ({
      colourPos: this.colourPos
    })
  });

  isDragging$ = this.sourceBlock.listen(monitor => monitor.isDragging());

  constructor(private dnd: SkyhookDndService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.sourceBlock.unsubscribe();

  }

  getStyle() {
    var col = this.colourPos;
    return { backgroundColor: Colours[col]};
  }

}
