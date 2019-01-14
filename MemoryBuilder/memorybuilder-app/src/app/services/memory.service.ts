import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  memoryRetain: Array<any>;
  memoryGrid: Array<any>;
  memoryGrid$ = new BehaviorSubject<any>(null);

  isShowing$ = new BehaviorSubject<boolean>(true);
  isCorrect$= new BehaviorSubject<boolean>(true);

  round: number;
  isShowing: boolean;
  retainGrid: Array<any>;

  //settings
  startGrid: number;
  colourSelect: number;

  constructor() { 

    this.memoryGrid$.subscribe(m => {
      console.log("sup!");
      console.log(m);
      //this.memoryGrid = m;
    })
  }

  updateMemoryGrid(pos: number, colorPos: number) {
    let gridCell = {
      pos: pos,
      colorPos: colorPos,
      new: true
    }
    this.memoryRetain[pos] = gridCell;
  }

  setMemoryBlock(m: number) {
    let gridCell = {
      pos: m,
      colorPos: Math.floor(Math.random() * this.startGrid),
      new: true      
    }; 
    this.memoryGrid.push(gridCell);
  }

  equalColours (memory, retain) {
    for (let i = 0; i < memory.length; i++) {
      if (memory[i]["colorPos"] != retain[i]["colorPos"]) {
        return false;
      }
    }

    return true
  }

  startRound() {

    this.round = 0;
    this.setIsShowing(true);

    // settings
    this.startGrid = 3;
    this.colourSelect = 8;

    this.memoryGrid = new Array;
    this.retainGrid = new Array;
    for (var i = 0; i < this.startGrid; i++) {
      this.setMemoryBlock(i);
    }
    this.memoryGrid$.next(this.memoryGrid);
    this.memoryRetain = this.memoryGrid.slice(); // otherwise memory alloc is linked
    console.log(this.memoryGrid);

    this.isCorrect$.next(true);

    return this.round;
  }

  nextRound() {
    
    if (this.equalColours(this.memoryGrid, this.memoryRetain)) {
      this.isCorrect$.next(true);
      this.round += 1;
      this.setIsShowing(true);

    } else {
      this.isCorrect$.next(false);

    }

    return this.round;
  }

  getIsShowing () {
    return this.isShowing;
  }

  setIsShowing(val: boolean) {
    this.isShowing$.next(val)
  }

}
