import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.scss']
})
export class MemoryGameComponent implements OnInit {

  constructor() { 
  }

  emojis: string[];

  ngOnInit() {
    this.emojis = [];

  }

  appendItem() {
    const emoji = '🍺 Beer Me'
    this.emojis.push(emoji);
    console.log(this.emojis);
    //this.docRef.update({ 
    //  favs: firestore.FieldValue.arrayUnion(emoji) 
    //})
  }

  removeItem(emoji) {
    console.log(this.emojis);

    var index = this.emojis.indexOf(emoji);
    if (index > -1) {
      this.emojis.splice(index, 1);
    }
    //this.docRef.update({ 
    //  favs:  firestore.FieldValue.arrayRemove(emoji) 
    //})
  }  

}
