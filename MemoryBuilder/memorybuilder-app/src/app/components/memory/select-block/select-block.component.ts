import { Component, OnInit, Input } from '@angular/core';
import { SkyhookDndService } from "@angular-skyhook/core";
import { Colours } from 'src/app/interfaces/colours'

@Component({
  selector: 'app-select-block',
  templateUrl: './select-block.component.html',
  styleUrls: ['./select-block.component.scss']
})
export class SelectBlockComponent implements OnInit {

  @Input() colorPos: number;

  sourceBlock = this.dnd.dragSource("MEMORY", {
    beginDrag: () => ({
      colorPos: this.colorPos
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
    var col = this.colorPos;
    return { backgroundColor: Colours[col]};
  }

}
