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
  memoryWrong: Array<any>;
  memoryGrid$ = new BehaviorSubject<any>(null);

  isMemorising$ = new BehaviorSubject<boolean>(true);
  isCorrect$ = new BehaviorSubject<boolean>(true);
  statusMessage$ = new BehaviorSubject<string>('');
  memInterval$ = new BehaviorSubject<number>(0);

  //settings
  startGrid$ = new BehaviorSubject<number>(3);
  increaseGrid$ = new BehaviorSubject<number>(1);
  colourSelect$ = new BehaviorSubject<number>(6);
  roundTime$ = new BehaviorSubject<number>(1);
  penaltyTime$ = new BehaviorSubject<number>(1);

  round: number;
  blocks: number;

  interval: any;
  showTime: number;
  timePenalty: number;

  constructor() { 

  }

  updateMemoryGrid(pos: number, colourPos: number, question: boolean) {

    let gridCell = {
      pos: pos,
      colourPos: colourPos,
      question: question,
      wrong: false
    }
    //console.log("UPDATING: " + pos);
    //console.log(this.memoryGrid);
    this.memoryGrid[pos] = gridCell;
    //this.colourArray(this.memoryGrid);
    //console.log(this.memoryGrid);
  }

  setMemoryBlock() {

    let p = this.memoryRetain.length;
    let gridCell = {
      pos: p,
      colourPos: Math.floor(Math.random() * this.colourSelect$.value),
      question: false,
      wrong: false
    }; 
    this.memoryRetain.push(gridCell);

    let whiteCell = {
      pos: p,
      colourPos: 3,
      question: true,
      wrong: false    
    }; 
    this.memoryWhite.push(whiteCell);
  }

  checkBlockColours(memory, retain) {
    let check = 0;
    //console.log("CHECKING");
    //this.colourArray(memory);
    //this.colourArray(retain);
    //console.log(memory);      

    for (let i = 0; i < memory.length; i++) {
      let A = memory[i]["colourPos"];
      let B = retain[i]["colourPos"];

      // will be wrong if the block's memory is not equal to the answer OR the block is not answered
      if ((A != B) || memory[i]["question"]) {
        this.memoryWrong[i]["wrong"] = true;
        check++
      } else {        
        this.memoryWrong[i]["wrong"] = false; // slice does not work to completely duplicate memmoryWrong from memoryretain
      }
    }

    return check
  }

  startGame() {

    this.round = 1;
    this.blocks = this.startGrid$.value;
    this.timePenalty = 0;
    this.isMemorising$.next(true);

    this.memoryGrid = new Array;
    this.memoryRetain = new Array;
    this.memoryWhite = new Array;
    this.memoryWrong = new Array;

    for (let i = 0; i < this.startGrid$.value; i++) {
      this.setMemoryBlock();
    }
    this.memoryWrong = this.memoryRetain.slice();

    this.isCorrect$.next(true);
    this.startShowTimer();

    return [this.round, this.blocks];
  }

  restart() {

    this.showTime = 0;
    this.round = 0;
    this.blocks = 0;
    this.isCorrect$.next(true);
    this.statusMessage$.next('Press Start');
    clearInterval(this.interval);

    return [this.round, this.blocks];
  }

  nextRound() {
    if (!this.isMemorising$.value) {
      
      this.memoryWrong = this.memoryRetain.slice();
      if (this.checkBlockColours(this.memoryGrid, this.memoryRetain) == 0) {
        this.isCorrect$.next(true);

        this.round += 1;
        this.blocks += this.increaseGrid$.value;

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

    return [this.round, this.blocks];
  }

  startRound() {
    this.isMemorising$.next(false);
    this.rememberStatus();

    return [this.round, this.blocks];
  }

  logColourArray(memory: Array<any>) {

    // for cheat colours in the console
    let colouring = new Array<any>();
    for (let i = 0; i < memory.length; i++) {
      let grid = memory[i]["colourPos"];
      colouring.push(Colours[grid]);
    }
    console.log(colouring);
  }

  startShowTimer() {

    this.memoryGrid = this.memoryWhite.slice(); // otherwise memory alloc is linked, also set here to avoid equal comparison before interval complete. hide for quick testing

    console.log("Start next round");
    //this.colourArray(this.memoryGrid);
    this.logColourArray(this.memoryRetain);
    this.isMemorising$.next(true);

    if (this.isCorrect$.value) {
      // Correct result, show new blocls
      this.memoryGrid$.next(this.memoryRetain);

      if (this.round == 1) {     
        this.statusMessage$.next('Memorise First Round Blocks')

      } else {
        this.statusMessage$.next('Correct - Memorise Next Round Blocks')

      }

    } else {
      // Incorrect result, highliight incorrect blocks
      this.memoryGrid$.next(this.memoryWrong);

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
