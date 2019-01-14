import { Component, OnInit } from '@angular/core';
import { SkyhookDndService } from '@angular-skyhook/core';
import { ItemTypes } from 'src/app/components/chess-demo/interfaces/constants';

@Component({
  selector: 'app-knight',
  templateUrl: './knight.component.html',
  styleUrls: ['./knight.component.scss']
})
export class KnightComponent implements OnInit {

  knightSource = this.dnd.dragSource(ItemTypes.KNIGHT, {
    beginDrag: () => ({})
  });

  isDragging$ = this.knightSource.listen(monitor => monitor.isDragging());

  constructor(private dnd: SkyhookDndService) { }

  ngOnInit() {
    //const img = new Image();
    //img.src = // ... long 'data:image/png;base64' url
              // regular 'https://' URLs work here too
    //img.onload = () => this.knightSource.connectDragPreview(img);
  }

  ngOnDestroy() {
    this.knightSource.unsubscribe();
}

}
