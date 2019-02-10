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

  isMemorising$ = new BehaviorSubject<boolean>(true);
  isCorrect$ = new BehaviorSubject<boolean>(true);
  statusMessage$ = new BehaviorSubject<string>('');
  memInterval$ = new BehaviorSubject<number>(0);

  //settings
  startGrid$ = new BehaviorSubject<number>(3);
  colourSelect$ = new BehaviorSubject<number>(6);
  roundTime$ = new BehaviorSubject<number>(3);

  round: number;

  interval: any;
  showTime: number;
  timePenalty: number;

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
      colourPos: Math.floor(Math.random() * this.colourSelect$.value),
      canDrop: true,
      question: false    
    }; 
    this.memoryRetain.push(gridCell);

    let whiteCell = {
      pos: p,
      colourPos: 3,
      canDrop: true,
      question: true    
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
    this.timePenalty = 0;
    this.isMemorising$.next(true);

    this.memoryGrid = new Array;
    this.memoryRetain = new Array;
    this.memoryWhite = new Array;

    for (var i = 0; i < this.startGrid$.value; i++) {
      this.setMemoryBlock(i);
    }

    this.isCorrect$.next(true);
    this.startShowTimer();

    return this.round;
  }

  restart() {

    this.showTime = 0;
    this.round = 0;
    this.isCorrect$.next(true);
    this.statusMessage$.next('Memorise');
    clearInterval(this.interval);

    return this.round;
  }

  nextRound() {

    if (!this.isMemorising$.value) {
      if (this.equalColours(this.memoryGrid, this.memoryRetain)) {
        this.isCorrect$.next(true);

        this.round += 1;

        console.log("Round: " + (this.round-1));
        this.setMemoryBlock(this.startGrid$.value + this.round-2);

        this.startShowTimer();

      } else {
        this.isCorrect$.next(false);
        //console.log("Correct: " + this.isCorrect$.value);
        this.startShowTimer();

      }
    }

    return this.round;
  }

  startRound() {
    this.isMemorising$.next(false);

    return this.round;
  }

  colourArray (memory: Array<any>) {

    // for cheat colours in the console
    let colouring = new Array<any>();
    for (var i = 0; i < memory.length; i++) {
      let grid = memory[i]["colourPos"];
      colouring.push(Colours[grid]);
    }
    console.log(colouring);
  }

  startShowTimer() {

    this.memoryGrid$.next(this.memoryRetain);
    this.memoryGrid = this.memoryWhite.slice(); // otherwise memory alloc is linked, also set here to avoid equal comparison before interval complete. hide for quick testing

    console.log("Start next round");
    //this.colourArray(this.memoryGrid);
    this.colourArray(this.memoryRetain);
    this.isMemorising$.next(true);

    if (this.isCorrect$.value) {
      this.memInterval$.next((this.startGrid$.value + this.round - 1) * this.roundTime$.value - this.timePenalty);
      if (this.round == 1) {     
        this.statusMessage$.next('Memorise')

      } else {
        this.statusMessage$.next('Correct')

      }

    } else {
      this.timePenalty += 1;
      this.memInterval$.next((this.startGrid$.value + this.round - 1) * this.roundTime$.value - this.timePenalty);
      
      if (this.memInterval$.value > 0) {
        this.statusMessage$.next('Incorrect');

      } else {
        this.statusMessage$.next('Incorrect. Time Penalty.');

      }

    }

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log(this.showTime);
      this.showTime += 1;

      if ((this.showTime >= this.memInterval$.value) || !this.isMemorising$.value) {
        console.log("Cleared");

        this.showTime = 0;
        this.isMemorising$.next(false);
        this.statusMessage$.next('Remember');

        this.memoryGrid$.next(this.memoryWhite);
        //this.memoryGrid = this.memoryWhite.slice();

        clearInterval(this.interval);
      }
    }, 1000);
  }

}
