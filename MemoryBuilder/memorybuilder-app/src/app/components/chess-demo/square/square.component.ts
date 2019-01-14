import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {

  @Input() black: boolean;

  constructor() { }

  ngOnInit() {
  }

  getStyle() {
    return this.black
      ? { backgroundColor: 'black', color: 'white'}
      : { backgroundColor: 'white', color: 'black'}
  }

}
