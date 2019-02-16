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
  increaseGrid$ = new BehaviorSubject<number>(1);
  colourSelect$ = new BehaviorSubject<number>(6);
  roundTime$ = new BehaviorSubject<number>(3);
  penaltyTime$ = new BehaviorSubject<number>(1);

  round: number;

  interval: any;
  showTime: number;
  timePenalty: number;

  constructor() { 

  }

  updateMemoryGrid(pos: number, colourPos: number, question: boolean) {

    let gridCell = {
      pos: pos,
      colourPos: colourPos,
      question: question
    }
    console.log("UPDATING: " + pos);
    //console.log(this.memoryGrid);
    this.memoryGrid[pos] = gridCell;
    this.colourArray(this.memoryGrid);
    //console.log(this.memoryGrid);
  }

  setMemoryBlock() {

    let p = this.memoryRetain.length;
    let gridCell = {
      pos: p,
      colourPos: Math.floor(Math.random() * this.colourSelect$.value),
      question: false    
    }; 
    this.memoryRetain.push(gridCell);

    let whiteCell = {
      pos: p,
      colourPos: 3,
      question: true    
    }; 
    this.memoryWhite.push(whiteCell);
  }

  equalColours (memory, retain) {

    //console.log("CHECKING");
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

    for (let i = 0; i < this.startGrid$.value; i++) {
      this.setMemoryBlock();//i
    }

    this.isCorrect$.next(true);
    this.startShowTimer();

    return this.round;
  }

  restart() {

    this.showTime = 0;
    this.round = 0;
    this.isCorrect$.next(true);
    this.statusMessage$.next('Press Start');
    clearInterval(this.interval);

    return this.round;
  }

  nextRound() {

    if (!this.isMemorising$.value) {
      if (this.equalColours(this.memoryGrid, this.memoryRetain)) {
        this.isCorrect$.next(true);

        this.round += 1;

        console.log("Round: " + (this.round));
        for (let m = 0; m < this.increaseGrid$.value; m++) {
          let p = this.startGrid$.value + this.round-2 + m;
          console.log(p);
          this.setMemoryBlock(); //this.startGrid$.value + this.round-2 + m
        }

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
    this.rememberStatus();

    return this.round;
  }

  colourArray (memory: Array<any>) {

    // for cheat colours in the console
    let colouring = new Array<any>();
    for (let i = 0; i < memory.length; i++) {
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
      if (this.round == 1) {     
        this.statusMessage$.next('Memorise First Round Blocks')

      } else {
        this.statusMessage$.next('Correct - Memorise Next Round Blocks')

      }

    } else {
      this.timePenalty += this.penaltyTime$.value;
      
      if (this.memInterval$.value > 0) {
        this.statusMessage$.next('Incorrect - Memorise Blocks Again');

      } else {
        this.statusMessage$.next('Incorrect - Memorise Blocks Again'); // - Time Penalty

      }

    }
    this.memInterval$.next((this.startGrid$.value + this.round-1) * this.roundTime$.value - this.timePenalty);

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log(this.showTime);
      this.showTime += 1;

      if ((this.showTime >= this.memInterval$.value) || !this.isMemorising$.value) {

        this.rememberStatus();
        clearInterval(this.interval);
      }
    }, 1000);
  }

  rememberStatus() {
    console.log("Cleared");

    this.showTime = 0;
    this.isMemorising$.next(false);
    this.statusMessage$.next('Build Blocks');

    this.memoryGrid$.next(this.memoryWhite);

  }

}

