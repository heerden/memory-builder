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
  startGrid$ = new BehaviorSubject<number>(this.getSetting('startGrid', 3));
  increaseGrid$ = new BehaviorSubject<number>(this.getSetting('increaseGrid', 1));
  colourSelect$ = new BehaviorSubject<number>(this.getSetting('colourSelect', 6));
  roundTime$ = new BehaviorSubject<number>(this.getSetting('roundTime', 1));
  penaltyTime$ = new BehaviorSubject<number>(this.getSetting('penaltyTime', 1));

  round: number;
  blocks: number;

  interval: any;
  showTime: number;
  timePenalty: number;

  constructor() {
    this.round = 0;
    this.blocks = 0;
    this.showTime = 0;
    this.timePenalty = 0;

    // Subscribe to settings change to save them
    this.startGrid$.subscribe(val => this.saveSetting('startGrid', val));
    this.increaseGrid$.subscribe(val => this.saveSetting('increaseGrid', val));
    this.colourSelect$.subscribe(val => this.saveSetting('colourSelect', val));
    this.roundTime$.subscribe(val => this.saveSetting('roundTime', val));
    this.penaltyTime$.subscribe(val => this.saveSetting('penaltyTime', val));

    // Load saved progress
    const loaded = this.loadProgress();
    if (!loaded) {
      this.statusMessage$.next('Press Start');
    }
  }

  private getSetting(key: string, defaultValue: number): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return defaultValue;
    }
    try {
      const val = localStorage.getItem(`memory_setting_${key}`);
      return val !== null ? Number(val) : defaultValue;
    } catch (e) {
      console.error('Error reading setting from localStorage', e);
      return defaultValue;
    }
  }

  private saveSetting(key: string, value: number) {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      localStorage.setItem(`memory_setting_${key}`, String(value));
    } catch (e) {
      console.error('Error saving setting to localStorage', e);
    }
  }

  private saveProgress() {
    if (typeof window === 'undefined' || !window.localStorage) {
      return;
    }
    try {
      const progress = {
        round: this.round,
        blocks: this.blocks,
        timePenalty: this.timePenalty,
        memoryGrid: this.memoryGrid,
        memoryRetain: this.memoryRetain,
        memoryWhite: this.memoryWhite,
        memoryWrong: this.memoryWrong,
        isMemorising: this.isMemorising$.value,
        isCorrect: this.isCorrect$.value,
        statusMessage: this.statusMessage$.value,
        memInterval: this.memInterval$.value,
        showTime: this.showTime
      };
      localStorage.setItem('memory_game_progress', JSON.stringify(progress));
    } catch (e) {
      console.error('Error saving progress to localStorage', e);
    }
  }

  private loadProgress(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    try {
      const saved = localStorage.getItem('memory_game_progress');
      if (!saved) {
        return false;
      }
      const progress = JSON.parse(saved);
      if (progress && progress.round !== undefined) {
        this.round = progress.round;
        this.blocks = progress.blocks;
        this.timePenalty = progress.timePenalty;
        this.memoryGrid = progress.memoryGrid;
        this.memoryRetain = progress.memoryRetain;
        this.memoryWhite = progress.memoryWhite;
        this.memoryWrong = progress.memoryWrong;
        this.showTime = progress.showTime || 0;

        this.isMemorising$.next(progress.isMemorising);
        this.isCorrect$.next(progress.isCorrect);
        this.statusMessage$.next(progress.statusMessage);
        this.memInterval$.next(progress.memInterval);

        if (progress.round > 0) {
          if (progress.isMemorising) {
            if (progress.isCorrect) {
              this.memoryGrid$.next(this.memoryRetain);
            } else {
              this.memoryGrid$.next(this.memoryWrong);
            }
            this.resumeTimer();
          } else {
            this.memoryGrid$.next(this.memoryGrid || this.memoryWhite);
          }
        } else {
          this.statusMessage$.next('Press Start');
        }
        return true;
      }
    } catch (e) {
      console.error('Error loading progress from localStorage', e);
    }
    return false;
  }

  private resumeTimer() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log(this.showTime);
      this.showTime += 1;
      this.saveProgress();

      if ((this.showTime >= this.memInterval$.value) || !this.isMemorising$.value) {
        this.rememberStatus();
        clearInterval(this.interval);
      }
    }, 1000);
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
    this.saveProgress();
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

    this.saveProgress();
    return [this.round, this.blocks];
  }

  restart() {

    this.showTime = 0;
    this.round = 0;
    this.blocks = 0;
    this.isCorrect$.next(true);
    this.statusMessage$.next('Press Start');
    clearInterval(this.interval);

    this.saveProgress();
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

    this.saveProgress();
    return [this.round, this.blocks];
  }

  startRound() {
    this.isMemorising$.next(false);
    this.rememberStatus();

    this.saveProgress();
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
        this.statusMessage$.next('First Round')

      } else {
        this.statusMessage$.next('Correct')

      }

    } else {
      // Incorrect result, highlight incorrect blocks
      this.memoryGrid$.next(this.memoryWrong);

      this.timePenalty += this.penaltyTime$.value;

      if (this.memInterval$.value > 0) {
        this.statusMessage$.next('Incorrect');
      }
      else
      {
        this.statusMessage$.next('Incorrect'); // - Negative = Time Penalty
      }

    }
    this.memInterval$.next((this.startGrid$.value + this.round-1) * this.roundTime$.value - this.timePenalty);

    clearInterval(this.interval);
    this.interval = setInterval(() => {
      console.log(this.showTime);
      this.showTime += 1;
      this.saveProgress();

      if ((this.showTime >= this.memInterval$.value) || !this.isMemorising$.value) {

        this.rememberStatus();
        clearInterval(this.interval);
      }
    }, 1000);

    this.saveProgress();
  }

  rememberStatus() {
    console.log("Cleared");

    this.showTime = 0;
    this.isMemorising$.next(false);
    this.statusMessage$.next('Build Blocks');

    this.memoryGrid$.next(this.memoryWhite);
    this.saveProgress();
  }
}
