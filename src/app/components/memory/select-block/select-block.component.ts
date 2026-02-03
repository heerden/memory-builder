import { Component, OnInit, Input } from '@angular/core';
import { Colours } from 'src/app/interfaces/colours'

@Component({
  selector: 'app-select-block',
  templateUrl: './select-block.component.html',
  styleUrls: ['./select-block.component.scss'],
  standalone: false
})
export class SelectBlockComponent implements OnInit {

  @Input() colourPos: number;

  constructor() { }

  ngOnInit() {
  }

  getStyle() {
    var col = this.colourPos;
    return { backgroundColor: Colours[col] };
  }

}
