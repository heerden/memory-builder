import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Colours } from 'src/app/interfaces/colours'

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  memoryRetain: Array<any>;
  memoryGrid: Array<any>;
  memoryWhite: Array<any>;
  memoryGrid$ = new BehaviorSubject<any>(null);

  isShowingMemoryGrid$ = new BehaviorSubject<boolean>(true);
  isCorrect$= new BehaviorSubject<boolean>(true);

  round: number;

  interval: any;
  showTime: number;

  //settings
  startGrid: number;
  colourSelect: number;
  timeInterval: number;

  constructor() { 

    this.memoryGrid$.subscribe(m => {
      //console.log("sup!");
      //console.log(m);
      //this.memoryGrid = m;
      //console.log(this.memoryGrid);
    })
  }

  updateMemoryGrid(pos: number, colourPos: number, question: boolean) {

    let gridCell = {
      pos: pos,
      colourPos: colourPos,
      canDrop: true,
      question: question
    }
    //console.log("UPDATING: " + pos);
    //console.log(this.memoryGrid);
    this.memoryGrid[pos] = gridCell;
    //this.colourArray(this.memoryGrid);
    //console.log(this.memoryGrid);
  }

  setMemoryBlock(p: number) {

    let gridCell = {
      pos: p,
      colourPos: Math.floor(Math.random() * this.startGrid),
      canDrop: true,
      question: false    
    }; 
    this.memoryRetain.push(gridCell);

    let whiteCell = {
      pos: p,
      colourPos: 3,
      canDrop: true,
      question: false    
    }; 
    this.memoryWhite.push(whiteCell);
  }

  equalColours (memory, retain) {

    //this.colourArray(memory);
    //this.colourArray(retain);

    for (let i = 0; i < memory.length; i++) {
      let A = memory[i]["colourPos"];
      let B = retain[i]["colourPos"];
      //console.log(A + " : " + B);
      if (A != B) {
        return false; // return on first incorrect colourPos
      }
    }

    return true
  }

  startGame() {

    this.round = 1;
    this.isShowingMemoryGrid$.next(true);

    // settings
    this.startGrid = 3;
    this.colourSelect = 8;
    this.timeInterval = 2;

    this.memoryGrid = new Array;
    this.memoryRetain = new Array;
    this.memoryWhite = new Array;

    for (var i = 0; i < this.startGrid; i++) {
      this.setMemoryBlock(i);
    }

    this.startShowTimer();

    return this.round;
  }

  nextRound() {

    if (this.equalColours(this.memoryGrid, this.memoryRetain)) {
      this.isCorrect$.next(true);
      this.round += 1;
      this.isShowingMemoryGrid$.next(true);

      console.log(this.round-1);
      this.setMemoryBlock(this.startGrid + this.round-2);
      //this.AlertAlert();

      this.startShowTimer();

    } else {
      this.isCorrect$.next(false);
      console.log("Correct: " + this.isCorrect$.value);
    }

    return this.round;
  }

  colourArray (memory: Array<any>) {

    let colouring = new Array<any>();
    // cheat colours in the console
    for (var i = 0; i < memory.length; i++) {
      let grid = memory[i]["colourPos"];
      colouring.push(Colours[grid]);
    }
    console.log(colouring);
  }

  AlertAlert () {

    let colouring = new Array<any>();
    // cheat colours in the console
    for (var i = 0; i < this.memoryRetain.length; i++) {
      let grid = this.memoryRetain[i]["pos"];
      colouring.push(grid);
    }
    console.log(colouring);
  }

  startShowTimer() {

    this.memoryGrid$.next(this.memoryRetain);
    //this.memoryGrid = this.memoryWhite.slice(); // otherwise memory alloc is linked, also set here to avoid equal comparison before interval complete

    console.log("Start next round");
    //this.colourArray(this.memoryGrid);
    this.colourArray(this.memoryRetain);

    this.isShowingMemoryGrid$.next(true);
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log(this.showTime);
      this.showTime += 1;

      if (this.showTime >= this.timeInterval) {
        console.log("Cleared");

        clearInterval(this.interval);
        this.showTime = 0;
        this.isShowingMemoryGrid$.next(false);

        this.memoryGrid$.next(this.memoryWhite);
        this.memoryGrid = this.memoryWhite.slice(); // otherwise memory alloc is linked, also set here to avoid equal comparison before interval complete
      }
    }, 1000);
  }

  restart() {

    this.showTime = 0;
    this.round = 0;
    this.isCorrect$.next(true);

    return this.round;
  }

}
